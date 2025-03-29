"use strict";
const { contextBridge, ipcRenderer } = require("electron");
const path = require("path");
let greenworks;
try {
    greenworks = require(path.join(__dirname, "../dist/node_modules/greenworks"));
    console.log("✅ [Preload] Greenworks 로드 성공!");
}
catch (error) {
    console.error("❌ [Preload] Greenworks 로드 실패!", error);
}
contextBridge.exposeInMainWorld("api", {
    saveGame: (data) => ipcRenderer.send("save-game", data),
    loadGame: () => ipcRenderer.invoke("load-game"),
    saveGameToDB: (data) => ipcRenderer.invoke("save-game-to-db", data),
    loadGameFromDB: () => ipcRenderer.invoke("load-game-from-db"),
    greenworks: greenworks || null,
});
