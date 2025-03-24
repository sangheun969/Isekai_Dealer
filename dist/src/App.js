"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const phaser_1 = __importDefault(require("phaser"));
const BootScene_1 = __importDefault(require("./game/BootScene"));
const Scenes_1 = __importDefault(require("./game/Scenes"));
const StoryScene_1 = __importDefault(require("./game/StoryScene"));
const GameScene_1 = __importDefault(require("./game/GameScene"));
const gameInstance_1 = require("./components/organisms/gameInstance");
const App = () => {
    (0, react_1.useEffect)(() => {
        const config = {
            type: phaser_1.default.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            scene: [BootScene_1.default, Scenes_1.default, StoryScene_1.default, GameScene_1.default],
            parent: "phaser-game-container",
            audio: {
                disableWebAudio: false,
            },
        };
        const game = new phaser_1.default.Game(config);
        (0, gameInstance_1.setGameInstance)(game);
        console.log("✅ [App.tsx] setGameInstance() 실행 완료");
        return () => {
            if (game) {
                game.destroy(true);
            }
        };
    }, []);
    return (0, jsx_runtime_1.jsx)("div", { id: "phaser-game-container", className: "w-full h-screen" });
};
exports.default = App;
