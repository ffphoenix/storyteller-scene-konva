import { IKafkaCommand } from '../../../../../common/interfaces/messaging.interfaces';

export class ModifySceneObjectCommand extends IKafkaCommand {
  constructor(
    public readonly sceneId: string,
    public readonly layerId: string,
    public readonly objectId: string,
    public readonly payload: any,
  ) {
    super('game-scene.command.modify-object');
  }
}
