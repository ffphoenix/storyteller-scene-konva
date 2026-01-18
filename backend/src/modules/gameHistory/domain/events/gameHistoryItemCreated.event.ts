import { IKafkaEvent } from '../../../../common/interfaces/messaging.interfaces';

export class GameHistoryItemCreatedEvent extends IKafkaEvent {
  constructor(
    public readonly id: string,
    public readonly gameId: number,
    public readonly userId: number,
    public readonly type: string,
    public readonly body: any,
    public readonly createdAt: Date,
  ) {
    super('');
  }
}
