import React from "react";
import ToolMenu from "./modules/sceneTools/components/ToolMenu";
import "./style.css";
import useStage from "./modules/sceneStage/useStage";
import ZoomControls from "./modules/sceneZoomControls/components/ZoomControls";
import useWheelZoomHandler from "./modules/sceneZoomControls/useWheelZoomHandler";
import useSceneTools from "./modules/sceneTools/useSceneTools";
import useKeyboardHotkeys from "./hooks/useKeyboardHotkeys";
import "./declarations/FabricObject";
import useSceneHistory from "./modules/sceneHistory/useSceneHistory";
import SceneContextMenu from "./modules/sceneTools/components/SceneContextMenu";

const GameScenePage: React.FC = () => {
  const { stageRef, containerRef } = useStage();
  useWheelZoomHandler(stageRef);
  useSceneTools(stageRef);
  useKeyboardHotkeys(stageRef);
  // useSceneHistory(canvasRef);

  console.log("GameScenePage rendered");

  return (
    <div className="relative w-full h-full min-h-screen">
      {/* Absolute vertical menu on the left */}
      <img src="/images/grid.png" id="bgimage" className="hidden" />

      <div className="absolute left-0 top-0 h-full p-3 border-r bg-white/90 backdrop-blur-sm z-1000">
        <ToolMenu stageRef={stageRef} />
      </div>

      {/* Canvas area with left padding to avoid overlap */}
      <ZoomControls stageRef={stageRef} />
      <div className="w-full h-full border rounded bg-white overflow-hidden relative" ref={containerRef}></div>
      <SceneContextMenu />
    </div>
  );
};

export default GameScenePage;
