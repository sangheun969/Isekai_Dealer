"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadGameProgress = exports.saveGameProgress = exports.setupDatabase = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const path_1 = __importDefault(require("path"));
const sqlite = sqlite3_1.default.verbose();
const dbPath = path_1.default.join(__dirname, "gameData.db");
const db = new sqlite.Database(dbPath);
const setupDatabase = () => {
    db.serialize(() => {
        db.run(`
      CREATE TABLE IF NOT EXISTS game_progress (
        id INTEGER PRIMARY KEY UNIQUE,
        money INTEGER NOT NULL DEFAULT 100000,
        items TEXT NOT NULL DEFAULT '[]',
        customer_data TEXT NOT NULL DEFAULT '{}',
        pet_list TEXT NOT NULL DEFAULT '[]' 
      )
    `);
    });
};
exports.setupDatabase = setupDatabase;
(0, exports.setupDatabase)();
const saveGameProgress = (money, items, customerData = {}, petList = []) => {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO game_progress (id, money, items, customer_data, pet_list) 
        VALUES (?, ?, ?, ?, ?) 
       ON CONFLICT(id) DO UPDATE 
       SET money = excluded.money, 
           items = excluded.items,
           customer_data = excluded.customer_data,
           pet_list = excluded.pet_list;`, [
            1,
            money,
            JSON.stringify(items),
            JSON.stringify(customerData),
            JSON.stringify(petList),
        ], (err) => {
            if (err) {
                console.error("❌ 게임 데이터 저장 실패:", err.message);
                reject(err);
            }
            else {
                console.log("✅ 게임 데이터 저장 성공!");
                resolve();
            }
        });
    });
};
exports.saveGameProgress = saveGameProgress;
const loadGameProgress = () => {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM game_progress WHERE id = 1", (err, row) => {
            if (err) {
                console.error("❌ 게임 데이터 불러오기 실패:", err.message);
                reject(err);
                return;
            }
            if (!row) {
                console.warn("⚠️ 저장된 게임 데이터가 없습니다. 기본값을 사용합니다.");
                resolve({
                    money: 100000,
                    items: [],
                    customerData: {},
                    petList: [],
                });
                return;
            }
            try {
                resolve({
                    money: row.money ?? 100000,
                    items: row.items ? JSON.parse(row.items) : [],
                    customerData: row.customer_data
                        ? JSON.parse(row.customer_data)
                        : {},
                    petList: row.pet_list ? JSON.parse(row.pet_list) : [],
                });
            }
            catch (parseError) {
                console.error("❌ 데이터 파싱 실패:", parseError);
                reject(parseError);
            }
        });
    });
};
exports.loadGameProgress = loadGameProgress;
