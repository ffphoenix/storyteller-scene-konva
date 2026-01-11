import { IKafkaCommand } from '../../../../../common/interfaces/messaging.interfaces';

export class DeleteSceneLayerCommand extends IKafkaCommand {
  constructor(
    public readonly sceneId: string,
    public readonly layerId: string,
  ) {
    super('game-scene.command.delete-layer');
  }
}
