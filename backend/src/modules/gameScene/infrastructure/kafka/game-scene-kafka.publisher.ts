import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Kafka, Producer } from 'kafkajs';
import { ConfigService } from '@nestjs/config';
import { SceneObjectAdded, SceneObjectModified, SceneObjectDeleted } from '../../domain/events/scene-object.events';

@Injectable()
export class GameSceneKafkaPublisher implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;

  constructor(private configService: ConfigService) {
    this.kafka = new Kafka({
      clientId: 'game-scene-service',
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
    const topic = this.getTopicForEvent(event);
    const payload = {
      eventType: event.constructor.name,
      sceneId: event.sceneId,
      layerId: event.layerId,
      objectId: event.objectId,
      payload: event.payload,
      occurredAt: event.occurredAt,
    };

    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(payload) }],
    });
  }

  private getTopicForEvent(event: any): string {
    if (event instanceof SceneObjectAdded) return 'scene-object-added';
    if (event instanceof SceneObjectModified) return 'scene-object-modified';
    if (event instanceof SceneObjectDeleted) return 'scene-object-deleted';
    return 'game-scene-events';
  }
}

@EventsHandler(SceneObjectAdded, SceneObjectModified, SceneObjectDeleted)
export class GameSceneEventsHandler implements IEventHandler<SceneObjectAdded | SceneObjectModified | SceneObjectDeleted> {
  constructor(private readonly kafkaPublisher: GameSceneKafkaPublisher) {}

  async handle(event: SceneObjectAdded | SceneObjectModified | SceneObjectDeleted) {
    await this.kafkaPublisher.publish(event);
  }
}
