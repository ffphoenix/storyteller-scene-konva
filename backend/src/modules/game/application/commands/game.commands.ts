export class CreateGameCommand {
  constructor(
    public readonly name: string,
    public readonly shortUrl: string,
    public readonly ownerId: number,
  ) {}
}

export class ModifyGameCommand {
  constructor(
    public readonly id: bigint,
    public readonly name: string,
    public readonly ownerId: number,
  ) {}
}

export class StartGameCommand {
  constructor(
    public readonly id: bigint,
    public readonly ownerId: number,
  ) {}
}

export class DeleteGameCommand {
  constructor(
    public readonly id: bigint,
    public readonly ownerId: number,
  ) {}
}
