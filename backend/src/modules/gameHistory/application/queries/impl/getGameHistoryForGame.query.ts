export class GetGameHistoryForGameQuery {
  constructor(
    public readonly gameId: number,
    public readonly options: {
      page: number;
      limit: number;
      type?: string;
      userId?: number;
      includeDeleted?: boolean;
    },
  ) {}
}
