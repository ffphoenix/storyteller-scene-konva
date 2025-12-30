import Konva from "konva";
import fireObjectModifiedEvent from "../sceneActions/catcher/fireObjectModifiedEvent";
import sceneTransformerStore from "./store/SceneTransformerStore";
import type { ModifyActionType } from "../sceneActions/types";
import getNodeTransformProps from "./getNodeTransformProps";
import { toJS } from "mobx";

const setTransformerEvents = (transformer: Konva.Transformer) => {
  transformer.on("transformend dragend", (e) => {
    // const node = e.target as Konva.Shape;
    const node = e.currentTarget as Konva.Transformer;
    console.log(
      "transformend",
      getNodeTransformProps(node),
      getNodeTransformProps(e.target as Konva.Node),
      e.target.getType(),
    );
    fireObjectModifiedEvent("self", e.type as ModifyActionType, node, toJS(sceneTransformerStore.startProps), e);
    sceneTransformerStore.setStartProps(getNodeTransformProps(node));
  });
};
export default setTransformerEvents;
