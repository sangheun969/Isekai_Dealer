const greenworks = require("greenworks");

export const saveGameToSteamCloud = (data: any) => {
  const saveData = JSON.stringify(data);
  if (greenworks.saveTextToFile("saveData.json", saveData)) {
    console.log("✅ Steam Cloud 저장 성공!");
  } else {
    console.error("❌ Steam Cloud 저장 실패!");
  }
};

export const loadGameFromSteamCloud = () => {
  if (greenworks.fileExists("saveData.json")) {
    const saveData = greenworks.readTextFromFile("saveData.json");
    return JSON.parse(saveData);
  } else {
    console.warn("⚠️ Steam Cloud에 저장된 데이터가 없습니다.");
    return null;
  }
};
