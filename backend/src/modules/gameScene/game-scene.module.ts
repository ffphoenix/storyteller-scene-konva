import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameSceneEntity } from './infrastructure/persistence/typeorm/entities/game-scene.entity';
import { GameSceneLayerEntity } from './infrastructure/persistence/typeorm/entities/game-scene-layer.entity';
import { GameSceneRepository } from './infrastructure/persistence/typeorm/repositories/game-scene.repository';
import { IGameSceneRepository } from './domain/repositories/game-scene.repository.interface';
import { GameSceneController } from './presentation/rest/game-scene.controller';
import { GameSceneGateway } from './presentation/websockets/game-scene.gateway';
import {
  CreateGameSceneHandler,
  UpdateGameSceneHandler,
  DeleteGameSceneHandler,
} from './application/commands/handlers/game-scene.handlers';
import {
  CreateSceneLayerHandler,
  UpdateSceneLayerHandler,
  DeleteSceneLayerHandler,
} from './application/commands/handlers/scene-layer.handlers';
import {
  AddSceneObjectHandler,
  ModifySceneObjectHandler,
  DeleteSceneObjectHandler,
} from './application/commands/handlers/scene-object.handlers';
import {
  GetGameScenesHandler,
  GetGameSceneByIdHandler,
  GetSceneLayersHandler,
} from './application/queries/handlers/game-scene-query.handlers';
import { CreateDefaultSceneOnGameCreatedHandler } from './application/events/handlers/game-created.handlers';
import { MessagesRegistry } from '../massaging/MessagesRegistry';
import Commands from './application/commands/impl';
import { Events } from './domain/events';
import { MessagingModule } from '../massaging/messaging.module';

const CommandHandlers = [
  CreateGameSceneHandler,
  UpdateGameSceneHandler,
  DeleteGameSceneHandler,
  CreateSceneLayerHandler,
  UpdateSceneLayerHandler,
  DeleteSceneLayerHandler,
  AddSceneObjectHandler,
  ModifySceneObjectHandler,
  DeleteSceneObjectHandler,
];

const QueryHandlers = [GetGameScenesHandler, GetGameSceneByIdHandler, GetSceneLayersHandler];
const EventHandlers = [CreateDefaultSceneOnGameCreatedHandler];

MessagesRegistry.register(Commands);
MessagesRegistry.register(Events);

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([GameSceneEntity, GameSceneLayerEntity]), MessagingModule],
  controllers: [GameSceneController],
  providers: [
    {
      provide: IGameSceneRepository,
      useClass: GameSceneRepository,
    },
    GameSceneGateway,
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
  ],
})
export class GameSceneModule {}
