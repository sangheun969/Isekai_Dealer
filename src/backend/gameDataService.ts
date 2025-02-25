import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "gameData.db");
const sqlite = sqlite3.verbose();
const db = new sqlite.Database(
  dbPath,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error("❌ 데이터베이스 연결 실패:", err.message);
    } else {
      console.log("✅ 데이터베이스 연결 성공:", dbPath);
    }
  }
);

export const saveGameProgress = (money: number, items: any[]) => {
  const itemsJSON = JSON.stringify(items);
  db.run("DELETE FROM game_progress");
  db.run(
    "INSERT INTO game_progress (money, items) VALUES (?, ?)",
    [money, itemsJSON],
    (err) => {
      if (err) {
        console.error("❌ 저장 실패:", err.message);
      } else {
        console.log("✅ 게임 진행 데이터 저장 완료!");
      }
    }
  );
};

export const loadGameProgress = async (): Promise<{
  money: number;
  items: any[];
} | null> => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM game_progress ORDER BY id DESC LIMIT 1",
      (err, row: { money: number; items: string } | undefined) => {
        if (err) {
          console.error("❌ 불러오기 실패:", err.message);
          reject(err);
        } else {
          if (row) {
            resolve({ money: row.money, items: JSON.parse(row.items) });
          } else {
            resolve(null);
          }
        }
      }
    );
  });
};
