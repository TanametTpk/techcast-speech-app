from flask.json import jsonify
from .. import socketio
from .service import list_macro, play_macro, record_macro, remove_macro, update_macro

MACROSET = "default"
avaliable_macros = []
isRecord = False
playingMacroStatus = {}
isReady = True

def updateFrontend():
    print("send update")
    socketio.emit("update", {
        "macroname": MACROSET,
        "avaliable_macros": avaliable_macros,
        "isRecord": isRecord,
        "playingMacroStatus": playingMacroStatus,
        "isReady": isReady
    }, namespace="/macro")

def loadMacro():
    global avaliable_macros
    avaliable_macros = list_macro(MACROSET)
    updateFrontend()

@socketio.on('connect', namespace="/macro")
def connect():
    print("connected to websocket")
    loadMacro()

@socketio.on('play', namespace="/macro")
def play(macro):
    global playingMacroStatus

    name = macro["name"]
    if name:
        playingMacroStatus[name] = True
        updateFrontend()

        play_macro()

        playingMacroStatus[name] = False
        updateFrontend()

@socketio.on('get', namespace="/macro")
def getMacro():
    global avaliable_macros
    avaliable_macros = list_macro(MACROSET)
    return avaliable_macros

@socketio.on('record', namespace="/macro")
def recordMacro(macro):
    global isRecord, isReady
    if isRecord or not isReady:
        return

    if "name" not in macro:
        return

    name = macro["name"]

    isRecord = True
    updateFrontend()

    record_macro(name)

    isRecord = False
    loadMacro()
    updateFrontend()

@socketio.on('update', namespace="/macro")
def updateMacro(macro):
    if "oldName" not in macro or "newName" not in macro:
        return

    oldName = macro["oldName"]
    newName = macro["newName"]
    update_macro(oldName, newName)

    loadMacro()
    updateFrontend()

@socketio.on('remove', namespace="/macro")
def removeMacro(macro):
    if "name" not in macro:
        return

    name = macro["name"]
    remove_macro(name)
    
    loadMacro()
    updateFrontend()