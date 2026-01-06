import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { CreateSceneLayerCommand, UpdateSceneLayerCommand, DeleteSceneLayerCommand } from '../impl/scene-layer.commands';
import { IGameSceneRepository } from '../../../domain/repositories/game-scene.repository.interface';

@CommandHandler(CreateSceneLayerCommand)
export class CreateSceneLayerHandler implements ICommandHandler<CreateSceneLayerCommand> {
  constructor(
    @Inject(IGameSceneRepository) private readonly repository: IGameSceneRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateSceneLayerCommand) {
    const gameScene = await this.repository.findById(command.sceneId);
    if (!gameScene) throw new NotFoundException('Game scene not found');

    const aggregate = this.publisher.mergeObjectContext(gameScene);
    const layerId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11);

    aggregate.addLayer(layerId, command.name, command.isLocked, command.isVisible);

    await this.repository.save(aggregate);
    aggregate.commit();

    return layerId;
  }
}

@CommandHandler(UpdateSceneLayerCommand)
export class UpdateSceneLayerHandler implements ICommandHandler<UpdateSceneLayerCommand> {
  constructor(
    @Inject(IGameSceneRepository) private readonly repository: IGameSceneRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UpdateSceneLayerCommand) {
    const gameScene = await this.repository.findById(command.sceneId);
    if (!gameScene) throw new NotFoundException('Game scene not found');

    const aggregate = this.publisher.mergeObjectContext(gameScene);
    aggregate.updateLayer(command.layerId, command.name, command.isLocked, command.isVisible);

    await this.repository.save(aggregate);
    aggregate.commit();
  }
}

@CommandHandler(DeleteSceneLayerCommand)
export class DeleteSceneLayerHandler implements ICommandHandler<DeleteSceneLayerCommand> {
  constructor(
    @Inject(IGameSceneRepository) private readonly repository: IGameSceneRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: DeleteSceneLayerCommand) {
    const gameScene = await this.repository.findById(command.sceneId);
    if (!gameScene) throw new NotFoundException('Game scene not found');

    const aggregate = this.publisher.mergeObjectContext(gameScene);
    aggregate.deleteLayer(command.layerId);

    await this.repository.save(aggregate);
    aggregate.commit();
  }
}
