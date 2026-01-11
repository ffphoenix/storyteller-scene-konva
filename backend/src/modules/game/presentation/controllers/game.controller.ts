import { Controller, Post, Body, Put, Param, Delete, Get, UseGuards, HttpStatus } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateGameDto, UpdateGameDto, GameResponseDto } from '../../application/dto/game.dto';
import { CreateGameCommand } from '../../application/commands/impl/create-game.command';
import { ModifyGameCommand } from '../../application/commands/impl/modify-game.command';
import { StartGameCommand } from '../../application/commands/impl/start-game.command';
import { DeleteGameCommand } from '../../application/commands/impl/delete-game.command';
import { GetMyGamesQuery, GetGameDataQuery } from '../../application/queries/game.queries';
import { JwtAuthGuard } from '../../../account/auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../common/decorators/user.decorator';
import { User } from '../../../account/users/user.entity';
import { CRUDErrorBadRequestResponse } from '../../../../common/interfaces/formValidationExceptionResponse.interface';

@ApiTags('games')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('games')
export class GameController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new game' })
  @ApiResponse({ status: 201, description: 'The game has been successfully created.', type: String })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: CRUDErrorBadRequestResponse })
  async create(@Body() createGameDto: CreateGameDto, @CurrentUser() user: User) {
    return this.commandBus.execute(new CreateGameCommand(createGameDto.name, createGameDto.shortUrl, user.id));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update game name' })
  @ApiResponse({ status: 200, description: 'The game has been successfully updated.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: CRUDErrorBadRequestResponse })
  async update(@Param('id') id: number, @Body() updateGameDto: UpdateGameDto, @CurrentUser() user: User) {
    return this.commandBus.execute(new ModifyGameCommand(Number(id), updateGameDto.name, user.id));
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Start a game' })
  @ApiResponse({ status: 200, description: 'The game has been successfully started.' })
  async start(@Param('id') id: number, @CurrentUser() user: User) {
    return this.commandBus.execute(new StartGameCommand(Number(id), user.id));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a game' })
  @ApiResponse({ status: 200, description: 'The game has been successfully deleted.' })
  async delete(@Param('id') id: number, @CurrentUser() user: User) {
    return this.commandBus.execute(new DeleteGameCommand(Number(id), user.id));
  }

  @Get()
  @ApiOperation({ summary: 'Get all games for current user' })
  @ApiResponse({ status: 200, type: [GameResponseDto] })
  async findAll(@CurrentUser() user: User) {
    return this.queryBus.execute(new GetMyGamesQuery(user.id));
  }

  @Get(':idOrShortUrl')
  @ApiOperation({ summary: 'Get game data by ID or short URL' })
  @ApiResponse({ status: 200, type: GameResponseDto })
  async findOne(@Param('idOrShortUrl') idOrShortUrl: string) {
    return this.queryBus.execute(new GetGameDataQuery(idOrShortUrl));
  }
}
