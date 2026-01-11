import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer, Consumer, EachMessageHandler } from 'kafkajs';

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
    this.consumers.push(this.kafka.consumer({ groupId: 'storyteller-group' }));
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
    // await admin.createTopics({
    //   topics: MessageRegistry.getAllTopics(),
    // });
    this.logger.log('Kafka Producer connected');
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
    this.logger.log('Kafka Messaging Service destroyed');
  }

  async send(topic: string, message: any) {
    return this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
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
