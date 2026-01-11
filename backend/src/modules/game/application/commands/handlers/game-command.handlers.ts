import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Inject, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateGameCommand } from '../impl/create-game.command';
import { ModifyGameCommand } from '../impl/modify-game.command';
import { StartGameCommand } from '../impl/start-game.command';
import { DeleteGameCommand } from '../impl/delete-game.command';
import { IGameRepository } from '../../../domain/repositories/game.repository.interface';
import { Game } from '../../../domain/aggregates/game.aggregate';

@CommandHandler(CreateGameCommand)
export class CreateGameHandler implements ICommandHandler<CreateGameCommand> {
  constructor(
    @Inject(IGameRepository) private readonly repository: IGameRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateGameCommand) {
    const existing = await this.repository.findByShortUrl(command.shortUrl);
    if (existing) {
      throw new BadRequestException('Short URL already exists');
    }

    const game = this.publisher.mergeObjectContext(Game.create(command.shortUrl, command.name, command.ownerId));

    await this.repository.save(game);
    game.onCreated();
    game.commit();

    return game.getId().toString();
  }
}

@CommandHandler(ModifyGameCommand)
export class ModifyGameHandler implements ICommandHandler<ModifyGameCommand> {
  constructor(
    @Inject(IGameRepository) private readonly repository: IGameRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: ModifyGameCommand) {
    const game = await this.repository.findById(command.id);
    if (!game) {
      throw new NotFoundException('Game not found');
    }
    if (game.getOwnerId() !== command.ownerId) {
      throw new UnauthorizedException('You are not the owner of this game');
    }

    const aggregate = this.publisher.mergeObjectContext(game);
    aggregate.updateName(command.name);

    await this.repository.save(aggregate);
    aggregate.commit();
  }
}

@CommandHandler(StartGameCommand)
export class StartGameHandler implements ICommandHandler<StartGameCommand> {
  constructor(
    @Inject(IGameRepository) private readonly repository: IGameRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: StartGameCommand) {
    const game = await this.repository.findById(command.id);
    if (!game) {
      throw new NotFoundException('Game not found');
    }
    if (game.getOwnerId() !== command.ownerId) {
      throw new UnauthorizedException('You are not the owner of this game');
    }

    const aggregate = this.publisher.mergeObjectContext(game);
    aggregate.start();

    await this.repository.save(aggregate);
    aggregate.commit();
  }
}

@CommandHandler(DeleteGameCommand)
export class DeleteGameHandler implements ICommandHandler<DeleteGameCommand> {
  constructor(
    @Inject(IGameRepository) private readonly repository: IGameRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: DeleteGameCommand) {
    const game = await this.repository.findById(command.id);
    if (!game) {
      throw new NotFoundException('Game not found');
    }
    if (game.getOwnerId() !== command.ownerId) {
      throw new UnauthorizedException('You are not the owner of this game');
    }

    const aggregate = this.publisher.mergeObjectContext(game);
    aggregate.delete();

    await this.repository.delete(command.id);
    aggregate.commit();
  }
}
