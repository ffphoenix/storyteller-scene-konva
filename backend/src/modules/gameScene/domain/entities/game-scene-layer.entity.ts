export class GameSceneLayer {
  constructor(
    public readonly id: string,
    public name: string,
    public isLocked: boolean,
    public isVisible: boolean,
    public order: number,
  ) {}

  update(name?: string, isLocked?: boolean, isVisible?: boolean): void {
    if (name !== undefined) this.name = name;
    if (isLocked !== undefined) this.isLocked = isLocked;
    if (isVisible !== undefined) this.isVisible = isVisible;
  }
}
