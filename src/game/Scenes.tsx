import Phaser from "phaser";
import React from "react";
import ReactDOM from "react-dom/client";
import SetUpBar from "../components/templates/SetUpBar";
import { loadGameProgress, saveGameProgress } from "../utils/apiService";

export default class Scenes extends Phaser.Scene {
  private settingsOpen = false;
  private setupRoot: ReactDOM.Root | null = null;
  private background?: Phaser.GameObjects.Image;
  private startButton?: Phaser.GameObjects.Image;
  private loadButton?: Phaser.GameObjects.Image;
  private settingsButton?: Phaser.GameObjects.Image;
  private exitButton?: Phaser.GameObjects.Image;

  constructor() {
    super({ key: "Scenes" });
  }

  preload() {
    // preload는 BootScene에서 처리했으므로 비워둠
  }

  create() {
    this.drawUI();

    this.scale.on("resize", () => {
      this.clearUI();
      this.drawUI();
    });
  }

  private drawUI() {
    const width = this.scale.width;
    const height = this.scale.height;
    const centerX = width / 2;
    const startY = height * 0.45;
    const buttonGap = 150;
    const buttonScale = width / 1920;

    this.background = this.add
      .image(centerX, height / 2, "startMenuBg")
      .setDisplaySize(width, height)
      .setDepth(-1);

    this.startButton = this.add
      .image(centerX, startY, "playBtn5")
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5)
      .setScale(0.4 * buttonScale);

    this.startButton.on("pointerover", () =>
      this.startButton!.setScale(0.45 * buttonScale)
    );
    this.startButton.on("pointerout", () =>
      this.startButton!.setScale(0.4 * buttonScale)
    );
    this.startButton.on("pointerdown", async () => {
      const newGameData = {
        money: 100000,
        items: [],
        petList: [],
        customerData: {},
      };

      await saveGameProgress(
        newGameData.money,
        newGameData.items,
        newGameData.petList,
        newGameData.customerData
      );

      this.scene.start("StoryScene", {
        reset: true,
        savedData: newGameData,
      });
    });

    this.loadButton = this.add
      .image(centerX, startY + buttonGap, "playBtn6")
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5)
      .setScale(0.4 * buttonScale);

    this.loadButton.on("pointerover", () =>
      this.loadButton!.setScale(0.45 * buttonScale)
    );
    this.loadButton.on("pointerout", () =>
      this.loadButton!.setScale(0.4 * buttonScale)
    );
    this.loadButton.on("pointerdown", async () => {
      const data = await loadGameProgress();

      if (data) {
        this.scene.start("GameScene", { savedData: data });
      } else {
        console.warn("⚠️ 저장된 데이터가 없습니다!");
      }
    });

    this.settingsButton = this.add
      .image(centerX, startY + buttonGap * 2, "playBtn7")
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5)
      .setScale(0.4 * buttonScale);

    this.settingsButton.on("pointerover", () =>
      this.settingsButton!.setScale(0.45 * buttonScale)
    );
    this.settingsButton.on("pointerout", () =>
      this.settingsButton!.setScale(0.4 * buttonScale)
    );
    this.settingsButton.on("pointerdown", () => {
      let effectSound = this.registry.get("buttonClick") as
        | Phaser.Sound.BaseSound
        | undefined;

      if (!effectSound) {
        effectSound = this.sound.add("buttonClick", { volume: 0.5 });
        this.registry.set("buttonClick", effectSound);
      }

      const volume = this.registry.get("effectVolume") as number | undefined;
      if (
        effectSound instanceof Phaser.Sound.WebAudioSound &&
        volume !== undefined
      ) {
        effectSound.setVolume(volume);
      }

      effectSound.play();
      if (!this.settingsOpen) this.showSettingsModal();
    });
    this.exitButton = this.add
      .image(centerX, startY + buttonGap * 3, "playBtn8")
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5)
      .setScale(0.4 * buttonScale);

    this.exitButton.on("pointerover", () => {
      this.exitButton!.setScale(0.45 * buttonScale);
    });

    this.exitButton.on("pointerout", () =>
      this.exitButton!.setScale(0.4 * buttonScale)
    );
    this.exitButton.on("pointerdown", () => {
      console.log("🔚 게임 종료 요청");
      window.api.exitApp();
    });
  }

  private clearUI() {
    this.background?.destroy();
    this.startButton?.destroy();
    this.loadButton?.destroy();
    this.settingsButton?.destroy();
  }

  private showSettingsModal() {
    let setupBar = document.getElementById("setup-bar");
    if (!setupBar) {
      setupBar = document.createElement("div");
      setupBar.id = "setup-bar";
      document.body.appendChild(setupBar);
      this.setupRoot = ReactDOM.createRoot(setupBar);
    }

    this.setupRoot?.render(
      <SetUpBar scene={this} onClose={() => this.closeSettingsModal()} />
    );
    this.settingsOpen = true;
  }

  private closeSettingsModal() {
    if (this.setupRoot) {
      this.setupRoot.unmount();
      this.setupRoot = null;
    }

    const setupBar = document.getElementById("setup-bar");
    if (setupBar) setupBar.remove();

    this.settingsOpen = false;
  }
}
