import { IKafkaCommand } from '../../../../../common/interfaces/messaging.interfaces';
import { GridMetricSystem, GridType } from '../../../domain/aggregates/game-scene.types';

export class CreateGameSceneCommand extends IKafkaCommand {
  constructor(
    public readonly gameId: number,
    public readonly name: string,
    public readonly stageWidth?: number,
    public readonly stageHeight?: number,
    public readonly backgroundColor?: string,
    public readonly gridType?: GridType,
    public readonly gridCellSize?: number,
    public readonly gridMetricSystem?: GridMetricSystem,
  ) {
    super('game-scene.command.create-scene');
  }
}
