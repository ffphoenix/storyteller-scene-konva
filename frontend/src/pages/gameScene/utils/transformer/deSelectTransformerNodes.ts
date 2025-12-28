import Konva from "konva";
import drawActiveLayer from "../../modules/sceneTools/utils/drawActiveLayer";
import getTransformer from "./getTransformer";

const deSelectTransformerNodes = (stage: Konva.Stage) => {
  const transformer = getTransformer(stage);
  transformer.nodes().forEach((node: Konva.Node) => node.setDraggable(false));
  transformer.nodes([]);
  drawActiveLayer(stage);
};
export default deSelectTransformerNodes;
