import { BrowserWindow, ipcMain, IpcMainEvent } from 'electron';
import LiveChatController from './controllers/LiveChatController';
import ILiveChatSubscriber from './services/interfaces/ILiveChatSubscriber';
import ILiveChatPublisher from './services/interfaces/ILiveChatPublisher';
import ICommandSubscriber from './services/interfaces/ICommandSubscriber';
import LocalIOController from './controllers/LocalIOController';
import WebHookController from './controllers/WebHookController';
import ICommandPublisher from './services/interfaces/ICommandPublisher';
import LocalIOPublisher from './services/LocalIOPublisher';
import RobotJSIOController from './services/RobotJSIOController';
// import LiveChatAdapter from './services/LiveChatAdapter';
import {
  CommandConfig,
  Configs,
  loadCommandConfig,
  readConfig,
} from './utils/loadConfig';
import IMacroPlayer from './services/interfaces/IMacroPlayer';
import LiveChatReplaceAdapter from './services/LiveChatReplaceAdapter';
import { Settings, writeConfig } from './utils/ConfigWriter';
import SocketMessagePublisher from './services/SocketMessagePublisher';
import MacroManager from './services/MacroManager';
import MessageIncludeAdapter from './services/MessageIncludeAdapter';
import IPCPublisher from './services/IPCPublisher';

export default class LiveChatManager {
  private sourcePath: string;
  private commandPath: string;

  private mainWindow: BrowserWindow;

  private source!: Configs;
  private commandConfig!: CommandConfig;

  // private webServer!: WebServerController;
  private ioController!: RobotJSIOController;
  private macroController!: IMacroPlayer;

  private localController!: ICommandSubscriber;
  private chatSubscriber!: ILiveChatSubscriber;
  private webHookSubscriber!: ILiveChatSubscriber;
  // private notificationSubscriber!: ILiveChatSubscriber;

  // TODO - should we have publisher/subscriber/controller manager? - Refactor ?
  private ioPublisher!: ICommandPublisher;
  private wav2vecPublisher!: ILiveChatPublisher;
  private googleSpeechPublisher!: ILiveChatPublisher;
  private teachablePublisher!: ILiveChatPublisher;

  public constructor(
    sourceConfigPath: string,
    commandConfigPath: string,
    mainWindow: BrowserWindow
  ) {
    this.sourcePath = sourceConfigPath;
    this.commandPath = commandConfigPath;
    this.mainWindow = mainWindow;

    this.loadConfig();
    this.init();
  }

  private loadConfig() {
    this.source = readConfig(this.sourcePath);
    this.commandConfig = loadCommandConfig(this.commandPath);
  }

  public start(): void {
    // TODO - repeat code - Refactor ?
    let allowList: boolean[] = [
      this.source.wav2vec.allow,
      this.source.googlespeech.allow,
      this.source.teachable.allow,
    ];

    let publishers: ILiveChatPublisher[] = [
      this.wav2vecPublisher,
      this.googleSpeechPublisher,
      this.teachablePublisher,
    ];

    for (let i = 0; i < publishers.length; i++) {
      if (!allowList[i]) continue;
      const publisher = publishers[i];

      // publisher.register(this.notificationSubscriber)
      publisher.register(this.chatSubscriber);
      if (this.source.webhooks.allow)
        publisher.register(this.webHookSubscriber);

      publisher.start();
    }
  }

  private init(): void {
    this.createWebServer();
    this.createAdminControllers();
    this.createSubscribers();
    this.createPublishers();
    this.createAdapters();
    this.startAdminController();

    ipcMain.removeAllListeners('settings:get');
    ipcMain.removeAllListeners('settings:save');
    ipcMain.on('settings:get', (event: IpcMainEvent) => {
      event.returnValue = {
        sources: this.source,
        commands: this.commandConfig,
      };
    });

    ipcMain.on('settings:save', (_: IpcMainEvent, settings: Settings) => {
      writeConfig(this.sourcePath, this.commandPath, settings);
    });
  }

  private createWebServer() {
    // this.webServer = WebServerController.getInstance(3000, this.mainWindow);
    // this.webServer.start();
  }

  private createAdminControllers() {
    this.ioController = new RobotJSIOController();
    this.localController = new LocalIOController(this.ioController);
    this.macroController = MacroManager.getInstance();
  }

  private createSubscribers() {
    this.chatSubscriber = new LiveChatController(
      this.ioController,
      this.ioController,
      this.macroController
    );
    this.webHookSubscriber = new WebHookController(this.source.webhooks.urls);
  }

  private createPublishers() {
    this.ioPublisher = new LocalIOPublisher();

    this.wav2vecPublisher = new SocketMessagePublisher('wav2vec', this.source);
    this.googleSpeechPublisher = new SocketMessagePublisher(
      'googlespeech',
      this.source
    );
    this.teachablePublisher = new IPCPublisher('teachable');
  }

  private startAdminController() {
    this.ioPublisher.register(this.localController);
    this.ioPublisher.start();
  }

  private createAdapters() {
    // should we use builder pattern?
    this.chatSubscriber = new MessageIncludeAdapter(
      this.chatSubscriber,
      this.commandConfig.commands
    );
    this.webHookSubscriber = new MessageIncludeAdapter(
      this.webHookSubscriber,
      this.commandConfig.commands
    );

    if (this.commandConfig.useReplace) {
      this.chatSubscriber = new LiveChatReplaceAdapter(
        this.chatSubscriber,
        this.commandConfig.replaces
      );
      this.webHookSubscriber = new LiveChatReplaceAdapter(
        this.webHookSubscriber,
        this.commandConfig.replaces
      );
    }
  }

  public close(): void {
    // TODO - repeat code - Refactor ?
    let allowList: boolean[] = [
      this.source.wav2vec.allow,
      this.source.googlespeech.allow,
      this.source.teachable.allow,
    ];

    let publishers: ILiveChatPublisher[] = [
      this.wav2vecPublisher,
      this.googleSpeechPublisher,
      this.teachablePublisher,
    ];

    this.ioPublisher.stop();

    for (let i = 0; i < publishers.length; i++) {
      if (!allowList[i]) continue;
      const publisher = publishers[i];
      publisher.stop();
    }
  }

  public clear(): void {
    this.close();
    this.ioPublisher.stop();
    // this.webServer.stop();

    ipcMain.removeAllListeners('settings:get');
    ipcMain.removeAllListeners('settings:save');
  }

  public reload(): void {
    this.clear();
    this.loadConfig();
    this.init();

    this.mainWindow.webContents.send('settings:received', {
      sources: this.source,
      commands: this.commandConfig,
    });
  }
}
