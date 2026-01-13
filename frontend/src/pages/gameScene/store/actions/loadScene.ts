import ApiClient from "../../../../utils/apiClient";
import { runInAction } from "mobx";
import sceneStore from "../SceneStore";

export default function loadScene(shortURL: string) {
  ApiClient.games.findOne(shortURL).then((response) => {
    runInAction(() => {
      const game = response.data;
      ApiClient.gameScenes.findActive(game.id.toString()).then((sceneResponse) => {
        const scene = sceneResponse.data;
        sceneStore.stageJSON = scene.stageJSON;
      });

      // sceneStore.stageJSON = response.data.stageJSON;
      // sceneStore.isActive = response.data.isActive;
    });
  });
}
