import { IKafkaCommand } from '../../../../../common/interfaces/messaging.interfaces';

export class AddSceneObjectCommand extends IKafkaCommand {
  public topic = 'game-scene.command.add-object';
  constructor(
    public readonly sceneId: string,
    public readonly layerId: string,
    public readonly objectId: string,
    public readonly payload: any,
  ) {
    console.log(payload);
    super('game-scene.command.add-object');
  }
}
