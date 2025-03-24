"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const apiService_1 = require("../../utils/apiService");
const SavePage = ({ onClose, onLoad }) => {
    const [saveSlots, setSaveSlots] = (0, react_1.useState)([]);
    const [selectedSlot, setSelectedSlot] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const fetchSaveData = async () => {
            const data = await (0, apiService_1.loadGameProgress)();
            if (data) {
                const updatedSlots = Array.from({ length: 10 }, (_, index) => ({
                    id: index + 1,
                    money: data[index]?.money || 0,
                    items: data[index]?.items || [],
                }));
                setSaveSlots(updatedSlots);
            }
            else {
                setSaveSlots(Array.from({ length: 10 }, (_, index) => ({
                    id: index + 1,
                    money: 0,
                    items: [],
                })));
            }
        };
        fetchSaveData();
    }, []);
    const handleSave = async (slotId) => {
        const currentData = { money: 100000, items: [] };
        await (0, apiService_1.saveGameProgress)(currentData.money, currentData.items, [], {});
        setSaveSlots((prevSlots) => prevSlots.map((slot) => slot.id === slotId
            ? { ...slot, money: currentData.money, items: currentData.items }
            : slot));
        alert(`슬롯 ${slotId}에 저장되었습니다.`);
    };
    const handleLoad = (slotId) => {
        const selectedData = saveSlots.find((slot) => slot.id === slotId);
        if (selectedData && selectedData.money > 0) {
            onLoad(selectedData);
            onClose();
        }
        else {
            alert("저장된 데이터가 없습니다.");
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-full fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "w-[600px] h-[500px] bg-gray-900 p-6 rounded-lg shadow-lg", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-white text-2xl mb-4 text-center", children: "\uD83D\uDCC2 \uC800\uC7A5 \uC2AC\uB86F" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-5 gap-4", children: saveSlots.map((slot) => ((0, jsx_runtime_1.jsxs)("div", { className: "border border-gray-500 p-3 rounded-md flex flex-col items-center", children: [(0, jsx_runtime_1.jsxs)("p", { className: "text-white", children: ["\uC2AC\uB86F ", slot.id] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-300", children: ["\uD83D\uDCB0 ", slot.money.toLocaleString(), " \uCF54\uC778"] }), (0, jsx_runtime_1.jsx)("button", { className: "mt-2 bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-700", onClick: () => handleSave(slot.id), children: "\uC800\uC7A5" }), (0, jsx_runtime_1.jsx)("button", { className: "mt-1 bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-700", onClick: () => handleLoad(slot.id), children: "\uBD88\uB7EC\uC624\uAE30" })] }, slot.id))) }), (0, jsx_runtime_1.jsx)("button", { className: "w-full mt-6 bg-red-500 text-white py-2 rounded-md hover:bg-red-700", onClick: onClose, children: "\uB2EB\uAE30" })] }) }));
};
exports.default = SavePage;
