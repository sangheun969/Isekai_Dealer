"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGameInstance = exports.setGameInstance = void 0;
let gameInstance = null;
const setGameInstance = (game) => {
    gameInstance = game;
};
exports.setGameInstance = setGameInstance;
const getGameInstance = () => {
    if (!gameInstance) {
        console.warn("⚠️ [getGameInstance] 현재 GameInstance가 없습니다.");
        return null;
    }
    const gameScene = gameInstance.scene.getScene("GameScene");
    if (!gameScene) {
        console.warn("⚠️ [getGameInstance] GameScene을 찾을 수 없습니다.");
        return null;
    }
    return gameScene;
};
exports.getGameInstance = getGameInstance;
