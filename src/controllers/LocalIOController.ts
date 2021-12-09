import { Socket } from "socket.io-client";
import ICommandSubscriber from "../services/interfaces/ICommandSubscriber";
import ResetableIOController from "../services/interfaces/ResetableIOController";
import SocketManager from "../services/SocketManager";

export default class LocalIOController implements ICommandSubscriber {
    private isRecording: boolean
    private ioController: ResetableIOController
    private socket: Socket = SocketManager.getInstance().getSocket()

    public constructor(ioController: ResetableIOController) {
        this.isRecording = false
        this.ioController = ioController
    }
    
    public received(commands: string[]){
        for (let i = 0; i < commands.length; i++) {
            const command = commands[i];

            if (command === "reset") this.reset()
            else if (command === "record") this.recordMacro()
            else if (command === "stop-record") this.stopRecordMacro()
            else if (command === "exit") this.exit()
        }
    }

    private recordMacro() {
        if (this.isRecording) return

        this.isRecording = true
        const max: number = Number.MAX_SAFE_INTEGER
        const min: number = 1
        const randomName: string = `macro-${Math.floor(Math.random() * (max - min) + min)}`
        this.socket.emit("macros:record", {name:randomName})
    }

    private stopRecordMacro() {
    }

    private reset() {
        this.ioController.reset()
    }

    private exit() {
        process.exit()
    }
}