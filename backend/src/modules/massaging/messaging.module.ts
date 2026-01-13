import { Module, OnModuleInit } from '@nestjs/common';
import { KafkaService } from './KafkaService';
import KafkaSubscriber from './KafkaSubscriber';
import { CommandBus, CqrsModule, EventBus } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  providers: [KafkaService, KafkaSubscriber],
  exports: [KafkaService, KafkaSubscriber],
})
export class MessagingModule implements OnModuleInit {
  constructor(
    private readonly events$: EventBus,
    private readonly commands$: CommandBus,
    private readonly kafkaSubscriber: KafkaSubscriber,
  ) {}

  async onModuleInit(): Promise<any> {
    await this.kafkaSubscriber.connect();
    this.kafkaSubscriber.bridgeEventsTo(this.events$.subject$);
    this.kafkaSubscriber.bridgeEventsTo(this.commands$.subject$);
  }
}
