export abstract class ICommandBus {
  abstract execute<TCommand extends IKafkaMessage, TResult>(command: TCommand): Promise<TResult>;
}

export abstract class IEventPublisher {
  abstract publish<TEvent extends IKafkaMessage>(event: TEvent): Promise<void>;
}

export class IKafkaMessage {
  public static topic: string;
  constructor(public readonly topic: string) {
    this.topic = topic;
  }
}

export class IKafkaEvent extends IKafkaMessage {}
export class IKafkaCommand extends IKafkaMessage {}
