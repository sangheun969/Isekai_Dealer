"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const phaser_1 = __importDefault(require("phaser"));
const SetUpBar = ({ onClose, scene }) => {
    const [selectedTab, setSelectedTab] = (0, react_1.useState)("audio");
    const [bgmVolume, setBgmVolume] = (0, react_1.useState)(0.5);
    const [effectVolume, setEffectVolume] = (0, react_1.useState)(0.5);
    const [resolution, setResolution] = (0, react_1.useState)("1920x1080");
    (0, react_1.useEffect)(() => {
        scene.input.enabled = false;
        return () => {
            scene.input.enabled = true;
        };
    }, [scene]);
    (0, react_1.useEffect)(() => {
        const bgm = scene.registry.get("bgm");
        if (bgm && typeof bgm.volume === "number") {
            setBgmVolume(bgm.volume);
        }
        const storedEffectVolume = scene.registry.get("effectVolume");
        if (storedEffectVolume !== undefined) {
            setEffectVolume(storedEffectVolume);
        }
    }, [scene]);
    const handleBgmVolumeChange = (event) => {
        const newVolume = parseFloat(event.target.value);
        setBgmVolume(newVolume);
        const bgm = scene.registry.get("bgm");
        if (bgm && typeof bgm.setVolume === "function") {
            bgm.setVolume(newVolume);
        }
    };
    const handleEffectVolumeChange = (event) => {
        const newVolume = parseFloat(event.target.value);
        setEffectVolume(newVolume);
        scene.registry.set("effectVolume", newVolume);
        let effectSound = scene.sound.get("buttonClick");
        if (!effectSound) {
            effectSound = scene.sound.add("buttonClick", {
                volume: newVolume,
            });
        }
        if (effectSound instanceof phaser_1.default.Sound.WebAudioSound) {
            effectSound.setVolume(newVolume);
            effectSound.play();
        }
    };
    const handleResolutionChange = (event) => {
        const newResolution = event.target.value;
        setResolution(newResolution);
        const [newWidth, newHeight] = newResolution.split("x").map(Number);
        scene.scale.resize(newWidth, newHeight);
        const gameContainer = document.getElementById("phaser-game-container");
        if (gameContainer) {
            gameContainer.style.width = `${newWidth}px`;
            gameContainer.style.height = `${newHeight}px`;
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-[100vh] fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "w-full h-full bg-black p-6 rounded-lg shadow-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "py-9 flex flex-row justify-around items-center border-2 border-b-indigo-500", children: [(0, jsx_runtime_1.jsx)("button", { className: `text-white px-6 py-2 rounded-md mb-4 border ${selectedTab === "video" ? "bg-indigo-500" : ""}`, onClick: () => setSelectedTab("video"), children: "\uBE44\uB514\uC624" }), (0, jsx_runtime_1.jsx)("button", { className: `text-white px-6 py-2 rounded-md mb-4 border ${selectedTab === "audio" ? "bg-indigo-500" : ""}`, onClick: () => setSelectedTab("audio"), children: "\uC624\uB514\uC624" }), (0, jsx_runtime_1.jsx)("button", { className: `text-white px-6 py-2 rounded-md mb-4 border ${selectedTab === "language" ? "bg-indigo-500" : ""}`, onClick: () => setSelectedTab("language"), children: "\uC5B8\uC5B4" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-white flex flex-col justify-center items-center border h-[70%]", children: [selectedTab === "video" && ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center gap-4", children: [(0, jsx_runtime_1.jsx)("p", { children: "\uD83D\uDCFA \uD654\uBA74 \uD574\uC0C1\uB3C4 \uC124\uC815" }), (0, jsx_runtime_1.jsxs)("select", { value: resolution, onChange: handleResolutionChange, className: "text-black px-4 py-2 rounded-md", children: [(0, jsx_runtime_1.jsx)("option", { value: "1280x720", children: "1280 x 720 (HD) \uD83D\uDD3D" }), (0, jsx_runtime_1.jsx)("option", { value: "1920x1080", children: "1920 x 1080 (FHD) \u2705" }), (0, jsx_runtime_1.jsx)("option", { value: "2560x1440", children: "2560 x 1440 (QHD)" })] })] })), selectedTab === "audio" && ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center gap-4", children: [(0, jsx_runtime_1.jsx)("p", { children: "\uD83C\uDFB5 \uC624\uB514\uC624 \uC124\uC815" }), (0, jsx_runtime_1.jsxs)("label", { className: "flex flex-col items-center", children: ["\uBC30\uACBD\uC74C \uBCFC\uB968: ", Math.round(bgmVolume * 100), "%", (0, jsx_runtime_1.jsx)("input", { type: "range", min: "0", max: "1", step: "0.01", value: bgmVolume, onChange: handleBgmVolumeChange, className: "w-60 mt-2" })] }), (0, jsx_runtime_1.jsxs)("label", { className: "flex flex-col items-center mt-4", children: ["\uD6A8\uACFC\uC74C \uBCFC\uB968: ", Math.round(effectVolume * 100), "%", (0, jsx_runtime_1.jsx)("input", { type: "range", min: "0", max: "1", step: "0.01", value: effectVolume, onChange: handleEffectVolumeChange, className: "w-60 mt-2" })] })] })), selectedTab === "language" && ((0, jsx_runtime_1.jsx)("div", { className: "flex flex-col items-center gap-4", children: (0, jsx_runtime_1.jsx)("p", { children: "\uD83C\uDF0D \uC5B8\uC5B4 \uC124\uC815" }) }))] }), (0, jsx_runtime_1.jsx)("button", { className: "bg-gray-800 text-white px-4 py-2 rounded-md w-[150px] mb-4 absolute bottom-5 right-5", onClick: () => {
                        scene.input.enabled = true;
                        onClose();
                    }, children: "\uB2EB\uAE30" })] }) }));
};
exports.default = SetUpBar;
