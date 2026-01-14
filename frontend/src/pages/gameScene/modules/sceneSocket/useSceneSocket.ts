import type { SceneActionEvent } from "../sceneActions/types";
import SceneStore from "../../store/SceneStore";
import socketManager from "../../../../utils/socketManager";
import CurrentUser from "../../../../globalStore/users/CurrentUser";
import nodesToJSON from "../../utils/nodes/nodesToJSON";
import getNodeTransformProps from "../sceneTransformer/getNodeTransformProps";
import type Konva from "konva";
import { type MutableRefObject, useEffect } from "react";
import addObject from "../sceneActions/producer/addObject";
import removeObject from "../sceneActions/producer/removeObject";
import modifyObject from "../sceneActions/producer/modifyObject";

const useSceneSocket = (stageRef: MutableRefObject<Konva.Stage | null>) => {
  const socket = socketManager.socket("/game-scene");

  useEffect(() => {
    if (!stageRef.current) return;
    const stage = stageRef.current;
    socket.connect();
    socket.emit("joinScene", SceneStore.activeSceneId);

    socket.on("objectAdded", (data) => {
      if (!stageRef.current) return;
      console.log("objectAdded socket event===", data);
      addObject(stageRef.current, data.payload, data.layerId);
    });

    socket.on("objectDeleted", (data) => {
      if (!stageRef.current) return;
      console.log("objectDeleted socket event===", data);
      removeObject(stageRef.current, data.payload);
    });

    socket.on("objectModified", (data) => {
      if (!stageRef.current) return;
      console.log("objectAdded socket event===", data);
      modifyObject(stageRef.current, data.layerId, data.payload, data.currentGroupProps, data.originalGroupProps);
    });

    const onObjectAdded = (event: CustomEvent<SceneActionEvent>) => {
      console.log(event);
      if (event.detail.producer !== "self") return;
      const { nodes, layerId } = event.detail;
      console.log(CurrentUser);
      socket.emit("addObject", { layerId, sceneId: SceneStore.activeSceneId, payload: nodesToJSON(nodes) });
    };

    document.addEventListener("sc:object:added", onObjectAdded as EventListener);

    const onObjectModified = (e: CustomEvent<SceneActionEvent>) => {
      if (e.detail.producer !== "self") return;
      const { layerId, actionType, originalProps, transformer, nodes } = e.detail;
      if (!transformer) throw new Error("Transformer is required");
      const nodesJSON = nodesToJSON(transformer.nodes());
      socket.emit("modifyObject", {
        actionType,
        layerId,
        sceneId: SceneStore.activeSceneId,
        payload: nodesJSON,
        // TODO: Fix zoom and pan problems!!
        currentGroupProps: { ...getNodeTransformProps(nodes as Konva.Shape), x: transformer.x(), y: transformer.y() },
        originalGroupProps: originalProps,
      });
    };
    document.addEventListener("sc:object:modified", onObjectModified as EventListener);

    const onObjectRemoved = (e: CustomEvent<SceneActionEvent>) => {
      const { nodes, layerId, producer } = e.detail;
      if (producer !== "self") return;

      socket.emit("deleteObject", { layerId, sceneId: SceneStore.activeSceneId, payload: nodesToJSON(nodes) });
    };
    document.addEventListener("sc:object:removed", onObjectRemoved as EventListener);
    return () => {
      document.removeEventListener("sc:object:added", onObjectAdded as EventListener);
      document.removeEventListener("sc:object:modified", onObjectModified as EventListener);
      document.removeEventListener("sc:object:removed", onObjectRemoved as EventListener);
    };
  }, []);
};
export default useSceneSocket;
