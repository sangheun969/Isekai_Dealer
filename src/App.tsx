import React, { useEffect } from "react";
import Phaser from "phaser";
import BootScene from "./game/BootScene.tsx";
import Scenes from "./game/Scenes.tsx";
import SelectMain from "./game/SelectMain.tsx";
import StoryScene from "./game/StoryScene.tsx";
import GameScene from "./game/GameScene.tsx";

const App: React.FC = () => {
  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
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

  return <div id="phaser-game-container" className="w-full h-screen"></div>;
};

export default App;
