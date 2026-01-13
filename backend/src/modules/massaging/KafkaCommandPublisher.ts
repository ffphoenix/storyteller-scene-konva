import { ICommandPublisher, IEvent } from '@nestjs/cqrs';
import { Producer } from 'kafkajs';
import { KafkaService } from './KafkaService';

class KafkaCommandPublisher implements ICommandPublisher {
  private readonly kafkaProducer: Producer;
  constructor(kafkaService: KafkaService) {
    this.kafkaProducer = kafkaService.getProducer();
  }

  publish<TEvent extends IEvent>(event: TEvent) {
    const topic = event.constructor.name;
    const messages = [{ value: JSON.stringify(event) }];
    return this.kafkaProducer.send({ topic, messages });
  }
}

export default KafkaCommandPublisher;
