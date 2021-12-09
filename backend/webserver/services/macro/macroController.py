from .. import socketio
from .service import list_macro, play_macro, record_macro, remove_macro, update_macro

MACROSET = "default"
avaliable_macros = []
isRecord = False
playingMacroStatus = {}
isReady = True

def updateFrontend():
    print("send update")
    socketio.emit("macros:update", {
        "macroname": MACROSET,
        "avaliable_macros": avaliable_macros,
        "isRecord": isRecord,
        "playingMacroStatus": playingMacroStatus,
        "isReady": isReady
    })

def loadMacro():
    global avaliable_macros
    avaliable_macros = list_macro(MACROSET)
    updateFrontend()

@socketio.on('connect')
def connect():
    print("connected to websocket")
    socketio.emit("system:ready")
    loadMacro()

@socketio.on('macros:play')
def play(macro):
    global playingMacroStatus

    name = macro["name"]
    if name:
        playingMacroStatus[name] = True
        updateFrontend()

        play_macro(name)

        playingMacroStatus[name] = False
        del playingMacroStatus[name]
        updateFrontend()

@socketio.on('macros:get')
def getMacro():
    global avaliable_macros
    avaliable_macros = list_macro(MACROSET)
    return avaliable_macros

@socketio.on('macros:getAll')
def getAllMacro():
    updateFrontend()

@socketio.on('macros:record')
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

@socketio.on('macros:update')
def updateMacro(macro):
    if "oldName" not in macro or "newName" not in macro:
        return

    oldName = macro["oldName"]
    newName = macro["newName"]
    update_macro(oldName, newName)

    loadMacro()

@socketio.on('macros:remove')
def removeMacro(macro):
    if "name" not in macro:
        return

    name = macro["name"]
    remove_macro(name)
    
    loadMacro()