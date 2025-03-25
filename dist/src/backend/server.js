"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const gameDataService_js_1 = require("./gameDataService.js");
const app = (0, express_1.default)();
const PORT = 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post("/api/save", async (req, res) => {
    const { money, items, customerData, petList } = req.body;
    await (0, gameDataService_js_1.saveGameProgress)(money, items, customerData, petList);
    res.json({ success: true });
});
app.get("/api/load", async (req, res) => {
    const data = await (0, gameDataService_js_1.loadGameProgress)();
    res.json(data);
});
app.listen(PORT, () => {
    console.log(`✅ 백엔드 서버 실행 중: http://localhost:${PORT}`);
});
