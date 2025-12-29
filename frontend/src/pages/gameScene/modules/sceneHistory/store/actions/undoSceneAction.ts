import type Konva from "konva";
import SceneHistoryStore from "../SceneHistoryStore";
import type { MutableRefObject } from "react";
import doHistoryAction from "./doHistoryAction";
import { toJS } from "mobx";

const undoSceneAction = (stageRef: MutableRefObject<Konva.Stage | null>) => {
  const stage = stageRef.current;
  if (!stage) return;

  const historyItem = SceneHistoryStore.latestUndoHistoryItem;
  if (!historyItem) return;

  if (historyItem.action === "modify" && !historyItem.originalProps) return;

  try {
    const { nodes, action, layerId } = toJS(historyItem);

    doHistoryAction("undo", stage, action, nodes, layerId);

    SceneHistoryStore.popUndoHistoryItem();
    SceneHistoryStore.addRedoHistoryItem(action, { nodes, layerId });
  } catch (e) {
    console.error(e);
    SceneHistoryStore.popUndoHistoryItem();
  }
  stage.batchDraw();
};
export default undoSceneAction;
