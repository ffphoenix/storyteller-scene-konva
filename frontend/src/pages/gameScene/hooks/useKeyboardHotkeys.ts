import { type MutableRefObject, useEffect } from "react";
import Konva from "konva";
import isKeyDownInterceptable from "../utils/isKeyDownInterceptable";
import getTransformer from "../utils/transformer/getTransformer";

const handleDeleteSelected = (stage: Konva.Stage) => {
  const transformer = getTransformer(stage);
  if (transformer.nodes().length === 0) return;
  transformer.nodes().forEach((node) => node.destroy());
  transformer.nodes([]);
  stage.batchDraw();
};

const useKeyboardHotkeys = (stageRef: MutableRefObject<Konva.Stage | null>) => {
  useEffect(() => {
    if (!stageRef.current) return;
    const stage = stageRef.current;

    const onKeyDown = (e: KeyboardEvent) => {
      if (!isKeyDownInterceptable(e, stage)) return;
      if (e.code === "Delete" || e.code === "Backslash") {
        handleDeleteSelected(stage);

        // prevent navigating back on Backspace when nothing is focused
        e.preventDefault();
        return;
      }

      // Escape: cancel measuring / arrow drawing
      if (e.code === "Escape") {
        // @TODO: implement escape logic for Konva if needed
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
};

export default useKeyboardHotkeys;
