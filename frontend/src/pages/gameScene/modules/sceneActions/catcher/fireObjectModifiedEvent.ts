import type Konva from "konva";
import type { ActionProducer, ModifyActionType, SceneActionEvent } from "../types";

const fireObjectModifiedEvent = (
  producer: ActionProducer,
  actionType: ModifyActionType,
  nodes: Konva.Shape,
  transformer: Konva.Transformer,
  originalProps: Partial<Konva.NodeConfig>,
  event?: MouseEvent,
) => {
  if (producer !== "self") return;
  console.log("fireObjectModifiedEvent", producer, nodes, transformer, originalProps, event);
  document.dispatchEvent(
    new CustomEvent<SceneActionEvent>("sc:object:modified", {
      detail: {
        producer,
        nodes,
        event,
        actionType,
        originalProps,
        transformer,
        layerId: nodes.getLayer()?.id() ?? "",
      },
    }),
  );
};
export default fireObjectModifiedEvent;
