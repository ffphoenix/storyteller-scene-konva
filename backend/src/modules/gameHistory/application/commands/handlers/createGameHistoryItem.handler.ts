import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateGameHistoryItemCommand } from '../impl/createGameHistoryItem.command';
import { IGameHistoryRepository } from '../../../domain/repositories/gameHistory.repository.interface';
import { GameHistory } from '../../../domain/aggregates/gameHistory.aggregate';
import { v4 as uuidv4 } from 'uuid';

@CommandHandler(CreateGameHistoryItemCommand)
export class CreateGameHistoryItemHandler implements ICommandHandler<CreateGameHistoryItemCommand> {
  constructor(
    @Inject(IGameHistoryRepository)
    private readonly repository: IGameHistoryRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateGameHistoryItemCommand): Promise<string> {
    const { type, userId, gameId, body } = command;
    const id = uuidv4();

    const gameHistory = GameHistory.create(id, type, userId, gameId, body);

    await this.repository.save(gameHistory);

    const publishedHistory = this.publisher.mergeObjectContext(gameHistory);
    publishedHistory.commit();

    return id;
  }
}
