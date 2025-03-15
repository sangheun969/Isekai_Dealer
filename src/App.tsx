import React, { useEffect } from "react";
import Phaser from "phaser";
import BootScene from "./game/BootScene";
import Scenes from "./game/Scenes";
import SelectMain from "./game/SelectMain";
import StoryScene from "./game/StoryScene";
import GameScene from "./game/GameScene";
import Noticeboard from "./game/Noticeboard";

let gameInstance: Phaser.Game | null = null;

const App: React.FC = () => {
  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      scene: [
        BootScene,
        Scenes,
        SelectMain,
        StoryScene,
        GameScene,
        Noticeboard,
      ],
      parent: "phaser-game-container",
      audio: {
        disableWebAudio: false,
      },
    };

    gameInstance = new Phaser.Game(config);
    return () => {
      if (gameInstance) {
        gameInstance.destroy(true);
        gameInstance = null;
      }
    };
  }, []);

  return <div id="phaser-game-container" className="w-full h-screen"></div>;
};

export const getGameInstance = (): Phaser.Game | null => gameInstance;

export default App;
