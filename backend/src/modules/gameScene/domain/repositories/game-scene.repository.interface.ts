import { GameScene } from '../aggregates/game-scene.aggregate';

export interface IGameSceneRepository {
  findById(id: string): Promise<GameScene | null>;
  findAll(page: number, limit: number): Promise<[GameScene[], number]>;
  findActiveByGameId(gameId: number): Promise<GameScene | null>;
  save(gameScene: GameScene): Promise<void>;
  delete(id: string): Promise<void>;
}

export const IGameSceneRepository = Symbol('IGameSceneRepository');
