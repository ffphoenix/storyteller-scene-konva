import ApiClient from "../../../../utils/apiClient";
import sceneStore from "../SceneStore";
import gameStore from "../GameStore";
import gameHistoryMessages from "../../gameMessagesHistory/store/GameHistoryMessages";

export default async function loadScene(shortURL: string) {
  try {
    const game = (await ApiClient.games.findOne(shortURL)).data;
    gameStore.setGame(game);
    const scene = (await ApiClient.gamesScenes.findActive(game.id.toString())).data;
    sceneStore.updateSceneData(scene);
    const history = (await ApiClient.gameHistory.getForGame(game.id)).data.items;
    const hm = history.map((item) => ({
      ...item,
      createdAt: new Date(item.createdAt),
    }));
    // @ts-ignore
    gameHistoryMessages.updateMessages(hm);
  } catch (e) {
    console.error(e);
  }
}
