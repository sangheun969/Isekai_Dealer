import React, { useEffect } from "react";
import Phaser from "phaser";
import BootScene from "./game/BootScene";
import Scenes from "./game/Scenes";
import StoryScene from "./game/StoryScene";
import GameScene from "./game/GameScene";
import { PetListProvider } from "./utils/PetListContext";
import { setGameInstance } from "./components/organisms/gameInstance";

const App: React.FC = () => {
  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      scene: [BootScene, Scenes, StoryScene, GameScene],
      parent: "phaser-game-container",
      audio: {
        disableWebAudio: false,
      },
    };

    const game = new Phaser.Game(config);
    setGameInstance(game);
    console.log("✅ [App.tsx] setGameInstance() 실행 완료");

    return () => {
      if (game) {
        game.destroy(true);
      }
    };
  }, []);

  return <div id="phaser-game-container" className="w-full h-screen"></div>;
};

export default App;
