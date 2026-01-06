import { Game } from '../aggregates/game.aggregate';

export interface IGameRepository {
  findById(id: number): Promise<Game | null>;
  findByShortUrl(shortUrl: string): Promise<Game | null>;
  save(game: Game): Promise<void>;
  delete(id: number): Promise<void>;
  findAllByOwnerId(ownerId: number): Promise<Game[]>;
}

export const IGameRepository = Symbol('IGameRepository');
