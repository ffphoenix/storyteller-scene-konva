import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { IGameHistoryRepository } from '../../domain/repositories/gameHistory.repository.interface';
import { GameHistory } from '../../domain/aggregates/gameHistory.aggregate';
import { IORedisKey } from '../../../../redis/redis.constants';
import { GameHistoryRepository } from './typeorm/repositories/gameHistory.repository';
import { GameHistoryType } from '../../domain/aggregates/gameHistory.types';

@Injectable()
export class CachedGameHistoryRepository implements IGameHistoryRepository {
  private readonly CACHE_PREFIX = 'game_history:';
  private readonly MAX_CACHED_MESSAGES = 100;

  constructor(
    private readonly dbRepository: GameHistoryRepository,
    @Inject(IORedisKey) private readonly redis: Redis,
  ) {}

  async save(history: GameHistory): Promise<void> {
    // 1. Save to DB (old logic remains)
    await this.dbRepository.save(history);

    // 2. Additional logic: Save to Redis
    const key = `${this.CACHE_PREFIX}${history.getGameId()}`;
    const data = JSON.stringify({
      id: history.getId(),
      type: history.getType(),
      userId: history.getUserId(),
      gameId: history.getGameId(),
      body: history.getBody(),
      createdAt: history.getCreatedAt().toISOString(),
      deletedAt: history.getDeletedAt()?.toISOString() || null,
    });

    await this.redis.lpush(key, data);
    await this.redis.ltrim(key, 0, this.MAX_CACHED_MESSAGES - 1);
  }

  async findById(id: string): Promise<GameHistory | null> {
    // For single item lookup, we can stick to DB or implement more complex caching
    // Usually, list cache is for collections. Keeping it simple as per requirement.
    return this.dbRepository.findById(id);
  }

  async findByGameId(
    gameId: number,
    options: {
      page: number;
      limit: number;
      type?: string;
      userId?: number;
      includeDeleted?: boolean;
    },
  ): Promise<[GameHistory[], number]> {
    const { page, limit, type, userId, includeDeleted } = options;
    const key = `${this.CACHE_PREFIX}${gameId}`;

    // Optimization: Try Redis only for simple recent messages query
    // Requirement says: "up to 100 messages, if user ask more then 100 take them from DB"
    const canUseCache = page === 1 && limit <= this.MAX_CACHED_MESSAGES && !type && !userId && !includeDeleted;

    if (canUseCache) {
      const cachedData = await this.redis.lrange(key, 0, limit - 1);
      if (cachedData.length > 0) {
        const histories = cachedData.map((d) => {
          const parsed = JSON.parse(d);
          return new GameHistory(
            parsed.id,
            parsed.type as GameHistoryType,
            parsed.userId,
            parsed.gameId,
            parsed.body,
            new Date(parsed.createdAt),
            parsed.deletedAt ? new Date(parsed.deletedAt) : null,
          );
        });

        // We still need the total count.
        // We could use LLEN but it might only be 100 even if there are more in DB.
        // So we might still need to hit DB for count, or accept that count might be inaccurate from cache.
        // The requirement says "old logic should be the same", so we probably should still get the true count.
        const [_, totalCount] = await this.dbRepository.findByGameId(gameId, { ...options, limit: 0 });
        return [histories, totalCount];
      }
    }

    // Fallback to DB
    return this.dbRepository.findByGameId(gameId, options);
  }

  async softDelete(id: string): Promise<void> {
    await this.dbRepository.softDelete(id);
    // When an item is deleted, we might want to invalidate the whole cache for that game
    // or search and remove from the list. Searching in a list is O(N).
    // Invalidation is safer.
    const history = await this.dbRepository.findById(id);
    if (history) {
      await this.redis.del(`${this.CACHE_PREFIX}${history.getGameId()}`);
    }
  }
}
