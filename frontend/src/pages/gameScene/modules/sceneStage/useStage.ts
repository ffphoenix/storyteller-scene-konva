import { useEffect, useRef } from "react";
import Konva from "konva";
import handleCanvasResize from "./handleCanvasResize";
import createGridLayer from "./createGridLayer";
import { generateUUID } from "../../utils/uuid";
import SceneStore from "../../store/SceneStore";
import { toJS } from "mobx";

const useStage = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<Konva.Stage | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const stageJSON = toJS(SceneStore.stageJSON);
    if (!stageJSON) throw new Error("Stage JSON is not loaded");

    const stage = Konva.Node.create(stageJSON, containerRef.current);
    stage.width(containerRef.current.clientWidth);
    stage.height(containerRef.current.clientHeight);

    const gridLayer = createGridLayer();
    stage.add(gridLayer);

    const layerUuid = generateUUID();
    const layer = new Konva.Layer({
      id: layerUuid,
    });
    stage.add(layer);
    SceneStore.setActiveLayer(layerUuid);

    stageRef.current = stage;

    handleCanvasResize(stage, containerRef);
    const eventResizeHandler = () => handleCanvasResize(stage, containerRef);
    window.addEventListener("resize", eventResizeHandler);

    stage.on("contextmenu", (e: Konva.KonvaEventObject<MouseEvent>) => {
      e.evt.preventDefault();
    });

    return () => {
      window.removeEventListener("resize", eventResizeHandler);
      stage.destroy();
      stageRef.current = null;
    };
  }, []);

  return {
    containerRef,
    stageRef,
  };
};
export default useStage;
