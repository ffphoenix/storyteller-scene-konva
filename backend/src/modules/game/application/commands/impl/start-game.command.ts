import { IKafkaCommand } from '../../../../../common/interfaces/messaging.interfaces';

export class StartGameCommand extends IKafkaCommand {
  public readonly topic = 'game.command.start';
  constructor(
    public readonly id: number,
    public readonly ownerId: number,
  ) {
    super('game.command.start');
  }
}
