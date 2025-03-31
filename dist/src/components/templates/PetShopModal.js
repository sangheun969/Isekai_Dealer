"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const gameInstance_1 = require("../organisms/gameInstance");
const PetShopModal = ({ onClose, onPurchase }) => {
    const [money, setMoney] = (0, react_1.useState)(null);
    const [petList, setPetList] = (0, react_1.useState)([]);
    const petStoreList = [
        {
            id: 1,
            name: "객관안 앵무새",
            image: "/images/main/pet2_1.png",
            price: 5000,
        },
        {
            id: 2,
            name: "귀여운 고양이",
            image: "/images/main/pet3_1.png",
            price: 7000,
        },
    ];
    (0, react_1.useEffect)(() => {
        const gameScene = (0, gameInstance_1.getGameInstance)();
        if (gameScene) {
            gameScene.events.emit("getPlayerMoney", (currentMoney) => {
                setMoney(currentMoney);
            });
        }
        const fetchPetList = async () => {
            try {
                const gameData = await window.api.loadGameFromDB();
                setPetList(gameData.petList || []);
            }
            catch (err) {
                console.error("❌ 펫 리스트 로드 실패:", err);
            }
        };
        fetchPetList();
    }, []);
    const handlePurchase = async (pet) => {
        if (money === null || money < pet.price) {
            alert("❌ 코인이 부족합니다.");
            return;
        }
        const gameScene = (0, gameInstance_1.getGameInstance)();
        if (!gameScene)
            return;
        const updatedMoney = money - pet.price;
        const updatedPetList = [...petList, pet];
        try {
            const gameData = await window.api.loadGameFromDB();
            await window.api.saveGameToDB({
                money: updatedMoney,
                items: gameData.items,
                customerData: gameData.customerData,
                petList: updatedPetList,
            });
            console.log("💾 저장되는 petList:", updatedPetList);
            setMoney(updatedMoney);
            setPetList(updatedPetList);
            gameScene.events.emit("updatePlayerMoney", updatedMoney);
            gameScene.setSelectedPet(pet);
            window.dispatchEvent(new Event("petListUpdated"));
            if (onPurchase)
                onPurchase(pet);
            alert(`✅ ${pet.name}을(를) 구매했습니다!`);
        }
        catch (err) {
            console.error("❌ 펫 구매 처리 중 오류:", err);
            alert("데이터 저장에 실패했습니다.");
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white p-6 rounded-lg shadow-lg w-[400px]", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold mb-4", children: "\uD83D\uDC3E \uD3AB \uC0C1\uC810" }), (0, jsx_runtime_1.jsx)("p", { className: "text-lg font-semibold mb-4", children: money !== null ? `${money.toLocaleString()} 코인` : "로딩 중..." }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-col gap-4", children: petStoreList.map((pet) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 p-3 border rounded-lg", children: [(0, jsx_runtime_1.jsx)("img", { src: pet.image, alt: pet.name, className: "w-20 h-20 rounded-md" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-semibold", children: pet.name }), (0, jsx_runtime_1.jsxs)("span", { className: "text-gray-600", children: ["\uD83D\uDCB0 ", pet.price.toLocaleString(), " \uCF54\uC778"] }), (0, jsx_runtime_1.jsx)("button", { className: `mt-2 px-4 py-2 ${money !== null && money >= pet.price
                                            ? "bg-blue-500 hover:bg-blue-600"
                                            : "bg-gray-400 cursor-not-allowed"} text-white rounded`, onClick: () => handlePurchase(pet), disabled: money !== null && money < pet.price, children: "\uAD6C\uB9E4\uD558\uAE30" })] })] }, pet.id))) }), (0, jsx_runtime_1.jsx)("button", { className: "mt-4 px-4 py-2 bg-red-500 text-white rounded w-full", onClick: onClose, children: "\uB2EB\uAE30" })] }) }));
};
exports.default = PetShopModal;
