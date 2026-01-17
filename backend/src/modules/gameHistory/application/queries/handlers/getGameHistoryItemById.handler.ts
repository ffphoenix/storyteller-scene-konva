import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetGameHistoryItemByIdQuery } from '../impl/getGameHistoryItemById.query';
import { IGameHistoryRepository } from '../../../domain/repositories/gameHistory.repository.interface';
import { GameHistory } from '../../../domain/aggregates/gameHistory.aggregate';

@QueryHandler(GetGameHistoryItemByIdQuery)
export class GetGameHistoryItemByIdHandler implements IQueryHandler<GetGameHistoryItemByIdQuery> {
  constructor(
    @Inject(IGameHistoryRepository)
    private readonly repository: IGameHistoryRepository,
  ) {}

  async execute(query: GetGameHistoryItemByIdQuery): Promise<GameHistory> {
    const history = await this.repository.findById(query.id);
    if (!history) {
      throw new NotFoundException(`Game history item with ID ${query.id} not found`);
    }
    return history;
  }
}
