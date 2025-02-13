import React, { useEffect } from "react";
import Phaser from "phaser";
import Scenes from "./game/Scenes";
import SavePage from "./game/SavePage";
import SelectMain from "./game/SelectMain";
import StoryScene from "./game/StoryScene";
import GameScene from "./game/GameScene";

const App: React.FC = () => {
  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      scene: [Scenes, SavePage, SelectMain, StoryScene, GameScene],
      parent: "phaser-game-container",
    };

    new Phaser.Game(config);
  }, []);

  return <div id="phaser-game-container" className="w-full h-screen"></div>;
};

export default App;
