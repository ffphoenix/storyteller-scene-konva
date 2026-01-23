import socketManager from "../../../../utils/socketManager";
import { useEffect } from "react";
import gameStore from "../../store/GameStore";
import gameHistoryMessages from "../store/GameHistoryMessages";

const useHistorySocket = () => {
  const socket = socketManager.socket("/game-history");

  useEffect(() => {
    socket.connect();
    socket.emit("subscribeToGame", gameStore.game?.id);

    socket.on("historyItemCreated", (data) => {
      console.log(data);
      gameHistoryMessages.addUserMessage(data.userId, data.body.message);
    });
    document.addEventListener("history:user-message", (data) => {
      socket.emit("createHistoryItem", data);
    });
    return () => {
      socket.emit("unsubscribeFromGame", gameStore.game?.id);
      socket.disconnect();
    };
  }, []);
};
export default useHistorySocket;
