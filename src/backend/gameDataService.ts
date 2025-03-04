import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "gameData.db");
const sqlite = sqlite3.verbose();

const connectDB = () => {
  return new sqlite.Database(
    dbPath,
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.error("❌ 데이터베이스 연결 실패:", err.message);
      }
    }
  );
};

const setupDatabase = () => {
  const db = connectDB();
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS game_progress (
        id INTEGER PRIMARY KEY UNIQUE,
        money INTEGER NOT NULL,
        items TEXT NOT NULL,
        customer_data TEXT NOT NULL
      )
    `);
  });
  db.close();
};

setupDatabase();

interface GameProgress {
  money: number;
  items: any[];
  customerData: any;
}

/**
 * 📝 게임 진행 데이터 저장 함수
 */
export const saveGameProgress = async (
  money: number,
  items: any[],
  customerData: any
): Promise<void> => {
  const db = connectDB();
  return new Promise<void>((resolve, reject) => {
    const itemsJSON = JSON.stringify(items);
    const customerDataJSON = JSON.stringify(customerData);

    db.run(
      `INSERT INTO game_progress (id, money, items, customer_data) 
       VALUES (1, ?, ?, ?) 
       ON CONFLICT(id) DO UPDATE 
       SET money = excluded.money, 
           items = excluded.items,
           customer_data = excluded.customer_data;`,
      [money, itemsJSON, customerDataJSON],
      (err) => {
        if (err) {
          console.error("❌ 저장 실패:", err.message);
          reject(err);
        } else {
          console.log("✅ 게임 진행 데이터 저장 완료!");
          resolve();
        }
      }
    );

    db.close();
  });
};

export const loadGameProgress = async (): Promise<GameProgress | null> => {
  const db = connectDB();
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM game_progress WHERE id = 1", (err, row: any) => {
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
      try {
        resolve({
          money: row.money,
          items:
            typeof row.items === "string" ? JSON.parse(row.items) : row.items,
          customerData:
            typeof row.customer_data === "string"
              ? JSON.parse(row.customer_data)
              : row.customer_data,
        });
      } catch (parseError) {
        console.error("❌ 데이터 파싱 실패:", parseError);
        reject(parseError);
      }
    });
  });
};
