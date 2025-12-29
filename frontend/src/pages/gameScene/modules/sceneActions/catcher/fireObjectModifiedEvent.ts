import type Konva from "konva";
import type { ModifyActionType, SceneActionEvent } from "../types";

const fireObjectModifiedEvent = (object: Konva.Node | Konva.Node[], event?: Konva.KonvaEventObject<MouseEvent>) => {
  const producer = "self";
  if (producer !== "self") return;

  const actionType: ModifyActionType = "drag";

  document.dispatchEvent(
    new CustomEvent<SceneActionEvent>("sc:object:modified", { detail: { producer, object, e: event, actionType } }),
  );
};
export default fireObjectModifiedEvent;
