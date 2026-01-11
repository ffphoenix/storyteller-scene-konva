import { IEvent, IMessageSource } from '@nestjs/cqrs';
import { Subject } from 'rxjs';
import { Consumer } from 'kafkajs';
import { Inject } from '@nestjs/common';
import { KafkaService } from './KafkaService';

class KafkaSubscriber implements IMessageSource {
  private readonly kafkaConsumer: Consumer;
  private bridge: Subject<any>;
  private readonly events: Array<any>;

  constructor(@Inject(KafkaService) kafkaService: KafkaService) {
    this.kafkaConsumer = kafkaService.getConsumer();
    this.events = [];
  }

  async connect(): Promise<void> {
    await this.kafkaConsumer.connect();
    for (const event of this.events) {
      await this.kafkaConsumer.subscribe({ topic: event.name, fromBeginning: false });
    }

    await this.kafkaConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (this.bridge) {
          for (const event of this.events) {
            if (event.name === topic) {
              const parsedJson = JSON.parse(message.value.toString());
              const receivedEvent = new event(parsedJson);
              this.bridge.next(receivedEvent);
            }
          }
        }
      },
    });
  }

  bridgeEventsTo<T extends IEvent>(subject: Subject<T>): any {
    this.bridge = subject;
  }
}

export default KafkaSubscriber;
