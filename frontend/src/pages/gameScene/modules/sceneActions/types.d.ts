import Konva from "konva";

export type ActionProducer = "self" | "history" | "websocket";

export type ModifyActionType = "drag" | "scale" | "rotate" | "scaleX" | "scaleY" | "skew" | undefined;

export type SceneActionEvent = {
  producer: ActionProducer;
  layerId: string;
  nodes: Konva.Node | Konva.Node[];
  e?: Konva.KonvaEventObject<MouseEvent>;
  actionType?: ModifyActionType;
};
