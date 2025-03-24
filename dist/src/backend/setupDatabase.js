"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = __importDefault(require("sqlite3"));
const path_1 = __importDefault(require("path"));
const sqlite = sqlite3_1.default.verbose();
const dbPath = path_1.default.join(__dirname, "gameData.db");
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
