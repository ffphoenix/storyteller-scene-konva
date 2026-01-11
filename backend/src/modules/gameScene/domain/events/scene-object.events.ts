import { IKafkaEvent } from '../../../../common/interfaces/messaging.interfaces';

export class SceneObjectAddedEvent extends IKafkaEvent {
  constructor(
    public readonly sceneId: string,
    public readonly layerId: string,
    public readonly objectId: string,
    public readonly payload: any,
    public readonly occurredAt: Date,
  ) {
    super('scene.object.event.added');
  }
}

export class SceneObjectModifiedEvent extends IKafkaEvent {
  constructor(
    public readonly sceneId: string,
    public readonly layerId: string,
    public readonly objectId: string,
    public readonly payload: any,
    public readonly occurredAt: Date,
  ) {
    super('scene.object.event.modified');
  }
}

export class SceneObjectDeletedEvent extends IKafkaEvent {
  constructor(
    public readonly sceneId: string,
    public readonly layerId: string,
    public readonly objectId: string,
    public readonly occurredAt: Date,
  ) {
    super('scene.object.event.deleted');
  }
}
