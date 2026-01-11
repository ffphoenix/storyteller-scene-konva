import { IKafkaCommand } from '../../../../../common/interfaces/messaging.interfaces';

export class DeleteSceneObjectCommand extends IKafkaCommand {
  constructor(
    public readonly sceneId: string,
    public readonly layerId: string,
    public readonly objectId: string,
  ) {
    super('game-scene.command.delete-object');
  }
}
