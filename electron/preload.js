const { contextBridge, ipcRenderer } = require("electron");

let greenworks = null;

try {
  greenworks = require("greenworks");
  console.log("✅ [Preload] Greenworks 로드 성공!");
} catch (error) {
  console.warn("⚠️ [Preload] 개발 중이거나 Steam 미탑재 환경입니다.");
  greenworks = null;
}

contextBridge.exposeInMainWorld("api", {
  saveGame: (data) => ipcRenderer.send("save-game", data),
  loadGame: () => ipcRenderer.invoke("load-game"),

  saveGameToDB: (data) => ipcRenderer.invoke("save-game-to-db", data),
  loadGameFromDB: () => ipcRenderer.invoke("load-game-from-db"),

  greenworks: greenworks,
});
