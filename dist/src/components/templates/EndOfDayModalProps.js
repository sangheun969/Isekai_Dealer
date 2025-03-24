"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const PetShopModal_1 = __importDefault(require("./PetShopModal"));
const EndOfDayModal = ({ purchases, sales, purchaseCount, salesCount, revenue, onClose, }) => {
    const [showNoticeboard, setShowNoticeboard] = (0, react_1.useState)(false);
    const [showPetShop, setShowPetShop] = (0, react_1.useState)(false);
    const handleNext = () => {
        setShowNoticeboard(true);
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50", children: showNoticeboard ? ((0, jsx_runtime_1.jsxs)("div", { className: "relative bg-cover bg-center p-6 rounded-lg shadow-lg w-full h-full flex flex-col items-center", style: {
                backgroundImage: `url(/images/background/bulletinboard.png)`,
            }, children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-white mb-6", children: "\uD83D\uDCCB \uAC8C\uC2DC\uD310" }), (0, jsx_runtime_1.jsxs)("div", { className: "mx-auto space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-around", children: [(0, jsx_runtime_1.jsx)("button", { className: "w-[20%] h-[20%] transition-transform duration-200 hover:scale-110", onClick: () => console.log("🏡 부동산 목록 열기"), children: (0, jsx_runtime_1.jsx)("img", { src: "/images/background/boardlist2.png", alt: "\uBD80\uB3D9\uC0B0 \uBAA9\uB85D", className: "w-full h-full" }) }), (0, jsx_runtime_1.jsx)("button", { className: "w-[20%] h-[20%] transition-transform duration-200 hover:scale-110", onClick: () => setShowPetShop(true), children: (0, jsx_runtime_1.jsx)("img", { src: "/images/background/boardlist3.png", alt: "\uD3AB \uC0F5", className: "w-full h-full" }) })] }), (0, jsx_runtime_1.jsx)("button", { className: "absolute bottom-6 left-1/2 transform -translate-x-1/2 border px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition", onClick: onClose, children: "\uB2E4\uC74C" })] }), showPetShop && ((0, jsx_runtime_1.jsx)(PetShopModal_1.default, { onClose: () => setShowPetShop(false) }))] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white p-6 rounded-lg shadow-lg w-96", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold mb-4", children: "\uD83D\uDCCA \uD558\uB8E8 \uB9E4\uCD9C \uC815\uC0B0" }), (0, jsx_runtime_1.jsxs)("p", { children: ["\uD83D\uDECD\uFE0F \uCD1D \uAD6C\uB9E4 \uAE08\uC561: ", purchases.toLocaleString(), " \uCF54\uC778"] }), (0, jsx_runtime_1.jsxs)("p", { children: ["\uD83D\uDCB0 \uCD1D \uD310\uB9E4 \uAE08\uC561: ", sales.toLocaleString(), " \uCF54\uC778"] }), (0, jsx_runtime_1.jsxs)("p", { children: ["\uD83D\uDCE6 \uAD6C\uB9E4\uD55C \uC544\uC774\uD15C \uAC1C\uC218: ", purchaseCount, "\uAC1C"] }), (0, jsx_runtime_1.jsxs)("p", { children: ["\uD83C\uDFEA \uD310\uB9E4\uD55C \uC544\uC774\uD15C \uAC1C\uC218: ", salesCount, "\uAC1C"] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xl font-bold mt-4", children: ["\uD83D\uDCB5 \uC624\uB298\uC758 \uB9E4\uCD9C: ", revenue.toLocaleString(), " \uCF54\uC778"] }), (0, jsx_runtime_1.jsx)("button", { className: "mt-4 px-4 py-2 bg-blue-500 text-white rounded", onClick: handleNext, children: "\uB2E4\uC74C" })] })) }));
};
exports.default = EndOfDayModal;
