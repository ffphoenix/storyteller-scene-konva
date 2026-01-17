import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { GameHistoryEntity } from './infrastructure/persistence/typeorm/entities/gameHistory.entity';
import { GameHistoryRepository } from './infrastructure/persistence/typeorm/repositories/gameHistory.repository';
import { IGameHistoryRepository } from './domain/repositories/gameHistory.repository.interface';
import { CreateGameHistoryItemHandler } from './application/commands/handlers/createGameHistoryItem.handler';
import { SoftDeleteGameHistoryItemHandler } from './application/commands/handlers/softDeleteGameHistoryItem.handler';
import { GetGameHistoryItemByIdHandler } from './application/queries/handlers/getGameHistoryItemById.handler';
import { GetGameHistoryForGameHandler } from './application/queries/handlers/getGameHistoryForGame.handler';
import { GameHistoryController } from './presentation/rest/gameHistory.controller';
import { GameHistoryGateway } from './presentation/websockets/gameHistory.gateway';
import { MessagingModule } from '../massaging/messaging.module';
import { MessagesRegistry } from '../massaging/MessagesRegistry';
import { CreateGameHistoryItemCommand } from './application/commands/impl/createGameHistoryItem.command';
import { SoftDeleteGameHistoryItemCommand } from './application/commands/impl/softDeleteGameHistoryItem.command';

const CommandHandlers = [CreateGameHistoryItemHandler, SoftDeleteGameHistoryItemHandler];
const QueryHandlers = [GetGameHistoryItemByIdHandler, GetGameHistoryForGameHandler];

MessagesRegistry.register([CreateGameHistoryItemCommand, SoftDeleteGameHistoryItemCommand]);

@Module({
  imports: [TypeOrmModule.forFeature([GameHistoryEntity]), CqrsModule, MessagingModule],
  controllers: [GameHistoryController],
  providers: [
    {
      provide: IGameHistoryRepository,
      useClass: GameHistoryRepository,
    },
    GameHistoryGateway,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [IGameHistoryRepository],
})
export class GameHistoryModule implements OnModuleInit {
  onModuleInit() {}
}
