import { IKafkaEvent } from '../../../../common/interfaces/messaging.interfaces';

export class GameCreatedEvent extends IKafkaEvent {
  constructor(
    public readonly id: number,
    public readonly shortUrl: string,
    public readonly name: string,
    public readonly ownerId: number,
  ) {
    super('game.event.created');
  }
}

export class GameModifiedEvent extends IKafkaEvent {
  constructor(
    public readonly id: number,
    public readonly name: string,
  ) {
    super('game.event.modified');
  }
}

export class GameStartedEvent extends IKafkaEvent {
  constructor(public readonly id: number) {
    super('game.event.started');
  }
}

export class GameDeletedEvent extends IKafkaEvent {
  constructor(public readonly id: number) {
    super('game.event.deleted');
  }
}
