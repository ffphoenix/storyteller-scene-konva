import { Module, OnModuleInit } from '@nestjs/common';
import { KafkaService } from './KafkaService';
import KafkaSubscriber from './KafkaSubscriber';
import KafkaPublisher from './KafkaPublisher';
import { CommandBus, CqrsModule, EventBus } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [CqrsModule, ConfigModule.forRoot()],
  providers: [KafkaService, KafkaSubscriber, KafkaPublisher],
  exports: [KafkaService, KafkaSubscriber, KafkaPublisher],
})
export class MessagingModule implements OnModuleInit {
  constructor(
    private readonly event$: EventBus,
    private readonly commands$: CommandBus,
    private readonly kafkaPublisher: KafkaPublisher,
    private readonly kafkaSubscriber: KafkaSubscriber,
  ) {}

  async onModuleInit(): Promise<any> {
    await this.kafkaSubscriber.connect();
    this.kafkaSubscriber.bridgeEventsTo(this.event$.subject$);
    this.kafkaSubscriber.bridgeEventsTo(this.commands$.subject$);

    await this.kafkaPublisher.connect();
    this.event$.publisher = this.kafkaPublisher;
    this.commands$.publisher = this.kafkaPublisher;
  }
}
