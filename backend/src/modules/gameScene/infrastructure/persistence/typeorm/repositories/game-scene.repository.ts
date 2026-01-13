import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IGameSceneRepository } from '../../../../domain/repositories/game-scene.repository.interface';
import { GameScene } from '../../../../domain/aggregates/game-scene.aggregate';
import { GameSceneEntity } from '../entities/game-scene.entity';
import { GameSceneLayerEntity } from '../entities/game-scene-layer.entity';
import { GameSceneLayer } from '../../../../domain/entities/game-scene-layer.entity';

@Injectable()
export class GameSceneRepository implements IGameSceneRepository {
  constructor(
    @InjectRepository(GameSceneEntity)
    private readonly repository: Repository<GameSceneEntity>,
    @InjectRepository(GameSceneLayerEntity)
    private readonly layerRepository: Repository<GameSceneLayerEntity>,
  ) {}

  async findById(id: string): Promise<GameScene | null> {
    const entity = await this.repository.findOne({ where: { id }, relations: ['layers'] });
    return entity ? this.toDomain(entity) : null;
  }

  async findActiveByGameId(gameId: number): Promise<GameScene | null> {
    const entity = await this.repository.findOne({
      where: { gameId, isActive: true },
      relations: ['layers'],
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(page: number, limit: number): Promise<[GameScene[], number]> {
    const [entities, count] = await this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return [entities.map((entity) => this.toDomain(entity)), count];
  }

  async save(gameScene: GameScene): Promise<void> {
    const entity = this.toEntity(gameScene);
    await this.repository.save(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(entity: GameSceneEntity): GameScene {
    const layers = (entity.layers || [])
      .sort((a, b) => a.order - b.order)
      .map((l) => new GameSceneLayer(l.id, l.name, l.isLocked, l.isVisible, l.order));

    return new GameScene(
      entity.id,
      entity.gameId,
      entity.name,
      entity.stageJSON,
      entity.stageWidth,
      entity.stageHeight,
      entity.backgroundColor,
      entity.gridType,
      entity.gridCellSize,
      entity.gridMetricSystem,
      entity.isActive,
      layers,
    );
  }

  private toEntity(gameScene: GameScene): GameSceneEntity {
    const entity = new GameSceneEntity();
    entity.id = gameScene.getId();
    entity.gameId = gameScene.getGameId();
    entity.name = gameScene.getName();
    entity.stageJSON = gameScene.getStageJSON();
    entity.stageWidth = gameScene.getStageWidth();
    entity.stageHeight = gameScene.getStageHeight();
    entity.backgroundColor = gameScene.getBackgroundColor();
    entity.gridType = gameScene.getGridType();
    entity.gridCellSize = gameScene.getGridCellSize();
    entity.gridMetricSystem = gameScene.getGridMetricSystem();
    entity.isActive = gameScene.getIsActive();
    entity.layers = gameScene.getLayers().map((l) => {
      const le = new GameSceneLayerEntity();
      le.id = l.id;
      le.name = l.name;
      le.isLocked = l.isLocked;
      le.isVisible = l.isVisible;
      le.order = l.order;
      le.sceneId = gameScene.getId();
      return le;
    });
    return entity;
  }
}
