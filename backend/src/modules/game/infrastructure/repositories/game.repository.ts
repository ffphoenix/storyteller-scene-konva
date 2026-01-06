import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IGameRepository } from '../../domain/repositories/game.repository.interface';
import { Game } from '../../domain/aggregates/game.aggregate';
import { GameEntity } from '../persistence/entities/game.entity';

@Injectable()
export class GameRepository implements IGameRepository {
  constructor(
    @InjectRepository(GameEntity)
    private readonly repository: Repository<GameEntity>,
  ) {}

  async findById(id: number): Promise<Game | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByShortUrl(shortUrl: string): Promise<Game | null> {
    const entity = await this.repository.findOne({ where: { shortUrl } });
    return entity ? this.toDomain(entity) : null;
  }

  async save(game: Game): Promise<void> {
    const entity = this.toEntity(game);
    const savedEntity = await this.repository.save(entity);
    if (!game.getId()) {
      // Set the ID after first save for new aggregates
      (game as any).id = Number(savedEntity.id);
    }
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id.toString());
  }

  async findAllByOwnerId(ownerId: number): Promise<Game[]> {
    const entities = await this.repository.find({ where: { ownerId } });
    return entities.map((entity) => this.toDomain(entity));
  }

  private toDomain(entity: GameEntity): Game {
    return new Game(Number(entity.id), entity.shortUrl, entity.name, entity.status, entity.ownerId);
  }

  private toEntity(game: Game): Partial<GameEntity> {
    return {
      id: game.getId() ? game.getId() : undefined,
      shortUrl: game.getShortUrl(),
      name: game.getName(),
      status: game.getStatus(),
      ownerId: game.getOwnerId(),
    };
  }
}
