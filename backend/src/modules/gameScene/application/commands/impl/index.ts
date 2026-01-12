import { AddSceneObjectCommand } from './add-scene-object.command';
import { CreateGameSceneCommand } from './create-game-scene.command';
import { CreateSceneLayerCommand } from './create-scene-layer.command';
import { DeleteGameSceneCommand } from './delete-game-scene.command';
import { DeleteSceneLayerCommand } from './delete-scene-layer.command';
import { DeleteSceneObjectCommand } from './delete-scene-object.command';
import { ModifySceneObjectCommand } from './modify-scene-object.command';
import { UpdateGameSceneCommand } from './update-game-scene.command';
import { UpdateSceneLayerCommand } from './update-scene-layer.command';

export default [
  AddSceneObjectCommand,
  CreateGameSceneCommand,
  CreateSceneLayerCommand,
  DeleteGameSceneCommand,
  DeleteSceneLayerCommand,
  DeleteSceneObjectCommand,
  ModifySceneObjectCommand,
  UpdateGameSceneCommand,
  UpdateSceneLayerCommand,
];
