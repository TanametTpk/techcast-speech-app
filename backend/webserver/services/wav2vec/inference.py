# -*- coding: utf-8 -*-

import logging
from .asr import transcribe_byte, loadModel, switchDevice
import soundfile as sf
import io
import struct
from .. import VADAudio, socketio

DEFAULT_SAMPLE_RATE = 16000
SHOULD_STOP = False
logging.basicConfig(level=20)

def write_header(_bytes, _nchannels, _sampwidth, _framerate):
    WAVE_FORMAT_PCM = 0x0001
    initlength = len(_bytes)
    bytes_to_add = b'RIFF'
    
    _nframes = initlength // (_nchannels * _sampwidth)
    _datalength = _nframes * _nchannels * _sampwidth

    bytes_to_add += struct.pack('<L4s4sLHHLLHH4s',
        36 + _datalength, b'WAVE', b'fmt ', 16,
        WAVE_FORMAT_PCM, _nchannels, _framerate,
        _nchannels * _framerate * _sampwidth,
        _nchannels * _sampwidth,
        _sampwidth * 8, b'data')

    bytes_to_add += struct.pack('<L', _datalength)

    return bytes_to_add + _bytes

@socketio.on('wav2vec:stop')
def stopRunning():
    global SHOULD_STOP
    SHOULD_STOP = True

@socketio.on('wav2vec:prepare')
def prepare(config):
    socketio.emit("wav2vec:prepare")
    socketio.emit("inference:prepare")
    if "wav2vec" in config and "processor" in config["wav2vec"]:
        print(config["wav2vec"]["processor"])
        switchDevice(config["wav2vec"]["processor"])
    loadModel()
    socketio.emit("wav2vec:ready")
    socketio.emit("inference:ready")

@socketio.on('wav2vec:start')
def running():
    print("wav2vec:start")
    global SHOULD_STOP
    SHOULD_STOP = False
    # Start audio with VAD
    vad_audio = VADAudio(aggressiveness=3,
                         device=None,
                         input_rate=DEFAULT_SAMPLE_RATE,
                         file=None)

    frames = vad_audio.vad_collector()

    wav_data = bytearray()
    for frame in frames:
        if SHOULD_STOP:
            socketio.emit("inference:stopped")
            break

        if frame is not None:
            logging.debug("streaming frame")
            try:
                wav_data.extend(frame)
            except:
                wav_data = bytearray()
        else:
            logging.debug("end utterence")
            wav_data = write_header(wav_data, 1, 2, 16_000)
            raw_audio, _ = sf.read(io.BytesIO(wav_data))
            transription = transcribe_byte(raw_audio)
            if len(transription) < 1:
                continue

            socketio.emit("notification:message", {"message": transription, "source": "wav2vec"})
            socketio.emit("wav2vec:message", transription)
            wav_data = bytearray()