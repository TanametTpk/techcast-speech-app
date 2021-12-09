import IMacroPlayer from './interfaces/IMacroPlayer';
import IMacroRecorder from './interfaces/IMacroRecorder';
import { Socket } from 'socket.io-client';
import SocketManager from './SocketManager';

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
  }

  public static getInstance(): IMacroRecorder & IMacroPlayer {
    if (!this.instance) this.instance = new MacroManager();
    return this.instance;
  }

  private async loadMacro() {
    // const macros: string[] | undefined = await listCommands();
    // if (!macros) {
    //   this.avaliableMacros = [];
    //   return;
    // }
    // this.avaliableMacros = macros;
    // WebServerController.getInstance().sendMacros(this.avaliableMacros);
  }

  public play(marcoName: string) {
    // this.playingMacro.set(marcoName, true);
    // playMacro(marcoName).then(() => {
    //   this.playingMacro.delete(marcoName);
    //   WebServerController.getInstance().sendFinishPlaying();
    // });
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
    // if (this.isRecord || !this.isReady) return;
    // WebServerController.getInstance().sendRecording();
    // await recordMacro(marcoName);
    // this.loadMacro();
    // WebServerController.getInstance().stopRecorded();
  }

  public async update(oldName: string, newName: string) {
    // await renameMacro(oldName, newName);
    // this.loadMacro();
  }

  public async delete(macroName: string) {
    // await removeMacro(macroName);
    // this.loadMacro();
  }

  public setReady(isReady: boolean) {
    this.isReady = isReady;
  }
}
