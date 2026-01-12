import { IMessageSource } from '@nestjs/cqrs';
import { Subject } from 'rxjs';
import { Consumer } from 'kafkajs';
import { Inject } from '@nestjs/common';
import { KafkaService } from './KafkaService';
import { MessagesRegistry } from './MessagesRegistry';

class KafkaSubscriber implements IMessageSource {
  private readonly kafkaConsumer: Consumer;
  private bridge: Subject<any>;

  constructor(@Inject(KafkaService) kafkaService: KafkaService) {
    this.kafkaConsumer = kafkaService.getConsumer();
  }

  async connect(): Promise<void> {
    await this.kafkaConsumer.connect();
    await this.kafkaConsumer.subscribe({ topics: MessagesRegistry.getAllTopics(), fromBeginning: false });

    await this.kafkaConsumer.run({
      eachMessage: async ({ topic, message }) => {
        if (this.bridge) {
          const event = MessagesRegistry.get(topic);
          const parsedJson = JSON.parse(message.value.toString());
          const receivedEvent = new event(parsedJson);
          this.bridge.next(receivedEvent);
        }
      },
    });
  }

  bridgeEventsTo<T>(subject: Subject<T>) {
    this.bridge = subject;
  }
}

export default KafkaSubscriber;
