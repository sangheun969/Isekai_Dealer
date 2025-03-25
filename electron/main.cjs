const fs = require("fs");
const path = require("path");
const { app, BrowserWindow, ipcMain, screen } = require("electron");

let greenworks;
try {
  greenworks = require("greenworks");
} catch (error) {
  console.error("❌ Greenworks not found");
  process.exit(1);
}

const greenworksNodePath = require.resolve(
  "greenworks/lib/greenworks-win64.node"
);
if (!fs.existsSync(greenworksNodePath)) {
  console.error(
    `❌ Greenworks .node 파일을 찾을 수 없습니다: ${greenworksNodePath}`
  );
  process.exit(1);
}

console.log(`🔍 Greenworks .node 파일 경로: ${greenworksNodePath}`);

let mainWindow = null;

app.whenReady().then(() => {
  if (greenworks.init()) {
    console.log("✅ Steam API 초기화 성공!");
  } else {
    console.error(
      "❌ Steam API 초기화 실패! Steam 클라이언트가 실행 중인지 확인하세요."
    );
  }

  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    width,
    height,
    fullscreen: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadURL(`file://${path.join(__dirname, "../build/index.html")}`);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
});

ipcMain.on("save-game", (event, data) => {
  const saveData = JSON.stringify(data);
  if (greenworks.saveTextToFile("saveData.json", saveData)) {
    console.log("✅ Steam Cloud 저장 성공!");
    event.reply("save-game-response", { success: true });
  } else {
    console.error("❌ Steam Cloud 저장 실패!");
    event.reply("save-game-response", { success: false });
  }
});

ipcMain.handle("load-game", async () => {
  if (greenworks.fileExists("saveData.json")) {
    const saveData = greenworks.readTextFromFile("saveData.json");
    console.log("✅ Steam Cloud 데이터 불러오기 성공!");
    return JSON.parse(saveData);
  } else {
    console.warn("⚠️ Steam Cloud에 저장된 데이터가 없습니다.");
    return null;
  }
});
