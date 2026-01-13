import { IMessageSource } from '@nestjs/cqrs';
import { Subject } from 'rxjs';
import { Consumer } from 'kafkajs';
import { MessagesRegistry } from './MessagesRegistry';
import { KafkaService } from './KafkaService';
import { Inject } from '@nestjs/common';

class KafkaSubscriber implements IMessageSource {
  private readonly kafkaConsumer: Consumer;
  private bridges: Subject<any>[] = [];

  constructor(@Inject(KafkaService) kafkaService: KafkaService) {
    this.kafkaConsumer = kafkaService.getConsumer();
  }

  async connect(): Promise<void> {
    await this.kafkaConsumer.connect();
    await this.kafkaConsumer.subscribe({ topics: MessagesRegistry.getAllTopics(), fromBeginning: false });

    await this.kafkaConsumer.run({
      eachMessage: async ({ topic, message }) => {
        if (this.bridges.length > 0) {
          const event = MessagesRegistry.get(topic);
          const parsedJson = JSON.parse(message.value.toString());
          const receivedEvent = Object.assign(new event(), parsedJson);
          console.log('------> Received event:', receivedEvent);
          this.bridges.forEach((bridge) => bridge.next(receivedEvent));
        }
      },
    });
  }

  bridgeEventsTo<T>(subject: Subject<T>) {
    this.bridges.push(subject);
  }
}

export default KafkaSubscriber;
