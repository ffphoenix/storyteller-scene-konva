import { IKafkaCommand } from '../../../../../common/interfaces/messaging.interfaces';

export class DeleteGameCommand extends IKafkaCommand {
  constructor(
    public readonly id: number,
    public readonly ownerId: number,
  ) {
    super('game.command.delete');
  }
}
