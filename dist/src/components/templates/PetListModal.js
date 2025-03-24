"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const gameInstance_1 = require("../organisms/gameInstance");
const PetListModal = ({ pets, itemsPerPage, onClose, }) => {
    const [currentPage, setCurrentPage] = (0, react_1.useState)(0);
    const [selectedPetId, setSelectedPetId] = (0, react_1.useState)(0);
    const [ownedPets, setOwnedPets] = (0, react_1.useState)([]);
    const defaultPet = {
        id: 0,
        name: "기본 고양이",
        image: "/images/main/cat1.png",
    };
    (0, react_1.useEffect)(() => {
        const storedPets = localStorage.getItem("ownedPets");
        if (storedPets) {
            setOwnedPets(JSON.parse(storedPets));
        }
    }, []);
    const allPets = [defaultPet, ...pets];
    const startIndex = currentPage * itemsPerPage;
    const selectedPets = allPets.slice(startIndex, startIndex + itemsPerPage);
    (0, react_1.useEffect)(() => {
        const gameScene = (0, gameInstance_1.getGameInstance)();
        if (gameScene && gameScene.scene.isActive()) {
            gameScene.setSelectedPet(defaultPet);
        }
    }, []);
    const nextPage = () => {
        if (startIndex + itemsPerPage < allPets.length) {
            setCurrentPage((prev) => prev + 1);
        }
    };
    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prev) => prev - 1);
        }
    };
    const handlePetSelection = (pet) => {
        setSelectedPetId(pet.id);
        const gameScene = (0, gameInstance_1.getGameInstance)();
        if (gameScene && gameScene.scene.isActive()) {
            gameScene.setSelectedPet(pet);
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50", style: { pointerEvents: "none" }, children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white p-6 rounded-lg shadow-lg w-[600px]", style: { pointerEvents: "auto" }, children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold mb-4", children: "\uD83D\uDC3E \uBCF4\uC720\uD55C \uD3AB \uBAA9\uB85D" }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-col gap-4", children: selectedPets.length > 0 ? (selectedPets.map((pet) => ((0, jsx_runtime_1.jsxs)("button", { className: `flex items-center gap-4 p-3 border rounded-lg ${selectedPetId === pet.id ? "bg-green-400" : "bg-white"}`, onClick: () => handlePetSelection(pet), children: [(0, jsx_runtime_1.jsx)("img", { src: pet.image, alt: pet.name, className: "w-26 h-24 rounded-md" }), (0, jsx_runtime_1.jsx)("span", { className: "font-semibold", children: pet.name })] }, pet.id)))) : ((0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "\uBCF4\uC720\uD55C \uD3AB\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." })) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between mt-4", children: [(0, jsx_runtime_1.jsx)("button", { className: "px-4 py-2 bg-gray-400 text-white rounded", onClick: prevPage, disabled: currentPage === 0, children: "\u25C0 \uC774\uC804" }), (0, jsx_runtime_1.jsx)("button", { className: "px-4 py-2 bg-gray-400 text-white rounded", onClick: nextPage, disabled: startIndex + itemsPerPage >= allPets.length, children: "\uB2E4\uC74C \u25B6" })] }), (0, jsx_runtime_1.jsx)("button", { className: "mt-4 px-4 py-2 bg-red-500 text-white rounded w-full", onClick: onClose, children: "\uB2EB\uAE30" })] }) }));
};
exports.default = PetListModal;
