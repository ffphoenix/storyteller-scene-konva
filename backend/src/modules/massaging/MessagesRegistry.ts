import { IKafkaMessage } from '../../common/interfaces/messaging.interfaces';
import { Type } from '@nestjs/common';

export class MessagesRegistry {
  private static instance: MessagesRegistry | null = null;
  private messages: Map<string, Type<IKafkaMessage>> = new Map();
  private constructor() {}

  public static getInstance(): MessagesRegistry {
    if (!MessagesRegistry.instance) {
      MessagesRegistry.instance = new MessagesRegistry();
    }
    return MessagesRegistry.instance;
  }

  public static register(messages: Type<IKafkaMessage>[]) {
    const registry = MessagesRegistry.getInstance();
    messages.forEach((message) => {
      registry.messages.set(message.name, message);
    });
  }

  public static get(topic: string): Type<IKafkaMessage> {
    return MessagesRegistry.getInstance().messages.get(topic);
  }

  public static getAll(): Type<IKafkaMessage>[] {
    return Array.from(MessagesRegistry.getInstance().messages.values());
  }
  public static getAllTopics(): string[] {
    return Array.from(MessagesRegistry.getInstance().messages.keys());
  }
}
