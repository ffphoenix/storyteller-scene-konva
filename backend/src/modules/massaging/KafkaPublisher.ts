import { IEvent, IEventPublisher, IMessageSource } from '@nestjs/cqrs';
import { Producer } from 'kafkajs';
import { KafkaService } from './KafkaService';
import { Inject } from '@nestjs/common';
import { Subject } from 'rxjs';

class KafkaPublisher implements IEventPublisher, IMessageSource {
  private readonly kafkaProducer: Producer;
  private kafkaService: KafkaService;
  constructor(@Inject(KafkaService) kafkaService: KafkaService) {
    this.kafkaService = kafkaService;
    this.kafkaProducer = kafkaService.getProducer();
  }

  async connect(): Promise<void> {
    await this.kafkaProducer.connect();
  }

  publish<TEvent extends IEvent>(event: TEvent) {
    console.log('Publishing event:', event);
    return this.kafkaService.send(event.constructor.name, { value: JSON.stringify(event) });
  }

  publishAll<TEvent extends IEvent>(events: TEvent[]) {
    events.forEach((event) => this.kafkaService.send(event.constructor.name, { value: JSON.stringify(event) }));
  }
  bridgeEventsTo<T extends IEvent>(subject: Subject<T>) {}
}

export default KafkaPublisher;
