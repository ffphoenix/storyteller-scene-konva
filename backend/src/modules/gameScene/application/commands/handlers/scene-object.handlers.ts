import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { AddSceneObjectCommand } from '../impl/add-scene-object.command';
import { ModifySceneObjectCommand } from '../impl/modify-scene-object.command';
import { DeleteSceneObjectCommand } from '../impl/delete-scene-object.command';
import { IGameSceneRepository } from '../../../domain/repositories/game-scene.repository.interface';

@CommandHandler(AddSceneObjectCommand)
export class AddSceneObjectHandler implements ICommandHandler<AddSceneObjectCommand> {
  constructor(
    @Inject(IGameSceneRepository) private readonly repository: IGameSceneRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: AddSceneObjectCommand) {
    const gameScene = await this.repository.findById(command.sceneId);
    if (!gameScene) throw new NotFoundException('Game scene not found');

    const aggregate = this.publisher.mergeObjectContext(gameScene);
    aggregate.addObject(command.layerId, command.objectId, command.payload);

    await this.repository.save(aggregate);
    aggregate.commit();
  }
}

@CommandHandler(ModifySceneObjectCommand)
export class ModifySceneObjectHandler implements ICommandHandler<ModifySceneObjectCommand> {
  constructor(
    @Inject(IGameSceneRepository) private readonly repository: IGameSceneRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: ModifySceneObjectCommand) {
    const gameScene = await this.repository.findById(command.sceneId);
    if (!gameScene) throw new NotFoundException('Game scene not found');

    const aggregate = this.publisher.mergeObjectContext(gameScene);
    aggregate.modifyObject(command.layerId, command.objectId, command.payload);

    await this.repository.save(aggregate);
    aggregate.commit();
  }
}

@CommandHandler(DeleteSceneObjectCommand)
export class DeleteSceneObjectHandler implements ICommandHandler<DeleteSceneObjectCommand> {
  constructor(
    @Inject(IGameSceneRepository) private readonly repository: IGameSceneRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: DeleteSceneObjectCommand) {
    const gameScene = await this.repository.findById(command.sceneId);
    if (!gameScene) throw new NotFoundException('Game scene not found');

    const aggregate = this.publisher.mergeObjectContext(gameScene);
    aggregate.deleteObject(command.layerId, command.objectId);

    await this.repository.save(aggregate);
    aggregate.commit();
  }
}
