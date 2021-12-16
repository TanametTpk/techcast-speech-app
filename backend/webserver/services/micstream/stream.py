import sounddevice as sd
import numpy as np
from .. import socketio

SHOULD_STOP = False
IS_MIC_ACTIVE = False
ACTION_RATIO = []
ACTION_MESSAGE = []

def sendMessage(vol, message):
    # socketio.emit("notification:message", {"message": message, "source": "micstream (vol:"+ "{:.2f}".format(vol) +")"})
    socketio.emit("micstream:message", message)

def process(indata, outdata, frames, time, status):
    global IS_MIC_ACTIVE
    volume_norm = np.linalg.norm(indata)*10
    print(volume_norm)

    if len(ACTION_RATIO) < 1:
        return

    if volume_norm < ACTION_RATIO[0]:
        if IS_MIC_ACTIVE:
            sendMessage(volume_norm, "_notActive")
        IS_MIC_ACTIVE = False
        return

    IS_MIC_ACTIVE = True

    if len(ACTION_RATIO) < 2 and ACTION_RATIO[0] < volume_norm:
        sendMessage(volume_norm, ACTION_MESSAGE[0])
        return

    for i in range(len(ACTION_RATIO) - 1):
        lowerVol = ACTION_RATIO[i]
        upperVol = ACTION_RATIO[i+1]

        if volume_norm > lowerVol and volume_norm < upperVol:
            sendMessage(volume_norm, ACTION_MESSAGE[i])
            return

    sendMessage(volume_norm, ACTION_MESSAGE[-1])

@socketio.on('micstream:stop')
def stopRunning():
    global SHOULD_STOP
    SHOULD_STOP = True

@socketio.on('micstream:prepare')
def prepare(config):
    global ACTION_RATIO, ACTION_MESSAGE
    socketio.emit("micstream:prepare")
    socketio.emit("inference:prepare")
    
    # set everything
    if "micstream" in config and "ratios" in config["micstream"]:
        ACTION_RATIO = config["micstream"]["ratios"]

    if "micstream" in config and "messages" in config["micstream"]:
        ACTION_MESSAGE = config["micstream"]["messages"]

    print(ACTION_RATIO, ACTION_MESSAGE)

    socketio.emit("micstream:ready")
    socketio.emit("inference:ready")

@socketio.on('micstream:start')
def running():
    print("micstream:start")
    global SHOULD_STOP
    SHOULD_STOP = False
    
    with sd.Stream(callback=process):
        while not SHOULD_STOP:
            sd.sleep(200)
        sd.CallbackStop()

    socketio.emit("inference:stopped")