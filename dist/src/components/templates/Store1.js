"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Store1 = () => {
    const gameContainer = (0, react_1.useRef)(null);
    const [showPhaser, setShowPhaser] = (0, react_1.useState)(true);
    return ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-full", children: (0, jsx_runtime_1.jsx)("div", { ref: gameContainer, className: "w-full h-full relative", children: (0, jsx_runtime_1.jsx)("button", { className: "absolute p-2 text-white rounded-md hover:bg-black transition-all duration-300", children: "\uBA54\uB274" }) }) }));
};
exports.default = Store1;
