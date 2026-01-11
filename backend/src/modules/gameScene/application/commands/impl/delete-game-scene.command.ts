import { IKafkaCommand } from '../../../../../common/interfaces/messaging.interfaces';

export class DeleteGameSceneCommand extends IKafkaCommand {
  constructor(public readonly id: string) {
    super('game-scene.command.delete-scene');
  }
}
