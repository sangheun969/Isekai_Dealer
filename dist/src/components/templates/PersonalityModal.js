"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const PersonalityModal = ({ personality, greedLevel, }) => {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "fixed top-1/2 left-1/2 w-[30%] h-[30%] bg-slate-400 p-5 rounded-lg z-50 flex flex-col justify-center items-center transform -translate-x-1/2 -translate-y-1/2", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-bold", children: "\uC190\uB2D8\uC758 \uC131\uACA9" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2", children: personality }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-row gap-2 mt-4", children: [...Array(5)].map((_, index) => ((0, jsx_runtime_1.jsx)("div", { className: `w-10 h-10 border rounded-md transition-all duration-300 ${index < greedLevel ? "bg-red-500" : "bg-gray-300"}` }, index))) })] }));
};
exports.default = PersonalityModal;
