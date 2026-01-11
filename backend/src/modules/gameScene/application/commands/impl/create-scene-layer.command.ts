import { IKafkaCommand } from '../../../../../common/interfaces/messaging.interfaces';

export class CreateSceneLayerCommand extends IKafkaCommand {
  constructor(
    public readonly sceneId: string,
    public readonly name: string,
    public readonly isLocked?: boolean,
    public readonly isVisible?: boolean,
  ) {
    super('game-scene.command.create-layer');
  }
}
