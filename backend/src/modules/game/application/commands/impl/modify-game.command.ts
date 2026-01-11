import { IKafkaCommand } from '../../../../../common/interfaces/messaging.interfaces';

export class ModifyGameCommand extends IKafkaCommand {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly ownerId: number,
  ) {
    super('game.command.modify');
  }
}
