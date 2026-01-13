import { IEvent, IEventPublisher } from '@nestjs/cqrs';
import { Message, Producer } from 'kafkajs';
import { KafkaService } from './KafkaService';

class KafkaEventPublisher implements IEventPublisher {
  private readonly kafkaProducer: Producer;
  constructor(kafkaService: KafkaService) {
    this.kafkaProducer = kafkaService.getProducer();
  }

  publish<TEvent extends IEvent>(event: TEvent) {
    console.log('Publishing event:', event);
    const topic = event.constructor.name;
    const messages = [{ value: JSON.stringify(event) }];
    return this.kafkaProducer.send({ topic, messages });
  }

  publishAll<TEvent extends IEvent>(events: TEvent[]) {
    const messages: Map<string, Message[]> = new Map();

    events.forEach((event) => {
      const topic = event.constructor.name;
      const messagesInTopic = messages.get(topic) || [];
      messages.set(topic, [...messagesInTopic, { value: JSON.stringify(event) }]);
    });
    console.log('Publishing events:', messages);
    messages.forEach((messages, topic) => this.kafkaProducer.send({ topic, messages }));
  }
}

export default KafkaEventPublisher;
