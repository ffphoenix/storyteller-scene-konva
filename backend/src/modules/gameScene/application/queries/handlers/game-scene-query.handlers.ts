import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import {
  GetGameScenesQuery,
  GetGameSceneByIdQuery,
  GetSceneLayersQuery,
  GetActiveGameSceneByGameIdQuery,
} from '../impl/game-scene.queries';
import { IGameSceneRepository } from '../../../domain/repositories/game-scene.repository.interface';

@QueryHandler(GetGameScenesQuery)
export class GetGameScenesHandler implements IQueryHandler<GetGameScenesQuery> {
  constructor(@Inject(IGameSceneRepository) private readonly repository: IGameSceneRepository) {}

  async execute(query: GetGameScenesQuery) {
    const [scenes, total] = await this.repository.findAll(query.page, query.limit);
    return {
      items: scenes.map((s) => ({
        id: s.getId(),
        name: s.getName(),
        stageWidth: s.getStageWidth(),
        stageHeight: s.getStageHeight(),
        backgroundColor: s.getBackgroundColor(),
        gridType: s.getGridType(),
        gridCellSize: s.getGridCellSize(),
        gridMetricSystem: s.getGridMetricSystem(),
        isActive: s.getIsActive(),
      })),
      total,
      page: query.page,
      limit: query.limit,
    };
  }
}

@QueryHandler(GetGameSceneByIdQuery)
export class GetGameSceneByIdHandler implements IQueryHandler<GetGameSceneByIdQuery> {
  constructor(@Inject(IGameSceneRepository) private readonly repository: IGameSceneRepository) {}

  async execute(query: GetGameSceneByIdQuery) {
    const scene = await this.repository.findById(query.id);
    if (!scene) throw new NotFoundException('Game scene not found');

    return {
      id: scene.getId(),
      name: scene.getName(),
      stageJSON: scene.getStageJSON(),
      stageWidth: scene.getStageWidth(),
      stageHeight: scene.getStageHeight(),
      backgroundColor: scene.getBackgroundColor(),
      gridType: scene.getGridType(),
      gridCellSize: scene.getGridCellSize(),
      gridMetricSystem: scene.getGridMetricSystem(),
      isActive: scene.getIsActive(),
      layers: scene.getLayers().map((l) => ({
        id: l.id,
        name: l.name,
        isLocked: l.isLocked,
        isVisible: l.isVisible,
        order: l.order,
      })),
    };
  }
}

@QueryHandler(GetSceneLayersQuery)
export class GetSceneLayersHandler implements IQueryHandler<GetSceneLayersQuery> {
  constructor(@Inject(IGameSceneRepository) private readonly repository: IGameSceneRepository) {}

  async execute(query: GetSceneLayersQuery) {
    const scene = await this.repository.findById(query.sceneId);
    if (!scene) throw new NotFoundException('Game scene not found');

    return scene.getLayers().map((l) => ({
      id: l.id,
      name: l.name,
      isLocked: l.isLocked,
      isVisible: l.isVisible,
      order: l.order,
    }));
  }
}

@QueryHandler(GetActiveGameSceneByGameIdQuery)
export class GetActiveGameSceneByGameIdHandler implements IQueryHandler<GetActiveGameSceneByGameIdQuery> {
  constructor(@Inject(IGameSceneRepository) private readonly repository: IGameSceneRepository) {}

  async execute(query: GetActiveGameSceneByGameIdQuery) {
    const scene = await this.repository.findActiveByGameId(query.gameId);
    if (!scene) throw new NotFoundException('Active game scene not found');

    return {
      id: scene.getId(),
      name: scene.getName(),
      stageJSON: scene.getStageJSON(),
      stageWidth: scene.getStageWidth(),
      stageHeight: scene.getStageHeight(),
      backgroundColor: scene.getBackgroundColor(),
      gridType: scene.getGridType(),
      gridCellSize: scene.getGridCellSize(),
      gridMetricSystem: scene.getGridMetricSystem(),
      isActive: scene.getIsActive(),
      layers: scene.getLayers().map((l) => ({
        id: l.id,
        name: l.name,
        isLocked: l.isLocked,
        isVisible: l.isVisible,
        order: l.order,
      })),
    };
  }
}
