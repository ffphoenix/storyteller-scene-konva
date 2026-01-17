import { IKafkaCommand } from '../../../../../common/interfaces/messaging.interfaces';

export class CreateGameHistoryItemCommand extends IKafkaCommand {
  constructor(
    public readonly type: string,
    public readonly userId: string,
    public readonly gameId: number,
    public readonly body: any,
  ) {
    super('');
  }
}
