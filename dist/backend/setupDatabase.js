import sqlite3 from "sqlite3";
import path from "path";
const sqlite = sqlite3.verbose();
const dbPath = path.join(__dirname, "gameData.db");
const db = new sqlite.Database(dbPath);
db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS game_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      money INTEGER,
      items TEXT -- JSON 형태로 저장
    )
  `);
});
db.close();
console.log("🎉 데이터베이스가 생성되었습니다:", dbPath);
