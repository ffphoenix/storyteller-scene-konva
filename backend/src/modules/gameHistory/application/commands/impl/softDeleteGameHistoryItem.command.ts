import { IKafkaCommand } from '../../../../../common/interfaces/messaging.interfaces';

export class SoftDeleteGameHistoryItemCommand extends IKafkaCommand {
  constructor(public readonly id: string) {
    super('');
  }
}
