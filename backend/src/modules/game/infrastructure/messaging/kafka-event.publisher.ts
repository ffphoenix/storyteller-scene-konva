import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Kafka, Producer } from 'kafkajs';
import { GameCreatedEvent, GameModifiedEvent, GameStartedEvent, GameDeletedEvent } from '../../domain/events/game.events';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KafkaEventPublisher implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;

  constructor(private configService: ConfigService) {
    this.kafka = new Kafka({
      clientId: 'game-service',
      brokers: [this.configService.get<string>('KAFKA_BROKER') || 'localhost:9092'],
    });
    this.producer = this.kafka.producer();
  }

  async onModuleInit() {
    await this.producer.connect();
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  async publish(event: any) {
    const topic = `game.${event.constructor.name}`;
    // Convert bigint to string for JSON serialization
    const payload = JSON.parse(JSON.stringify(event, (_, v) => (typeof v === 'bigint' ? v.toString() : v)));
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(payload) }],
    });
  }
}

@EventsHandler(GameCreatedEvent, GameModifiedEvent, GameStartedEvent, GameDeletedEvent)
export class GameEventsHandler implements IEventHandler<GameCreatedEvent | GameModifiedEvent | GameStartedEvent | GameDeletedEvent> {
  constructor(private readonly kafkaPublisher: KafkaEventPublisher) {}

  async handle(event: GameCreatedEvent | GameModifiedEvent | GameStartedEvent | GameDeletedEvent) {
    await this.kafkaPublisher.publish(event);
  }
}
