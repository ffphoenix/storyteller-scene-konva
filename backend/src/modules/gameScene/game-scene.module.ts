import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameSceneEntity } from './infrastructure/persistence/typeorm/entities/game-scene.entity';
import { GameSceneLayerEntity } from './infrastructure/persistence/typeorm/entities/game-scene-layer.entity';
import { GameSceneRepository } from './infrastructure/persistence/typeorm/repositories/game-scene.repository';
import { IGameSceneRepository } from './domain/repositories/game-scene.repository.interface';
import { GameSceneController } from './presentation/rest/game-scene.controller';
import { GameSceneGateway } from './infrastructure/websockets/game-scene.gateway';
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
import { GameSceneKafkaPublisher, GameSceneEventsHandler } from './infrastructure/kafka/game-scene-kafka.publisher';

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

const EventHandlers = [GameSceneEventsHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([GameSceneEntity, GameSceneLayerEntity])],
  controllers: [GameSceneController],
  providers: [
    {
      provide: IGameSceneRepository,
      useClass: GameSceneRepository,
    },
    GameSceneGateway,
    GameSceneKafkaPublisher,
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
  ],
})
export class GameSceneModule {}
