import type { ActionProducer, SceneActionEvent } from "../types";
import type Konva from "konva";
import getNodesLayerId from "../../../utils/nodes/getNodesLayerId";

const fireObjectAddedEvent = (producer: ActionProducer, nodes: Konva.Node | Konva.Node[]) => {
  const layerId = getNodesLayerId(nodes);

  console.log("fireObjectAddedEvent", producer, nodes, layerId);
  document.dispatchEvent(
    new CustomEvent<SceneActionEvent>("sc:object:added", { detail: { producer, nodes, layerId } }),
  );
};
export default fireObjectAddedEvent;
