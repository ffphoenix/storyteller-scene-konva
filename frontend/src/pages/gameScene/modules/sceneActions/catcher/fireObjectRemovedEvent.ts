import type Konva from "konva";
import type { ActionProducer, SceneActionEvent } from "../types";

const fireObjectRemovedEvent = (
  producer: ActionProducer,
  nodes: Konva.Node | Konva.Node[],
  layerId: string,
  event?: Konva.KonvaEventObject<MouseEvent>,
) => {
  console.log("fireObjectRemovedEvent", producer, nodes, layerId);
  document.dispatchEvent(
    new CustomEvent<SceneActionEvent>("sc:object:removed", { detail: { producer, nodes, e: event, layerId } }),
  );
};
export default fireObjectRemovedEvent;
