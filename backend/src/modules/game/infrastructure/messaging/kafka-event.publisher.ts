import { EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { GameCreatedEvent, GameModifiedEvent, GameStartedEvent, GameDeletedEvent } from '../../domain/events/game.events';

@EventsHandler(GameCreatedEvent, GameModifiedEvent, GameStartedEvent, GameDeletedEvent)
export class GameEventsHandler implements IEventHandler<GameCreatedEvent | GameModifiedEvent | GameStartedEvent | GameDeletedEvent> {
  constructor(private readonly eventBus: EventBus) {}

  async handle(event: GameCreatedEvent | GameModifiedEvent | GameStartedEvent | GameDeletedEvent) {
    await this.eventBus.publish(event);
  }
}
