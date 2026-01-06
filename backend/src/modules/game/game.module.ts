import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from './infrastructure/persistence/entities/game.entity';
import { GameRepository } from './infrastructure/repositories/game.repository';
import { IGameRepository } from './domain/repositories/game.repository.interface';
import { GameController } from './presentation/controllers/game.controller';
import {
  CreateGameHandler,
  ModifyGameHandler,
  StartGameHandler,
  DeleteGameHandler,
} from './application/commands/handlers/game-command.handlers';
import { GetMyGamesHandler, GetGameDataHandler } from './application/queries/handlers/game-query.handlers';
import { KafkaEventPublisher, GameEventsHandler } from './infrastructure/messaging/kafka-event.publisher';

const CommandHandlers = [CreateGameHandler, ModifyGameHandler, StartGameHandler, DeleteGameHandler];
const QueryHandlers = [GetMyGamesHandler, GetGameDataHandler];
const EventHandlers = [GameEventsHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([GameEntity])],
  controllers: [GameController],
  providers: [
    {
      provide: IGameRepository,
      useClass: GameRepository,
    },
    KafkaEventPublisher,
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
  ],
})
export class GameModule {}
