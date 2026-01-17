import { GameHistory } from '../aggregates/gameHistory.aggregate';

export interface IGameHistoryRepository {
  save(history: GameHistory): Promise<void>;
  findById(id: string): Promise<GameHistory | null>;
  findByGameId(
    gameId: number,
    options: {
      page: number;
      limit: number;
      type?: string;
      userId?: string;
      includeDeleted?: boolean;
    },
  ): Promise<[GameHistory[], number]>;
  softDelete(id: string): Promise<void>;
}

export const IGameHistoryRepository = Symbol('IGameHistoryRepository');
