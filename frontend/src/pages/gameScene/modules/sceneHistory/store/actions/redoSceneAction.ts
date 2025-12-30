import type Konva from "konva";
import SceneHistoryStore from "../SceneHistoryStore";
import type { MutableRefObject } from "react";
import doHistoryAction from "./doHistoryAction";
import { toJS } from "mobx";

const redoSceneAction = (stageRef: MutableRefObject<Konva.Stage | null>) => {
  const stage = stageRef.current;
  if (!stage) return;

  const historyItem = SceneHistoryStore.latestRedoHistoryItem;
  if (!historyItem) return;

  try {
    const { nodes, action, layerId, originalGroupProps } = toJS(historyItem);
    doHistoryAction("redo", stage, action, nodes, layerId, originalGroupProps);

    SceneHistoryStore.popRedoHistoryItem();
    SceneHistoryStore.addUndoHistoryItem(
      action,
      {
        nodes,
        layerId,
        actionType: historyItem.actionType,
        originalGroupProps: historyItem.currentGroupProps,
        currentGroupProps: originalGroupProps,
      },
      true,
    );
  } catch (e) {
    console.error(e);
    SceneHistoryStore.popRedoHistoryItem();
  }
  stage.batchDraw();
};

export default redoSceneAction;
