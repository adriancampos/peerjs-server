import { IClient } from "./client";
import { IMessage } from "./message";
import { IMessageQueue, MessageQueue } from "./messageQueue";

const TOKEN_OPTIONS = {
  length: 8,
  chars: '0123456789abcdefghijklmnopqrstuvwxyz'
}

export interface IRealm {
  getClientsIds(): string[];

  getClientById(clientId: string): IClient | undefined;

  getClientsIdsWithQueue(): string[];

  setClient(client: IClient, id: string): void;

  removeClientById(id: string): boolean;

  getMessageQueueById(id: string): IMessageQueue | undefined;

  addMessageToQueue(id: string, message: IMessage): void;

  clearMessageQueue(id: string): void;

  generateClientId(generateClientId?: () => string): string;
}

export class Realm implements IRealm {
  private readonly clients: Map<string, IClient> = new Map();
  private readonly messageQueues: Map<string, IMessageQueue> = new Map();

  public getClientsIds(): string[] {
    return [...this.clients.keys()];
  }

  public getClientById(clientId: string): IClient | undefined {
    return this.clients.get(clientId);
  }

  public getClientsIdsWithQueue(): string[] {
    return [...this.messageQueues.keys()];
  }

  public setClient(client: IClient, id: string): void {
    this.clients.set(id, client);
  }

  public removeClientById(id: string): boolean {
    const client = this.getClientById(id);

    if (!client) return false;

    this.clients.delete(id);

    return true;
  }

  public getMessageQueueById(id: string): IMessageQueue | undefined {
    return this.messageQueues.get(id);
  }

  public addMessageToQueue(id: string, message: IMessage): void {
    if (!this.getMessageQueueById(id)) {
      this.messageQueues.set(id, new MessageQueue());
    }

    this.getMessageQueueById(id)!.addMessage(message);
  }

  public clearMessageQueue(id: string): void {
    this.messageQueues.delete(id);
  }

  private generateToken() {
    var token = '';
    for (var i = 0; i < TOKEN_OPTIONS.length; i++) {
      token += TOKEN_OPTIONS.chars[Math.floor(Math.random() * TOKEN_OPTIONS.chars.length)];
    }
    return token;
  }
  
  public generateClientId(generateClientId?: () => string): string {    

    const generateId = generateClientId ? generateClientId : generateToken;

    let clientId = generateId();

    while (this.getClientById(clientId)) {
      clientId = generateId();
    }

    return clientId;
  }
}
