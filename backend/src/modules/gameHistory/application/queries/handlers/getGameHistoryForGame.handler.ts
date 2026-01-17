import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetGameHistoryForGameQuery } from '../impl/getGameHistoryForGame.query';
import { IGameHistoryRepository } from '../../../domain/repositories/gameHistory.repository.interface';
import { GameHistory } from '../../../domain/aggregates/gameHistory.aggregate';

@QueryHandler(GetGameHistoryForGameQuery)
export class GetGameHistoryForGameHandler implements IQueryHandler<GetGameHistoryForGameQuery> {
  constructor(
    @Inject(IGameHistoryRepository)
    private readonly repository: IGameHistoryRepository,
  ) {}

  async execute(query: GetGameHistoryForGameQuery): Promise<[GameHistory[], number]> {
    return this.repository.findByGameId(query.gameId, query.options);
  }
}
