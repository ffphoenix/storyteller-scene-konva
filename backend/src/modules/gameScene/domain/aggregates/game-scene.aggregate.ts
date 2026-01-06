import { AggregateRoot } from '@nestjs/cqrs';
import { GameSceneLayer } from '../entities/game-scene-layer.entity';
import { GridMetricSystem, GridType } from './game-scene.types';
import { SceneObjectAdded, SceneObjectModified, SceneObjectDeleted } from '../events/scene-object.events';

export class GameScene extends AggregateRoot {
  private id: string;
  private name: string;
  private stageJSON: any;
  private stageWidth: number;
  private stageHeight: number;
  private backgroundColor: string;
  private gridType: GridType;
  private gridCellSize: number;
  private gridMetricSystem: GridMetricSystem;
  private layers: GameSceneLayer[] = [];

  constructor(
    id: string,
    name: string,
    stageJSON: any,
    stageWidth: number,
    stageHeight: number,
    backgroundColor: string,
    gridType: GridType,
    gridCellSize: number,
    gridMetricSystem: GridMetricSystem,
    layers: GameSceneLayer[] = [],
  ) {
    super();
    this.id = id;
    this.name = name;
    this.stageJSON = stageJSON || { layers: [] };
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;
    this.backgroundColor = backgroundColor;
    this.gridType = gridType;
    this.gridCellSize = gridCellSize;
    this.gridMetricSystem = gridMetricSystem;
    this.layers = layers;
  }

  static create(
    id: string,
    name: string,
    stageWidth: number = 1920,
    stageHeight: number = 1080,
    backgroundColor: string = '#ffffff',
    gridType: GridType = GridType.SQUARE,
    gridCellSize: number = 70,
    gridMetricSystem: GridMetricSystem = GridMetricSystem.SQUARES,
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

    const initialStageJSON = {
      width: stageWidth,
      height: stageHeight,
      layers: [
        {
          id: defaultLayer.id,
          name: defaultLayer.name,
          objects: [],
        },
      ],
    };

    return new GameScene(id, name, initialStageJSON, stageWidth, stageHeight, backgroundColor, gridType, gridCellSize, gridMetricSystem, [
      defaultLayer,
    ]);
  }

  updateMetadata(data: {
    name?: string;
    stageWidth?: number;
    stageHeight?: number;
    backgroundColor?: string;
    gridType?: GridType;
    gridCellSize?: number;
    gridMetricSystem?: GridMetricSystem;
  }): void {
    if (data.name !== undefined) {
      if (!data.name || data.name.trim().length === 0) throw new Error('Name cannot be empty');
      this.name = data.name;
    }
    if (data.stageWidth !== undefined) {
      if (data.stageWidth <= 0) throw new Error('Stage width must be positive');
      this.stageWidth = data.stageWidth;
      this.stageJSON.width = this.stageWidth;
    }
    if (data.stageHeight !== undefined) {
      if (data.stageHeight <= 0) throw new Error('Stage height must be positive');
      this.stageHeight = data.stageHeight;
      this.stageJSON.height = this.stageHeight;
    }
    if (data.backgroundColor !== undefined) this.backgroundColor = data.backgroundColor;
    if (data.gridType !== undefined) this.gridType = data.gridType;
    if (data.gridCellSize !== undefined) {
      if (data.gridCellSize <= 0) throw new Error('Grid cell size must be positive');
      this.gridCellSize = data.gridCellSize;
    }
    if (data.gridMetricSystem !== undefined) this.gridMetricSystem = data.gridMetricSystem;
  }

  addLayer(id: string, name: string, isLocked: boolean = false, isVisible: boolean = true): void {
    if (this.layers.find((l) => l.id === id)) {
      throw new Error('Layer ID already exists');
    }
    const order = this.layers.length;
    const newLayer = new GameSceneLayer(id, name, isLocked, isVisible, order);
    this.layers.push(newLayer);

    if (!this.stageJSON.layers) this.stageJSON.layers = [];
    this.stageJSON.layers.push({
      id: newLayer.id,
      name: newLayer.name,
      objects: [],
    });
  }

  updateLayer(id: string, name?: string, isLocked?: boolean, isVisible?: boolean): void {
    const layer = this.layers.find((l) => l.id === id);
    if (!layer) throw new Error('Layer not found');

    layer.update(name, isLocked, isVisible);

    const stageLayer = this.stageJSON.layers.find((l: any) => l.id === id);
    if (stageLayer) {
      if (name !== undefined) stageLayer.name = name;
    }
  }

  deleteLayer(id: string): void {
    const layerIndex = this.layers.findIndex((l) => l.id === id);
    if (layerIndex === -1) throw new Error('Layer not found');

    const stageLayer = this.stageJSON.layers.find((l: any) => l.id === id);
    if (stageLayer && stageLayer.objects && stageLayer.objects.length > 0) {
      throw new Error('Cannot delete layer that contains objects');
    }

    this.layers.splice(layerIndex, 1);
    this.stageJSON.layers = this.stageJSON.layers.filter((l: any) => l.id !== id);
  }

  addObject(layerId: string, objectId: string, payload: any): void {
    const stageLayer = this.stageJSON.layers.find((l: any) => l.id === layerId);
    if (!stageLayer) throw new Error('Layer not found in stageJSON');

    if (!stageLayer.objects) stageLayer.objects = [];
    if (stageLayer.objects.find((o: any) => o.id === objectId)) {
      throw new Error('Object ID already exists');
    }

    stageLayer.objects.push({ ...payload, id: objectId });

    this.apply(new SceneObjectAdded(this.id, layerId, objectId, payload, new Date()));
  }

  modifyObject(layerId: string, objectId: string, payload: any): void {
    const stageLayer = this.stageJSON.layers.find((l: any) => l.id === layerId);
    if (!stageLayer) throw new Error('Layer not found in stageJSON');

    const objectIndex = stageLayer.objects.findIndex((o: any) => o.id === objectId);
    if (objectIndex === -1) throw new Error('Object not found in layer');

    stageLayer.objects[objectIndex] = { ...stageLayer.objects[objectIndex], ...payload, id: objectId };

    this.apply(new SceneObjectModified(this.id, layerId, objectId, payload, new Date()));
  }

  deleteObject(layerId: string, objectId: string): void {
    const stageLayer = this.stageJSON.layers.find((l: any) => l.id === layerId);
    if (!stageLayer) throw new Error('Layer not found in stageJSON');

    const objectIndex = stageLayer.objects.findIndex((o: any) => o.id === objectId);
    if (objectIndex === -1) throw new Error('Object not found in layer');

    stageLayer.objects.splice(objectIndex, 1);

    this.apply(new SceneObjectDeleted(this.id, layerId, objectId, new Date()));
  }

  // Getters
  getId(): string {
    return this.id;
  }
  getName(): string {
    return this.name;
  }
  getStageJSON(): any {
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
  getLayers(): GameSceneLayer[] {
    return this.layers;
  }
}
