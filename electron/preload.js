const { contextBridge, ipcRenderer } = require("electron");
const path = require("path");

let greenworks;
try {
  greenworks = require(path.join(__dirname, "../dist/node_modules/greenworks"));
  console.log("✅ [Preload] Greenworks 로드 성공!");
} catch (error) {
  console.error("❌ [Preload] Greenworks 로드 실패!", error);
}

contextBridge.exposeInMainWorld("electron", {
  saveGame: (data) => ipcRenderer.send("save-game", data),
  loadGame: () => ipcRenderer.invoke("load-game"),
  greenworks: greenworks || null,
});
