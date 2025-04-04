"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadGameProgress = exports.saveGameProgress = void 0;
const API_URL = "http://localhost:3001/api";
const saveGameProgress = async (money, items, petList, customerData) => {
    try {
        const response = await fetch(`${API_URL}/save`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ money, items, customerData, petList }),
        });
        if (!response.ok) {
            throw new Error(`서버 응답 실패: ${response.status}`);
        }
        const result = await response.json();
        if (result.success) {
            console.log("✅ 게임 진행 데이터 저장 성공");
        }
        else {
            console.error("❌ 게임 진행 데이터 저장 실패");
        }
    }
    catch (error) {
        console.error("❌ 게임 진행 데이터 저장 중 오류 발생:", error);
    }
};
exports.saveGameProgress = saveGameProgress;
const loadGameProgress = async () => {
    try {
        const response = await fetch(`${API_URL}/load`);
        const data = await response.json();
        if (data) {
            console.log("✅ 게임 진행 데이터 불러오기 성공", data);
            return data;
        }
        else {
            console.warn("⚠️ 저장된 게임 데이터가 없습니다.");
            return null;
        }
    }
    catch (error) {
        console.error("❌ 게임 진행 데이터 불러오기 중 오류 발생:", error);
        return null;
    }
};
exports.loadGameProgress = loadGameProgress;
