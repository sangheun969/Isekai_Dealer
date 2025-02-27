import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import Phaser from "phaser";
import BootScene from "./game/BootScene.js";
import Scenes from "./game/Scenes.js";
import SelectMain from "./game/SelectMain.js";
import StoryScene from "./game/StoryScene.js";
import GameScene from "./game/GameScene.js";
const App = () => {
    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            scene: [BootScene, Scenes, SelectMain, StoryScene, GameScene],
            parent: "phaser-game-container",
            audio: {
                disableWebAudio: false,
            },
        };
        const game = new Phaser.Game(config);
        return () => {
            game.destroy(true);
        };
    }, []);
    return _jsx("div", { id: "phaser-game-container", className: "w-full h-screen" });
};
export default App;
