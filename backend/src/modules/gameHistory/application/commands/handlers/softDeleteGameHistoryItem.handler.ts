import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { SoftDeleteGameHistoryItemCommand } from '../impl/softDeleteGameHistoryItem.command';
import { IGameHistoryRepository } from '../../../domain/repositories/gameHistory.repository.interface';

@CommandHandler(SoftDeleteGameHistoryItemCommand)
export class SoftDeleteGameHistoryItemHandler implements ICommandHandler<SoftDeleteGameHistoryItemCommand> {
  constructor(
    @Inject(IGameHistoryRepository)
    private readonly repository: IGameHistoryRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: SoftDeleteGameHistoryItemCommand): Promise<void> {
    const { id } = command;
    const gameHistory = await this.repository.findById(id);

    if (!gameHistory) {
      throw new NotFoundException(`Game history item with ID ${id} not found`);
    }

    gameHistory.softDelete();
    await this.repository.save(gameHistory);

    const publishedHistory = this.publisher.mergeObjectContext(gameHistory);
    // If we have a deleted event, we could apply it here.
    // For now, let's just commit.
    publishedHistory.commit();
  }
}
