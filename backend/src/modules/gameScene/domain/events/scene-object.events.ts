export class SceneObjectAdded {
  constructor(
    public readonly sceneId: string,
    public readonly layerId: string,
    public readonly objectId: string,
    public readonly payload: any,
    public readonly occurredAt: Date,
  ) {}
}

export class SceneObjectModified {
  constructor(
    public readonly sceneId: string,
    public readonly layerId: string,
    public readonly objectId: string,
    public readonly payload: any,
    public readonly occurredAt: Date,
  ) {}
}

export class SceneObjectDeleted {
  constructor(
    public readonly sceneId: string,
    public readonly layerId: string,
    public readonly objectId: string,
    public readonly occurredAt: Date,
  ) {}
}
