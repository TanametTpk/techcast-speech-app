import Chat from '../models/chat';
import ILiveChatPublisher from './interfaces/ILiveChatPublisher';
import ILiveChatSubscriber from './interfaces/ILiveChatSubscriber';
import { Socket } from 'socket.io-client';
import SocketManager from './SocketManager';
import { Configs } from '../utils/loadConfig';

export default class SocketMessagePublisher implements ILiveChatPublisher {
  private client!: Socket;
  private subscribers: ILiveChatSubscriber[] = [];
  private serviceName: string;
  private configs: Configs;

  public constructor(serviceName: string, configs: Configs) {
    this.serviceName = serviceName;
    this.configs = configs;
  }

  public start = (): void => {
    this.client = SocketManager.getInstance().getSocket();

    this.client.on(`${this.serviceName}:message`, (message: string) => {
      let chat: Chat = {
        message,
      };
      this.publish([chat]);
    });

    this.client.on(`${this.serviceName}:ready`, () => {
      this.client.emit(`${this.serviceName}:start`);
    });

    this.client.emit(`${this.serviceName}:prepare`, this.configs);
  };

  public stop = (): void => {
    if (!this.client) return;
    this.client.removeAllListeners(`${this.serviceName}:message`);
    this.client.removeAllListeners(`${this.serviceName}:ready`);
    this.client.emit(`${this.serviceName}:stop`);

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
}
