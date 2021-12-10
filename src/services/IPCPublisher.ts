import Chat from '../models/chat';
import ILiveChatPublisher from './interfaces/ILiveChatPublisher';
import ILiveChatSubscriber from './interfaces/ILiveChatSubscriber';
import { ipcMain } from 'electron';

export default class IPCPublisher implements ILiveChatPublisher {
  private subscribers: ILiveChatSubscriber[] = [];
  private serviceName: string;

  public constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  public start = (): void => {
    ipcMain.on(`${this.serviceName}:message`, (_, chat: Chat) => {
      this.publish([chat]);
    });
  };

  public stop = (): void => {
    ipcMain.removeAllListeners(`${this.serviceName}:message`);

    this.subscribers = [];
  };

  public register = (subscriber: ILiveChatSubscriber): void => {
    this.subscribers.push(subscriber);
  };

  private publish(chats: Chat[]): void {
    for (let i = 0; i < this.subscribers.length; i++) {
      const subscriber = this.subscribers[i];
      subscriber.receivedChat(chats);
    }
  }

  public isMatchServiceName(name: string): boolean {
    return this.serviceName === name;
  }
}
