import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "gameData.db");
const sqlite = sqlite3.verbose();
const connectDB = () => {
    return new sqlite.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if (err) {
            console.error("❌ 데이터베이스 연결 실패:", err.message);
        }
    });
};
const setupDatabase = () => {
    const db = connectDB();
    db.serialize(() => {
        db.run(`
      CREATE TABLE IF NOT EXISTS game_progress (
        id INTEGER PRIMARY KEY UNIQUE,
        money INTEGER NOT NULL,
        items TEXT NOT NULL
      )
    `);
    });
    db.close();
};
setupDatabase();
export const saveGameProgress = async (money, items) => {
    const db = connectDB();
    return new Promise((resolve, reject) => {
        const itemsJSON = JSON.stringify(items);
        db.run(`INSERT INTO game_progress (id, money, items) 
       VALUES (1, ?, ?) 
       ON CONFLICT(id) DO UPDATE SET money = excluded.money, items = excluded.items`, [money, itemsJSON], (err) => {
            if (err) {
                console.error("❌ 저장 실패:", err.message);
                reject(err);
            }
            else {
                console.log("✅ 게임 진행 데이터 저장 완료!");
                resolve();
            }
        });
        db.close();
    });
};
export const loadGameProgress = async () => {
    const db = connectDB();
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM game_progress WHERE id = 1", (err, row) => {
            db.close();
            if (err) {
                console.error("❌ 불러오기 실패:", err.message);
                reject(err);
                return;
            }
            if (!row) {
                console.warn("⚠️ 저장된 게임 데이터가 없습니다.");
                resolve(null);
                return;
            }
            const result = row;
            try {
                resolve({ money: result.money, items: JSON.parse(result.items) });
            }
            catch (parseError) {
                console.error("❌ 데이터 파싱 실패:", parseError);
                reject(parseError);
            }
        });
    });
};
