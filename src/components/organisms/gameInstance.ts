import Phaser from "phaser";
import GameScene from "../../game/GameScene";

let gameInstance: Phaser.Game | null = null;

export const setGameInstance = (game: Phaser.Game) => {
  gameInstance = game;
};

export const getGameInstance = (): GameScene | null => {
  if (!gameInstance) {
    console.warn("⚠️ [getGameInstance] 현재 GameInstance가 없습니다.");
    return null;
  }

  const gameScene = gameInstance.scene.getScene("GameScene") as GameScene;

  if (!gameScene) {
    console.warn("⚠️ [getGameInstance] GameScene을 찾을 수 없습니다.");
    return null;
  }

  return gameScene;
};
