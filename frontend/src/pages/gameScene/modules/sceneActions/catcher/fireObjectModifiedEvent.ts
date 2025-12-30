import type Konva from "konva";
import type { ActionProducer, ModifyActionType, SceneActionEvent } from "../types";

const fireObjectModifiedEvent = (
  producer: ActionProducer,
  actionType: ModifyActionType,
  nodes: Konva.Shape,
  originalProps: Partial<Konva.NodeConfig>,
  event?: Konva.KonvaEventObject<MouseEvent>,
) => {
  if (producer !== "self") return;

  document.dispatchEvent(
    new CustomEvent<SceneActionEvent>("sc:object:modified", {
      detail: { producer, nodes, e: event, actionType, originalProps, layerId: nodes.getLayer()?.id() ?? "" },
    }),
  );
};
export default fireObjectModifiedEvent;
