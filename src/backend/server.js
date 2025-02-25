import express from "express";
import cors from "cors";
import { saveGameProgress, loadGameProgress } from "./gameDataService.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post("/api/save", async (req, res) => {
  const { money, items } = req.body;
  saveGameProgress(money, items);
  res.json({ success: true });
});

app.get("/api/load", async (req, res) => {
  const data = await loadGameProgress();
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`✅ 백엔드 서버 실행 중: http://localhost:${PORT}`);
});
