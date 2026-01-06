export class CreateSceneLayerCommand {
  constructor(
    public readonly sceneId: string,
    public readonly name: string,
    public readonly isLocked?: boolean,
    public readonly isVisible?: boolean,
  ) {}
}

export class UpdateSceneLayerCommand {
  constructor(
    public readonly sceneId: string,
    public readonly layerId: string,
    public readonly name?: string,
    public readonly isLocked?: boolean,
    public readonly isVisible?: boolean,
  ) {}
}

export class DeleteSceneLayerCommand {
  constructor(
    public readonly sceneId: string,
    public readonly layerId: string,
  ) {}
}
