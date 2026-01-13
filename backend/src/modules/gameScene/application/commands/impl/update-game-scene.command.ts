import { IKafkaCommand } from '../../../../../common/interfaces/messaging.interfaces';
import { GridMetricSystem, GridType } from '../../../domain/aggregates/game-scene.types';

export class UpdateGameSceneCommand extends IKafkaCommand {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly stageWidth?: number,
    public readonly stageHeight?: number,
    public readonly backgroundColor?: string,
    public readonly gridType?: GridType,
    public readonly gridCellSize?: number,
    public readonly gridMetricSystem?: GridMetricSystem,
    public readonly isActive?: boolean,
  ) {
    super('game-scene.command.update-scene');
  }
}
