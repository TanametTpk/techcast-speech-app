import IMacroPlayer from './interfaces/IMacroPlayer';
import IMacroRecorder from './interfaces/IMacroRecorder';
import { Socket } from 'socket.io-client';
import SocketManager from './SocketManager';
import { MacroStatus, MacroStoreValue } from '../state/macroStote';

export default class MacroManager implements IMacroRecorder, IMacroPlayer {
  private avaliableMacros: string[];
  private static instance?: IMacroRecorder & IMacroPlayer;
  private isRecord: boolean;
  private playingMacro: Map<string, boolean>;
  private isReady: boolean;
  private socket: Socket;

  public constructor() {
    this.avaliableMacros = [];
    this.isRecord = false;
    this.isReady = false;
    this.playingMacro = new Map();
    this.loadMacro();
    this.socket = SocketManager.getInstance().getSocket();

    this.socket.on("macros:update", (macroState: MacroStoreValue) => {
      this.avaliableMacros = macroState.avaliable_macros
      this.isRecord = macroState.isRecord
      this.isReady = macroState.isReady
      this.playingMacro = this.parseToMap(macroState.playingMacroStatus)
    })
  }

  private parseToMap(status: MacroStatus): Map<string, boolean> {
    let keys = Object.keys(status)
    let results = new Map<string, boolean>()
    keys.map((key) => {
      results.set(key, status[key])
    })
    return results
  }

  public static getInstance(): IMacroRecorder & IMacroPlayer {
    if (!this.instance) this.instance = new MacroManager();
    return this.instance;
  }

  private async loadMacro() {
    this.socket.emit("macros:getAll")
  }

  public play(marcoName: string) {
    if (this.isAnyMacroPlaying()) return;
    this.socket.emit("macros:play", {name: marcoName})
  }

  public isPlaying(macroName: string): boolean {
    return this.playingMacro.has(macroName);
  }

  public isAnyMacroPlaying(): boolean {
    return this.playingMacro.size > 0;
  }

  public getMacroList(): string[] {
    return this.avaliableMacros;
  }

  public async record(marcoName: string) {
    if (this.isRecord) return;
    this.socket.emit("macros:record", {name: marcoName})
  }

  public async update(oldName: string, newName: string) {
    this.socket.emit("macros:update", {oldName, newName})
  }

  public async delete(macroName: string) {
    this.socket.emit("macros:remove", {name: macroName})
  }

  public setReady(isReady: boolean) {
    this.isReady = isReady;
  }
}
