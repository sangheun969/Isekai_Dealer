import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useRef } from "react";
const Store1 = () => {
    const gameContainer = useRef(null);
    const [showPhaser, setShowPhaser] = useState(true);
    return (_jsx("div", { className: "w-full h-full", children: _jsx("div", { ref: gameContainer, className: "w-full h-full relative", children: _jsx("button", { className: "absolute p-2 text-white rounded-md hover:bg-black transition-all duration-300", children: "\uBA54\uB274" }) }) }));
};
export default Store1;
