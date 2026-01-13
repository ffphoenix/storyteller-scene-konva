export class GetGameScenesQuery {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 10,
  ) {}
}

export class GetGameSceneByIdQuery {
  constructor(public readonly id: string) {}
}

export class GetSceneLayersQuery {
  constructor(public readonly sceneId: string) {}
}

export class GetActiveGameSceneByGameIdQuery {
  constructor(public readonly gameId: number) {}
}
