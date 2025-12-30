import Konva from "konva";

import clearTransformerNodesSelection from "../../sceneTransformer/clearTransformerNodesSelection";
import getActiveLayer from "../../sceneTools/utils/getActiveLayer";

const modifyObject = (stage: Konva.Stage, nodesData: any[], originalProps?: any, currentProps?: any) => {
  if (!originalProps || !currentProps) return;

  clearTransformerNodesSelection(stage);
  const activeLayer = getActiveLayer(stage);
  if (!activeLayer) return;

  const konvaNodes = nodesData.map((n) => stage.findOne(`#${n.attrs.id}`)).filter((n): n is Konva.Node => !!n);

  if (konvaNodes.length === 0) return;

  // 1. Create a temporary group.
  // We initialize it with the CURRENT properties (the state the nodes are in right now).
  const tempGroup = new Konva.Group({
    x: currentProps.x,
    y: currentProps.y,
    rotation: currentProps.rotation ?? 0,
    scaleX: currentProps.scaleX ?? 1,
    scaleY: currentProps.scaleY ?? 1,
    offsetX: currentProps.offsetX ?? 0,
    offsetY: currentProps.offsetY ?? 0,
  });

  activeLayer.add(tempGroup);

  // 2. Attach nodes to the group.
  // We use the nodes' current absolute position/rotation.
  // By adding them to a group that already has the 'current' rotation/pos,
  // their local coordinates inside the group will be calculated relative to that state.
  konvaNodes.forEach((node) => {
    // We must manually manage the move to ensure they don't jump.
    // getAbsoluteTransform().copy() is the key here.
    const transform = node.getAbsoluteTransform().copy();
    node.moveTo(tempGroup);

    // Reset the node's transform relative to the NEW parent (the group)
    const m = tempGroup.getAbsoluteTransform().copy().invert().multiply(transform);
    const attrs = m.decompose();
    node.setAttrs(attrs);
  });

  // 3. Now transform the group to the ORIGINAL state.
  // This will move/rotate all children correctly as a single unit.
  tempGroup.setAttrs({
    x: originalProps.x,
    y: originalProps.y,
    rotation: originalProps.rotation ?? 0,
    scaleX: originalProps.scaleX ?? 1,
    scaleY: originalProps.scaleY ?? 1,
  });

  // 4. Extract nodes back to the layer and clean up
  konvaNodes.forEach((node) => {
    const transform = node.getAbsoluteTransform().copy();
    node.moveTo(activeLayer);

    // Reset the node's transform relative to the layer
    const m = activeLayer.getAbsoluteTransform().copy().invert().multiply(transform);
    const attrs = m.decompose();
    node.setAttrs(attrs);
  });

  tempGroup.destroy();
  stage.batchDraw();
};

export default modifyObject;
