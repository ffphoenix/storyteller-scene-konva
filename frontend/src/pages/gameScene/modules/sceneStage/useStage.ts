import { useEffect, useRef } from "react";
import Konva from "konva";
import handleCanvasResize from "./handleCanvasResize";
import createGridLayer from "./createGridLayer";
import { generateUUID } from "../../utils/uuid";
import SceneStore from "../../store/SceneStore";

const useStage = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<Konva.Stage | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const stage = new Konva.Stage({
      container: containerRef.current,
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
    });

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

    stage.on("contextmenu", (e) => {
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
