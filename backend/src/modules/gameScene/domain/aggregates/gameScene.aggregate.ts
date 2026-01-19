import { AggregateRoot } from '@nestjs/cqrs';
import { GameSceneLayer } from '../entities/gameSceneLayer.entity';
import { GridMetricSystem, GridType } from './gameScene.types';
import { SceneObjectAddedEvent, SceneObjectModifiedEvent, SceneObjectDeletedEvent } from '../events/sceneObject.events';

export type KonvaNode = {
  className: string;
  attrs?: {
    id?: string;
    name?: string;
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    scaleX?: number;
    scaleY?: number;
    rotation?: number;
    opacity?: number;
    draggable?: boolean;
    visible?: boolean;
  };
  children?: KonvaNode[];
};

export class GameScene extends AggregateRoot {
  private id: string;
  private gameId: number;
  private name: string;
  private stageJSON: KonvaNode;
  private stageWidth: number;
  private stageHeight: number;
  private backgroundColor: string;
  private gridType: GridType;
  private gridCellSize: number;
  private gridMetricSystem: GridMetricSystem;
  private isActive: boolean;
  private layers: GameSceneLayer[] = [];

  constructor(
    id: string,
    gameId: number,
    name: string,
    stageJSON: KonvaNode,
    stageWidth: number,
    stageHeight: number,
    backgroundColor: string,
    gridType: GridType,
    gridCellSize: number,
    gridMetricSystem: GridMetricSystem,
    isActive: boolean = true,
    layers: GameSceneLayer[] = [],
  ) {
    super();
    this.id = id;
    this.gameId = gameId;
    this.name = name;
    this.stageJSON = stageJSON || { className: 'Stage', children: [] };
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;
    this.backgroundColor = backgroundColor;
    this.gridType = gridType;
    this.gridCellSize = gridCellSize;
    this.gridMetricSystem = gridMetricSystem;
    this.isActive = isActive;
    this.layers = layers;
  }

  static create(
    id: string,
    gameId: number,
    name: string,
    stageWidth: number = 1920,
    stageHeight: number = 1080,
    backgroundColor: string = '#ffffff',
    gridType: GridType = GridType.SQUARE,
    gridCellSize: number = 70,
    gridMetricSystem: GridMetricSystem = GridMetricSystem.SQUARES,
    isActive: boolean = true,
  ): GameScene {
    if (!name || name.trim().length === 0) {
      throw new Error('Name is required');
    }
    if (stageWidth <= 0 || stageHeight <= 0) {
      throw new Error('Stage dimensions must be positive');
    }

    const defaultLayer = new GameSceneLayer(
      crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
      'Background',
      false,
      true,
      0,
    );

    const defaultJSON = {
      attrs: {
        width: stageWidth,
        height: stageHeight,
      },
      className: 'Stage',
      children: [
        {
          attrs: {
            id: defaultLayer.id,
            name: defaultLayer.name,
          },
          className: 'Layer',
          children: [],
        },
      ],
    };

    return new GameScene(
      id,
      gameId,
      name,
      defaultJSON,
      stageWidth,
      stageHeight,
      backgroundColor,
      gridType,
      gridCellSize,
      gridMetricSystem,
      isActive,
      [defaultLayer],
    );
  }

  updateMetadata(data: {
    name?: string;
    stageWidth?: number;
    stageHeight?: number;
    backgroundColor?: string;
    gridType?: GridType;
    gridCellSize?: number;
    gridMetricSystem?: GridMetricSystem;
    isActive?: boolean;
  }): void {
    if (data.name !== undefined) {
      if (!data.name || data.name.trim().length === 0) throw new Error('Name cannot be empty');
      this.name = data.name;
    }

    if (data.backgroundColor !== undefined) this.backgroundColor = data.backgroundColor;
    if (data.gridType !== undefined) this.gridType = data.gridType;
    if (data.gridCellSize !== undefined) {
      if (data.gridCellSize <= 0) throw new Error('Grid cell size must be positive');
      this.gridCellSize = data.gridCellSize;
    }
    if (data.gridMetricSystem !== undefined) this.gridMetricSystem = data.gridMetricSystem;
    if (data.isActive !== undefined) this.isActive = data.isActive;
  }

