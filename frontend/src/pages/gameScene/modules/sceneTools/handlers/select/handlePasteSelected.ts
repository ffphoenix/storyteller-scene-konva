import Konva from "konva";
import getActiveLayer from "../../utils/getActiveLayer";
import fireObjectAddedEvent from "../../../sceneActions/catcher/fireObjectAddedEvent";
import { generateUUID } from "../../../../utils/uuid";
import getTransformer from "../../../sceneTransformer/getTransformer";
import toolsStore from "../../store/ToolsStore";

export const handlePasteSelected = (stage: Konva.Stage) => {
  const clipboardNodes = toolsStore.select.clipboardNodes;
  if (!clipboardNodes || clipboardNodes.length === 0) return;

  const activeLayer = getActiveLayer(stage);
  if (!activeLayer) return;

  const newNodes: Konva.Node[] = [];
  const offset = 20;

  clipboardNodes.forEach((nodeConfig) => {
    const newNode = Konva.Node.create(nodeConfig);
    newNode.id(generateUUID());
    newNode.x(newNode.x() + offset);
    newNode.y(newNode.y() + offset);
    activeLayer.add(newNode);
    newNodes.push(newNode);
  });

  const transformer = getTransformer(stage);
  if (transformer) {
    transformer.nodes(newNodes);
    transformer.moveToTop();
  }

  activeLayer.draw();
  fireObjectAddedEvent("self", newNodes);

  // Update clipboard with new positions so consecutive pastes stack
  const serializedNodes = newNodes.map((node) => JSON.parse(node.toJSON()));
  toolsStore.setClipboardNodes(serializedNodes);
};
