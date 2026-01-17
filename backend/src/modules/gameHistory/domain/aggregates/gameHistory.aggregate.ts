import { AggregateRoot } from '@nestjs/cqrs';
import { GameHistoryType } from './gameHistory.types';
import { GameHistoryItemCreatedEvent } from '../events/gameHistoryItemCreated.event';

export class GameHistory extends AggregateRoot {
  private readonly id: string;
  private readonly type: GameHistoryType;
  private readonly userId: string;
  private readonly gameId: number;
  private readonly body: any;
  private readonly createdAt: Date;
  private deletedAt: Date | null;

  constructor(
    id: string,
    type: GameHistoryType,
    userId: string,
    gameId: number,
    body: any,
    createdAt: Date,
    deletedAt: Date | null = null,
  ) {
    super();
    this.id = id;
    this.type = type;
    this.userId = userId;
    this.gameId = gameId;
    this.body = body;
    this.createdAt = createdAt;
    this.deletedAt = deletedAt;
  }

  static create(id: string, type: string, userId: string, gameId: number, body: any): GameHistory {
    if (!id) throw new Error('ID is required');
    if (!userId) throw new Error('User ID is required');
    if (!gameId) throw new Error('Game ID is required');
    if (!body) throw new Error('Body is required');

    if (!Object.values(GameHistoryType).includes(type as GameHistoryType)) {
      throw new Error(`Invalid history type: ${type}`);
    }

    const createdAt = new Date();
    const gameHistory = new GameHistory(id, type as GameHistoryType, userId, gameId, body, createdAt);

    gameHistory.apply(new GameHistoryItemCreatedEvent(id, gameId, userId, type, body, createdAt));

    return gameHistory;
  }

  softDelete(): void {
    this.deletedAt = new Date();
  }

  getId(): string {
    return this.id;
  }

  getType(): GameHistoryType {
    return this.type;
  }

  getUserId(): string {
    return this.userId;
  }

  getGameId(): number {
    return this.gameId;
  }

  getBody(): any {
    return this.body;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getDeletedAt(): Date | null {
    return this.deletedAt;
  }
}
