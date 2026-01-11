import { Injectable, Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SceneObjectAddedEvent, SceneObjectModifiedEvent, SceneObjectDeletedEvent } from '../../domain/events/scene-object.events';
import { IEventPublisher } from '../../../../common/interfaces/messaging.interfaces';

@EventsHandler(SceneObjectAddedEvent, SceneObjectModifiedEvent, SceneObjectDeletedEvent)
export class GameSceneEventsHandler implements IEventHandler<SceneObjectAddedEvent | SceneObjectModifiedEvent | SceneObjectDeletedEvent> {
  constructor(@Inject(IEventPublisher) private readonly kafkaPublisher: IEventPublisher) {}

  async handle(event: SceneObjectAddedEvent | SceneObjectModifiedEvent | SceneObjectDeletedEvent) {
    await this.kafkaPublisher.publish(event);
  }
}
