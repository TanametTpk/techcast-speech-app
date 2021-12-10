import Chat from '../models/chat';
import ILiveChatPublisher from './interfaces/ILiveChatPublisher';
import ILiveChatSubscriber from './interfaces/ILiveChatSubscriber';
import { Socket } from 'socket.io-client';
import SocketManager from './SocketManager';

export default class SocketMessagePublisher implements ILiveChatPublisher {
  private client!: Socket;
  private subscribers: ILiveChatSubscriber[] = [];
  private serviceName: string;

  public constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  public start = (): void => {
    this.client = SocketManager.getInstance().getSocket();

    this.client.on(`${this.serviceName}:message`, (message: string) => {
      let chat: Chat = {
        message,
      };
      this.publish([chat]);
    });
    
    this.client.emit(`${this.serviceName}:start`);
    
  };

  public stop = (): void => {
    if (!this.client) return;
    this.client.removeAllListeners(`${this.serviceName}:message`);
    this.client.emit(`${this.serviceName}:stop`);
    
    this.subscribers = []
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
