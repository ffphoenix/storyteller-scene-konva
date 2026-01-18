import { CachedGameHistoryRepository } from '../../../../src/modules/gameHistory/infrastructure/persistence/CachedGameHistoryRepository';
import { GameHistoryRepository } from '../../../../src/modules/gameHistory/infrastructure/persistence/typeorm/repositories/gameHistory.repository';
import { GameHistory } from '../../../../src/modules/gameHistory/domain/aggregates/gameHistory.aggregate';
import { GameHistoryType } from '../../../../src/modules/gameHistory/domain/aggregates/gameHistory.types';

describe('CachedGameHistoryRepository', () => {
  let cachedRepository: CachedGameHistoryRepository;
  let dbRepository: jest.Mocked<GameHistoryRepository>;
  let redis: any;

  beforeEach(() => {
    dbRepository = {
      save: jest.fn(),
      findByGameId: jest.fn(),
      findById: jest.fn(),
      softDelete: jest.fn(),
    } as any;

    redis = {
      lpush: jest.fn(),
      ltrim: jest.fn(),
      lrange: jest.fn(),
      del: jest.fn(),
    };

    cachedRepository = new CachedGameHistoryRepository(dbRepository, redis);
  });

  describe('save', () => {
    it('should save to DB and then to Redis', async () => {
      const history = new GameHistory('1', GameHistoryType.DICE_ROLL, 1, 123, { result: 10 }, new Date());

      await cachedRepository.save(history);

      expect(dbRepository.save).toHaveBeenCalledWith(history);
      expect(redis.lpush).toHaveBeenCalledWith('game_history:123', expect.stringContaining('"userId":1'));
      expect(redis.ltrim).toHaveBeenCalledWith('game_history:123', 0, 99);
    });
  });

  describe('findByGameId', () => {
    it('should return data from Redis if it exists and options allow it', async () => {
      const gameId = 123;
      const options = { page: 1, limit: 10 };
      const cachedItem = JSON.stringify({
        id: '1',
        type: GameHistoryType.DICE_ROLL,
        userId: 1,
        gameId,
        body: { result: 10 },
        createdAt: new Date().toISOString(),
        deletedAt: null,
      });

      redis.lrange.mockResolvedValue([cachedItem]);
      dbRepository.findByGameId.mockResolvedValue([[], 1]);

      const [result, total] = await cachedRepository.findByGameId(gameId, options);

      expect(redis.lrange).toHaveBeenCalledWith('game_history:123', 0, 9);
      expect(result).toHaveLength(1);
      expect(result[0].getId()).toBe('1');
      expect(total).toBe(1);
      expect(dbRepository.findByGameId).toHaveBeenCalledWith(gameId, { ...options, limit: 0 });
    });

    it('should fallback to DB if Redis is empty', async () => {
      const gameId = 123;
      const options = { page: 1, limit: 10 };
      const dbResult: [GameHistory[], number] = [[], 0];

      redis.lrange.mockResolvedValue([]);
      dbRepository.findByGameId.mockResolvedValue(dbResult);

      const result = await cachedRepository.findByGameId(gameId, options);

      expect(result).toBe(dbResult);
      expect(dbRepository.findByGameId).toHaveBeenCalledWith(gameId, options);
    });

    it('should bypass Redis if page > 1', async () => {
      const gameId = 123;
      const options = { page: 2, limit: 10 };
      const dbResult: [GameHistory[], number] = [[], 0];

      dbRepository.findByGameId.mockResolvedValue(dbResult);

      const result = await cachedRepository.findByGameId(gameId, options);

      expect(redis.lrange).not.toHaveBeenCalled();
      expect(result).toBe(dbResult);
    });
  });
});
