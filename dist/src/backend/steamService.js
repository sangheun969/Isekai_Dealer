"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadGameFromSteamCloud = exports.saveGameToSteamCloud = void 0;
const greenworks = require("greenworks");
const saveGameToSteamCloud = (data) => {
    const saveData = JSON.stringify(data);
    if (greenworks.saveTextToFile("saveData.json", saveData)) {
        console.log("✅ Steam Cloud 저장 성공!");
    }
    else {
        console.error("❌ Steam Cloud 저장 실패!");
    }
};
exports.saveGameToSteamCloud = saveGameToSteamCloud;
const loadGameFromSteamCloud = () => {
    if (greenworks.fileExists("saveData.json")) {
        const saveData = greenworks.readTextFromFile("saveData.json");
        return JSON.parse(saveData);
    }
    else {
        console.warn("⚠️ Steam Cloud에 저장된 데이터가 없습니다.");
        return null;
    }
};
exports.loadGameFromSteamCloud = loadGameFromSteamCloud;
