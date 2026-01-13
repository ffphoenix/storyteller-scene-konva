import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer, Consumer, EachMessageHandler } from 'kafkajs';
import { MessagesRegistry } from './MessagesRegistry';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private consumers: Consumer[] = [];
  private readonly logger = new Logger(KafkaService.name);

  constructor(private configService: ConfigService) {
    console.log('KafkaService constructor');
    const brokers = this.configService.get<string>('KAFKA_BROKERS').split(',');
    const clientId = this.configService.get<string>('KAFKA_CLIENT_ID');

    if (!brokers) throw new Error('KAFKA_BROKERS is not set');
    if (!clientId) throw new Error('KAFKA_CLIENT_ID is not set');

    this.kafka = new Kafka({
      clientId,
      brokers,
    });
    this.producer = this.kafka.producer();
    const consumerGroupId = 'storyteller-group' + Math.random().toString(16);
    console.log('KafkaService consumerGroupId', consumerGroupId);
    this.consumers.push(this.kafka.consumer({ groupId: consumerGroupId }));
  }

  getProducer() {
    return this.producer;
  }

  getConsumer() {
    return this.consumers[0];
  }

  async onModuleInit() {
    await this.producer.connect();
    const admin = this.kafka.admin();
    await admin.connect();
    const existingTopics = await admin.listTopics();
    const topicsToCreate = [];
    MessagesRegistry.getAllTopics().forEach((topic) => {
      if (!existingTopics.includes(topic)) {
        topicsToCreate.push(topic);
      }
    });
    if (topicsToCreate.length === 0) return;

    await admin.createTopics({
      topics: MessagesRegistry.getAllTopics().map((topic) => ({
        topic,
        numPartitions: 1,
        replicationFactor: 1,
      })),
    });
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
    this.logger.log('Kafka Messaging Service destroyed');
  }

  async subscribe(groupId: string, topics: string[], onMessage: EachMessageHandler) {
    const consumer = this.kafka.consumer({ groupId });
    await consumer.connect();
    console.log('consumer connected', topics);
    for (const topic of topics) {
      await consumer.subscribe({ topic, fromBeginning: false });
    }
    await consumer.run({
      eachMessage: onMessage,
    });
    this.consumers.push(consumer);
    this.logger.log(`Kafka Consumer joined group ${groupId} and subscribed to ${topics.join(', ')}`);
  }
}
