import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import Phaser from "phaser";
const SetUpBar = ({ onClose, scene }) => {
    const [selectedTab, setSelectedTab] = useState("audio");
    const [bgmVolume, setBgmVolume] = useState(0.5);
    const [effectVolume, setEffectVolume] = useState(0.5);
    useEffect(() => {
        const bgm = scene.registry.get("backgroundMusic");
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
        const bgm = scene.registry.get("backgroundMusic");
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
        if (effectSound instanceof Phaser.Sound.WebAudioSound) {
            effectSound.setVolume(newVolume);
            effectSound.play();
        }
    };
    return (_jsx("div", { className: "w-full h-[100vh] fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center", children: _jsxs("div", { className: "w-full h-full bg-black p-6 rounded-lg shadow-lg", children: [_jsxs("div", { className: "py-9 flex flex-row justify-around items-center border-2 border-b-indigo-500", children: [_jsx("button", { className: `text-white px-6 py-2 rounded-md mb-4 border ${selectedTab === "video" ? "bg-indigo-500" : ""}`, onClick: () => setSelectedTab("video"), children: "\uBE44\uB514\uC624" }), _jsx("button", { className: `text-white px-6 py-2 rounded-md mb-4 border ${selectedTab === "audio" ? "bg-indigo-500" : ""}`, onClick: () => setSelectedTab("audio"), children: "\uC624\uB514\uC624" }), _jsx("button", { className: `text-white px-6 py-2 rounded-md mb-4 border ${selectedTab === "language" ? "bg-indigo-500" : ""}`, onClick: () => setSelectedTab("language"), children: "\uC5B8\uC5B4" })] }), _jsxs("div", { className: "text-white flex flex-col justify-center items-center border h-[70%]", children: [selectedTab === "video" && _jsx("p", { children: "\uBE44\uB514\uC624 \uC124\uC815" }), selectedTab === "audio" && (_jsxs("div", { className: "flex flex-col items-center gap-4", children: [_jsx("p", { children: "\uC624\uB514\uC624 \uC124\uC815" }), _jsxs("label", { className: "flex flex-col items-center", children: ["\uD83C\uDFB5 \uBC30\uACBD\uC74C \uBCFC\uB968: ", Math.round(bgmVolume * 100), "%", _jsx("input", { type: "range", min: "0", max: "1", step: "0.01", value: bgmVolume, onChange: handleBgmVolumeChange, className: "w-60 mt-2" })] }), _jsxs("label", { className: "flex flex-col items-center mt-4", children: ["\uD83D\uDD14 \uD6A8\uACFC\uC74C \uBCFC\uB968: ", Math.round(effectVolume * 100), "%", _jsx("input", { type: "range", min: "0", max: "1", step: "0.01", value: effectVolume, onChange: handleEffectVolumeChange, className: "w-60 mt-2" })] })] })), selectedTab === "language" && _jsx("p", { children: "\uC5B8\uC5B4 \uC124\uC815" })] }), _jsx("button", { className: "bg-gray-800 text-white px-4 py-2 rounded-md w-[150px] mb-4 absolute bottom-5 right-5", onClick: onClose, children: "\uB2EB\uAE30" })] }) }));
};
export default SetUpBar;
