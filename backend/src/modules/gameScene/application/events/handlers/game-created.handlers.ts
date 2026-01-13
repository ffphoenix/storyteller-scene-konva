import { EventsHandler, IEventHandler, CommandBus } from '@nestjs/cqrs';
import { GameCreatedEvent } from '../../../../game/domain/events/game.events';
import { CreateGameSceneCommand } from '../../commands/impl/create-game-scene.command';

@EventsHandler(GameCreatedEvent)
export class CreateDefaultSceneOnGameCreatedHandler implements IEventHandler<GameCreatedEvent> {
  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: GameCreatedEvent) {
    console.log('Game created event received');
    await this.commandBus.execute(new CreateGameSceneCommand(event.id, 'New game scene'));
  }
}
