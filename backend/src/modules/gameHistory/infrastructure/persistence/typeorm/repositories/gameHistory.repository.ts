import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IGameHistoryRepository } from '../../../../domain/repositories/gameHistory.repository.interface';
import { GameHistory } from '../../../../domain/aggregates/gameHistory.aggregate';
import { GameHistoryEntity } from '../entities/gameHistory.entity';
import { GameHistoryType } from '../../../../domain/aggregates/gameHistory.types';

@Injectable()
export class GameHistoryRepository implements IGameHistoryRepository {
  constructor(
    @InjectRepository(GameHistoryEntity)
    private readonly repository: Repository<GameHistoryEntity>,
  ) {}

  async save(history: GameHistory): Promise<void> {
    const entity = this.toEntity(history);
    await this.repository.save(entity);
  }

  async findById(id: string): Promise<GameHistory | null> {
    const entity = await this.repository.findOne({
      where: { id },
      withDeleted: true,
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findByGameId(
    gameId: number,
    options: {
      page: number;
      limit: number;
      type?: string;
      userId?: string;
      includeDeleted?: boolean;
    },
  ): Promise<[GameHistory[], number]> {
    const { page, limit, type, userId, includeDeleted } = options;
    const query = this.repository.createQueryBuilder('history').where('history.gameId = :gameId', { gameId });

    if (type) {
      query.andWhere('history.type = :type', { type });
    }

    if (userId) {
      query.andWhere('history.userId = :userId', { userId });
    }

    if (includeDeleted) {
      query.withDeleted();
    }

    const [entities, count] = await query
      .orderBy('history.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return [entities.map((entity) => this.toDomain(entity)), count];
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }

  private toDomain(entity: GameHistoryEntity): GameHistory {
    return new GameHistory(
      entity.id,
      entity.type as GameHistoryType,
      entity.userId,
      entity.gameId,
      entity.body,
      entity.createdAt,
      entity.deletedAt,
    );
  }

  private toEntity(history: GameHistory): GameHistoryEntity {
    const entity = new GameHistoryEntity();
    entity.id = history.getId();
    entity.type = history.getType();
    entity.userId = history.getUserId();
    entity.gameId = history.getGameId();
    entity.body = history.getBody();
    entity.createdAt = history.getCreatedAt();
    entity.deletedAt = history.getDeletedAt();
    return entity;
  }
}
