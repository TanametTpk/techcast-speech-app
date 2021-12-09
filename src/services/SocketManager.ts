
import IO, { Socket } from 'socket.io-client';

export default class SocketManager {
    private socket: Socket
    private static instance?: SocketManager;

    public constructor(url: string) {
        this.socket = IO(url)
    }

    public static getInstance(url?: string): SocketManager {
        if (!this.instance) {
            if (!url) throw new Error("Socket Manager init pharse need url!")
            this.instance = new SocketManager(url);
        }
        return this.instance;
    }

    public getSocket(): Socket {
        return this.socket;
    }

    public close(): void {
        if (!this.socket) return;
        this.socket.emit("system:close")
        this.socket.close();
    }
}