  addLayer(id: string, name: string, isLocked: boolean = false, isVisible: boolean = true): void {
    if (this.layers.find((l) => l.id === id)) {
      throw new Error('Layer ID already exists');
    }
    const order = this.layers.length;
    const newLayer = new GameSceneLayer(id, name, isLocked, isVisible, order);
    this.layers.push(newLayer);

    if (!this.stageJSON.children) this.stageJSON.children = [];

    this.stageJSON.children.push({
      attrs: {
        id: newLayer.id,
        name: newLayer.name,
      },
      className: 'Layer',
      children: [],
    });
  }

  updateLayer(id: string, name?: string, isLocked?: boolean, isVisible?: boolean): void {
    const layer = this.layers.find((l) => l.id === id);
    if (!layer) throw new Error('Layer not found');

    layer.update(name, isLocked, isVisible);

    const stageLayer = this.stageJSON.children.find((l: KonvaNode) => l.attrs.id === id);
    if (stageLayer) {
      if (name !== undefined) stageLayer.attrs.name = name;
    }
  }

  deleteLayer(id: string): void {
    const layerIndex = this.layers.findIndex((l) => l.id === id);
    if (layerIndex === -1) throw new Error('Layer not found');

    const stageLayer = this.stageJSON.children.find((l: KonvaNode) => l.attrs.id === id);
    if (stageLayer && stageLayer.children && stageLayer.children.length > 0) {
      throw new Error('Cannot delete layer that contains objects');
    }

    this.layers.splice(layerIndex, 1);
    this.stageJSON.children = this.stageJSON.children.filter((l: KonvaNode) => l.attrs.id !== id);
  }

  addObject(layerId: string, payload: KonvaNode[]): void {
    const stageLayer = this.stageJSON.children.find((l: KonvaNode) => l.attrs.id === layerId);
    if (!stageLayer) throw new Error('Layer not found in stageJSON');

    if (!stageLayer.children) stageLayer.children = [];

    const objectsToAddIds = payload.map((object) => object.attrs.id);
    if (stageLayer.children.find((o: KonvaNode) => objectsToAddIds.includes(o.attrs.id))) {
      throw new Error('Object ID already exists');
    }
    payload.forEach((object) => {
      object.attrs.draggable = false;
    });
    stageLayer.children = [...stageLayer.children, ...payload];

    this.apply(new SceneObjectAddedEvent(this.id, layerId, payload, new Date()));
  }

  modifyObject(layerId: string, payload: KonvaNode[]): void {
    const stageLayer = this.stageJSON.children.find((l: KonvaNode) => l.attrs.id === layerId);
    if (!stageLayer) throw new Error('Layer not found in stageJSON');

    payload.forEach((node) => {
      const objectIndex = stageLayer.children.findIndex((o: KonvaNode) => o.attrs.id === node.attrs.id);
      if (objectIndex === -1) throw new Error('Object not found in layer');

      node.attrs.draggable = false;
      stageLayer.children[objectIndex] = { ...stageLayer.children[objectIndex], ...node };

      this.apply(new SceneObjectModifiedEvent(this.id, layerId, node.attrs.id, node, new Date()));
    });
  }

  deleteObject(layerId: string, payload: KonvaNode[]): void {
    const stageLayer = this.stageJSON.children.find((l: KonvaNode) => l.attrs.id === layerId);
    if (!stageLayer) throw new Error('Layer not found in stageJSON');

    payload.forEach((node) => {
      const objectIndex = stageLayer.children.findIndex((o: KonvaNode) => o.attrs.id === node.attrs.id);
      if (objectIndex === -1) throw new Error('Object not found in layer');

      stageLayer.children.splice(objectIndex, 1);

      this.apply(new SceneObjectDeletedEvent(this.id, layerId, node.attrs.id, new Date()));
    });
  }

  // Getters
  getId(): string {
    return this.id;
  }
  getGameId(): number {
    return this.gameId;
  }
  getName(): string {
    return this.name;
  }
  getStageJSON(): object {
    return this.stageJSON;
  }
  getStageWidth(): number {
    return this.stageWidth;
  }
  getStageHeight(): number {
    return this.stageHeight;
  }
  getBackgroundColor(): string {
    return this.backgroundColor;
  }
  getGridType(): GridType {
    return this.gridType;
  }
  getGridCellSize(): number {
    return this.gridCellSize;
  }
  getGridMetricSystem(): GridMetricSystem {
    return this.gridMetricSystem;
  }
  getIsActive(): boolean {
    return this.isActive;
  }
  getLayers(): GameSceneLayer[] {
    return this.layers;
  }
}
