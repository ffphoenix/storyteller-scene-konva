export class AddSceneObjectCommand {
  constructor(
    public readonly sceneId: string,
    public readonly layerId: string,
    public readonly objectId: string,
    public readonly payload: any,
  ) {}
}

export class ModifySceneObjectCommand {
  constructor(
    public readonly sceneId: string,
    public readonly layerId: string,
    public readonly objectId: string,
    public readonly payload: any,
  ) {}
}

export class DeleteSceneObjectCommand {
  constructor(
    public readonly sceneId: string,
    public readonly layerId: string,
    public readonly objectId: string,
  ) {}
}
