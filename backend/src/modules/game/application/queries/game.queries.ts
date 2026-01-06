export class GetMyGamesQuery {
  constructor(public readonly userId: number) {}
}

export class GetGameDataQuery {
  constructor(public readonly idOrShortUrl: string) {}
}
