# -*- coding: utf-8 -*-

import logging
import struct
from .. import VADAudio, socketio
import speech_recognition as sr
import os
from datetime import datetime

DEFAULT_SAMPLE_RATE = 16000
SHOULD_STOP = False
logging.basicConfig(level=20)
LANGUAGE = "th-TH"

def transcribe(file, language="th-TH"):
    try:
        r = sr.Recognizer()
        with sr.AudioFile(file) as source:
            audio = r.record(source)
            transcribe = r.recognize_google(audio, language=language)
            return transcribe
    except:
        return ""

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

@socketio.on('googlespeech:stop')
def stopRunning():
    global SHOULD_STOP
    SHOULD_STOP = True

@socketio.on('googlespeech:prepare')
def prepare(config):
    socketio.emit("googlespeech:prepare")
    socketio.emit("inference:prepare")
    global LANGUAGE
    if "googlespeech" in config and "language" in config["googlespeech"]:
        print(config)
        LANGUAGE = config["googlespeech"]["language"]
    socketio.emit("googlespeech:ready")
    socketio.emit("inference:ready")

@socketio.on('googlespeech:start')
def running():
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
            file = os.path.join("./", datetime.now().strftime("savewav_%Y-%m-%d_%H-%M-%S_%f.wav"))
            vad_audio.write_wav(file, wav_data)
            transription = transcribe(file, language="th-TH")
            os.remove(file)

            if len(transription) < 1:
                continue

            socketio.emit("notification:message", transription)
            socketio.emit("googlespeech:message", transription)
            wav_data = bytearray()