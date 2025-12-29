import Konva from "konva";

const addObject = (stage: Konva.Stage, nodes: Partial<Konva.Node>[], layerId: string) => {
  const layer = stage.findOne(`#${layerId}`) as Konva.Layer;
  nodes.forEach((nodeJSON) => {
    const node = Konva.Node.create(nodeJSON);
    layer.add(node);
  });
  stage.batchDraw();
};

export default addObject;
