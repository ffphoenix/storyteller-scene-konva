import { IEventPublisher } from '@nestjs/cqrs';
import { Producer, RecordMetadata } from 'kafkajs';
import { KafkaService } from './KafkaService';
import { Inject } from '@nestjs/common';

class KafkaPublisher implements IEventPublisher {
  private readonly kafkaProducer: Producer;
  private kafkaService: KafkaService;
  constructor(@Inject(KafkaService) kafkaService: KafkaService) {
    this.kafkaService = kafkaService;
    this.kafkaProducer = kafkaService.getProducer();
  }

  async connect(): Promise<void> {
    await this.kafkaProducer.connect();
  }

  publish<T>(event: T): Promise<RecordMetadata[]> {
    console.log('Publishing event:', event);
    return this.kafkaService.send(event.constructor.name, { value: JSON.stringify(event) });
  }
}

export default KafkaPublisher;
