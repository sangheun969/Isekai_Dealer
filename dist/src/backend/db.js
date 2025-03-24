"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = __importDefault(require("sqlite3"));
const path_1 = __importDefault(require("path"));
const sqlite = sqlite3_1.default.verbose();
const dbPath = path_1.default.join(__dirname, "gameData.db");
const db = new sqlite.Database(dbPath, sqlite3_1.default.OPEN_READWRITE | sqlite3_1.default.OPEN_CREATE, (err) => {
    if (err) {
        console.error("❌ 데이터베이스 연결 실패:", err.message);
    }
    else {
        console.log("✅ 데이터베이스 연결 성공:", dbPath);
        checkTableExists();
    }
});
const checkTableExists = () => {
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='game_progress'", (err, row) => {
        if (!row) {
            console.error("❌ 'game_progress' 테이블이 존재하지 않습니다! setupDatabase.ts 실행이 필요합니다.");
        }
        else {
            console.log("✅ 'game_progress' 테이블이 정상적으로 존재합니다.");
        }
    });
};
exports.default = db;
