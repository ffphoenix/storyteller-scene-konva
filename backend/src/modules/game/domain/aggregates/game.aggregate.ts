import { AggregateRoot } from '@nestjs/cqrs';
import { GameStatus } from './game-status.enum';
import { GameCreatedEvent, GameDeletedEvent, GameModifiedEvent, GameStartedEvent } from '../events/game.events';

export class Game extends AggregateRoot {
  private readonly id: number;
  private readonly shortUrl: string;
  private name: string;
  private status: GameStatus;
  private readonly ownerId: number;

  constructor(id: number | null, shortUrl: string, name: string, status: GameStatus, ownerId: number) {
    super();
    this.id = id;
    this.shortUrl = shortUrl;
    this.name = name;
    this.status = status;
    this.ownerId = ownerId;
  }

  static create(shortUrl: string, name: string, ownerId: number): Game {
    if (shortUrl.length !== 8) {
      throw new Error('Short URL must be exactly 8 characters');
    }
    // Note: ID is null until saved, so we might need to apply event after save or use a pre-generated ID
    return new Game(null, shortUrl, name, GameStatus.CREATED, ownerId);
  }

  onCreated(): void {
    this.apply(new GameCreatedEvent(this.id, this.shortUrl, this.name, this.ownerId));
  }

  updateName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('Name is required');
    }
    this.name = newName;
    this.apply(new GameModifiedEvent(this.id, this.name));
  }

  start(): void {
    if (this.status === GameStatus.STARTED) {
      throw new Error('Game is already started');
    }
    this.status = GameStatus.STARTED;
    this.apply(new GameStartedEvent(this.id));
  }

  delete(): void {
    this.apply(new GameDeletedEvent(this.id));
  }

  getId(): number {
    return this.id;
  }

  getShortUrl(): string {
    return this.shortUrl;
  }

  getName(): string {
    return this.name;
  }

  getStatus(): GameStatus {
    return this.status;
  }

  getOwnerId(): number {
    return this.ownerId;
  }
}
