import { app, BrowserWindow } from "electron";
import path from "path";
const greenworks = require("greenworks");
let mainWindow = null;
app.whenReady().then(() => {
    if (greenworks.init()) {
        console.log("✅ Steam API 초기화 성공!");
    }
    else {
        console.error("❌ Steam API 초기화 실패! Steam 클라이언트가 실행 중인지 확인하세요.");
    }
    const { width, height } = require("electron").screen.getPrimaryDisplay().workAreaSize;
    mainWindow = new BrowserWindow({
        width: width,
        height: height,
        fullscreen: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });
    if (process.env.NODE_ENV === "development") {
        mainWindow.loadURL("http://localhost:3000");
    }
    else {
        mainWindow.loadURL(`file://${path.join(__dirname, "../build/index.html")}`);
    }
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            app.quit();
        }
    });
});
