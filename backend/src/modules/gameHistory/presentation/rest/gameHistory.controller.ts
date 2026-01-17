import { Controller, Get, Post, Delete, Body, Param, Query, ParseIntPipe, ParseUUIDPipe } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CreateGameHistoryItemCommand } from '../../application/commands/impl/createGameHistoryItem.command';
import { SoftDeleteGameHistoryItemCommand } from '../../application/commands/impl/softDeleteGameHistoryItem.command';
import { GetGameHistoryItemByIdQuery } from '../../application/queries/impl/getGameHistoryItemById.query';
import { GetGameHistoryForGameQuery } from '../../application/queries/impl/getGameHistoryForGame.query';
import { CreateGameHistoryItemDto } from './dtos/createGameHistoryItem.dto';
import { GameHistoryDto } from './dtos/gameHistory.dto';
import { PaginatedGameHistoryDto } from './dtos/paginatedGameHistory.dto';
import { GameHistory } from '../../domain/aggregates/gameHistory.aggregate';

@ApiTags('GameHistory')
@Controller()
export class GameHistoryController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('games/:gameId/history')
  @ApiOperation({ summary: 'Create a new game history item' })
  @ApiResponse({ status: 201, type: GameHistoryDto })
  async create(@Param('gameId', ParseIntPipe) gameId: number, @Body() dto: CreateGameHistoryItemDto): Promise<GameHistoryDto> {
    const id = await this.commandBus.execute(new CreateGameHistoryItemCommand(dto.type, dto.userId, gameId, dto.body));
    const history = await this.queryBus.execute(new GetGameHistoryItemByIdQuery(id));
    return this.mapToDto(history);
  }

  @Get('games/:gameId/history')
  @ApiOperation({ summary: 'Get history items for a game' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'type', required: false, type: String })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'includeDeleted', required: false, type: Boolean })
  @ApiResponse({ status: 200, type: PaginatedGameHistoryDto })
  async getForGame(
    @Param('gameId', ParseIntPipe) gameId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('type') type?: string,
    @Query('userId') userId?: string,
    @Query('includeDeleted') includeDeleted: boolean = false,
  ): Promise<PaginatedGameHistoryDto> {
    const [items, total] = await this.queryBus.execute(
      new GetGameHistoryForGameQuery(gameId, {
        page: +page,
        limit: +limit,
        type,
        userId,
        includeDeleted: String(includeDeleted) === 'true',
      }),
    );

    return {
      items: items.map((item: GameHistory) => this.mapToDto(item)),
      total,
      page: +page,
      limit: +limit,
    };
  }

  @Get('history/:id')
  @ApiOperation({ summary: 'Get a single history item by ID' })
  @ApiResponse({ status: 200, type: GameHistoryDto })
  async getById(@Param('id', ParseUUIDPipe) id: string): Promise<GameHistoryDto> {
    const history = await this.queryBus.execute(new GetGameHistoryItemByIdQuery(id));
    return this.mapToDto(history);
  }

  @Delete('history/:id')
  @ApiOperation({ summary: 'Soft-delete a history item' })
  @ApiResponse({ status: 204 })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.commandBus.execute(new SoftDeleteGameHistoryItemCommand(id));
  }

  private mapToDto(history: GameHistory): GameHistoryDto {
    return {
      id: history.getId(),
      type: history.getType(),
      userId: history.getUserId(),
      gameId: history.getGameId(),
      body: history.getBody(),
      createdAt: history.getCreatedAt(),
      deletedAt: history.getDeletedAt(),
    };
  }
}
