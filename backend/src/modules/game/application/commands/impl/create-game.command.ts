import { IKafkaCommand } from '../../../../../common/interfaces/messaging.interfaces';

export class CreateGameCommand extends IKafkaCommand {
  public readonly topic = 'game.command.create';
  constructor(
    public readonly name: string,
    public readonly shortUrl: string,
    public readonly ownerId: number,
  ) {
    super('game.command.create');
  }
}
