import { GridMetricSystem, GridType } from '../../../domain/aggregates/game-scene.types';

export class CreateGameSceneCommand {
  constructor(
    public readonly gameId: number,
    public readonly name: string,
    public readonly stageWidth?: number,
    public readonly stageHeight?: number,
    public readonly backgroundColor?: string,
    public readonly gridType?: GridType,
    public readonly gridCellSize?: number,
    public readonly gridMetricSystem?: GridMetricSystem,
  ) {}
}

export class UpdateGameSceneCommand {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly stageWidth?: number,
    public readonly stageHeight?: number,
    public readonly backgroundColor?: string,
    public readonly gridType?: GridType,
    public readonly gridCellSize?: number,
    public readonly gridMetricSystem?: GridMetricSystem,
  ) {}
}

export class DeleteGameSceneCommand {
  constructor(public readonly id: string) {}
}
