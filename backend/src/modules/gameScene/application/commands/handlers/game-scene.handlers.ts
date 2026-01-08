import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { CreateGameSceneCommand, UpdateGameSceneCommand, DeleteGameSceneCommand } from '../impl/game-scene.commands';
import { IGameSceneRepository } from '../../../domain/repositories/game-scene.repository.interface';
import { GameScene } from '../../../domain/aggregates/game-scene.aggregate';

@CommandHandler(CreateGameSceneCommand)
export class CreateGameSceneHandler implements ICommandHandler<CreateGameSceneCommand> {
  constructor(
    @Inject(IGameSceneRepository) private readonly repository: IGameSceneRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateGameSceneCommand) {
    const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11) + '-' + Date.now();
    const gameScene = this.publisher.mergeObjectContext(
      GameScene.create(
        id,
        command.gameId,
        command.name,
        command.stageWidth,
        command.stageHeight,
        command.backgroundColor,
        command.gridType,
        command.gridCellSize,
        command.gridMetricSystem,
      ),
    );

    await this.repository.save(gameScene);
    gameScene.commit();

    return id;
  }
}

@CommandHandler(UpdateGameSceneCommand)
export class UpdateGameSceneHandler implements ICommandHandler<UpdateGameSceneCommand> {
  constructor(
    @Inject(IGameSceneRepository) private readonly repository: IGameSceneRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UpdateGameSceneCommand) {
    const gameScene = await this.repository.findById(command.id);
    if (!gameScene) throw new NotFoundException('Game scene not found');

    const aggregate = this.publisher.mergeObjectContext(gameScene);
    aggregate.updateMetadata(command);

    await this.repository.save(aggregate);
    aggregate.commit();
  }
}

@CommandHandler(DeleteGameSceneCommand)
export class DeleteGameSceneHandler implements ICommandHandler<DeleteGameSceneCommand> {
  constructor(
    @Inject(IGameSceneRepository) private readonly repository: IGameSceneRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: DeleteGameSceneCommand) {
    const gameScene = await this.repository.findById(command.id);
    if (!gameScene) throw new NotFoundException('Game scene not found');

    // In a real scenario, we might want to emit a SceneDeletedEvent here.
    // The requirement says "Optionally emit an event that this scene is deleted".
    // I'll keep it simple for now as it's not explicitly defined in the event model section.

    await this.repository.delete(command.id);
  }
}
