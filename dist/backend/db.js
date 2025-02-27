import sqlite3 from "sqlite3";
import path from "path";
const sqlite = sqlite3.verbose();
const dbPath = path.join(__dirname, "gameData.db");
const db = new sqlite.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
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
export default db;
