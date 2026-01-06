export class GameCreatedEvent {
  constructor(
    public readonly id: number,
    public readonly shortUrl: string,
    public readonly name: string,
    public readonly ownerId: number,
  ) {}
}

export class GameModifiedEvent {
  constructor(
    public readonly id: number,
    public readonly name: string,
  ) {}
}

export class GameStartedEvent {
  constructor(public readonly id: number) {}
}

export class GameDeletedEvent {
  constructor(public readonly id: number) {}
}
