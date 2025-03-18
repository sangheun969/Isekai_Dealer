import Phaser from "phaser";
import React from "react";
import ReactDOM from "react-dom/client";
import SetUpBar from "../components/templates/SetUpBar";
import { loadGameProgress, saveGameProgress } from "../utils/apiService";

export default class Scenes extends Phaser.Scene {
  private settingsOpen = false;
  private setupRoot: ReactDOM.Root | null = null;
  private background!: Phaser.GameObjects.Image;
  private startButton!: Phaser.GameObjects.Image;
  private loadButton!: Phaser.GameObjects.Image;
  private settingsButton!: Phaser.GameObjects.Image;

  constructor() {
    super({ key: "Scenes" });
  }

  preload() {
    this.load.image("background", "/images/main/mainPage.png");
    this.load.audio("buttonClick", "/audios/Button1.mp3");
    this.load.image("playBtn2", "/images/main/playBtn2.png");
    this.load.image("playBtn3", "/images/main/playBtn3.png");
    this.load.image("playBtn4", "/images/main/playBtn4.png");
  }

  create() {
    this.updateUI();

    this.startButton.on("pointerdown", async () => {
      console.log("🆕 새 게임 시작!");
      const newGameData = { money: 100000, items: [] };
      await saveGameProgress(newGameData.money, newGameData.items);
      this.scene.start("StoryScene", { savedData: newGameData });
    });

    this.loadButton.on("pointerdown", async () => {
      console.log("📥 게임 데이터를 불러오는 중...");
      const data = await loadGameProgress();

      if (data) {
        console.log("✅ 불러오기 완료!", data);
        this.scene.start("GameScene", { savedData: data });
      } else {
        console.warn("⚠️ 저장된 데이터가 없습니다!");
      }
    });

    this.settingsButton.on("pointerdown", () => {
      let effectSound = this.registry.get("buttonClick") as
        | Phaser.Sound.BaseSound
        | undefined;
      if (!effectSound) {
        effectSound = this.sound.add("buttonClick", { volume: 0.5 });
        this.registry.set("buttonClick", effectSound);
      }
      const effectVolume = this.registry.get("effectVolume") as
        | number
        | undefined;
      if (
        effectSound instanceof Phaser.Sound.WebAudioSound &&
        effectVolume !== undefined
      ) {
        effectSound.setVolume(effectVolume);
      }
      effectSound.play();

      if (!this.settingsOpen) {
        this.showSettingsModal();
      }
    });

    this.scale.on("resize", () => {
      this.updateUI();
    });
  }

  updateUI() {
    const width = this.scale.width;
    const height = this.scale.height;

    if (this.background) {
      this.background.setDisplaySize(width, height).setPosition(0, 0);
    } else {
      this.background = this.add
        .image(0, 0, "background")
        .setOrigin(0, 0)
        .setDisplaySize(width, height);
    }

    const buttonScale = width / 1920;

    if (this.startButton) {
      this.startButton
        .setPosition(width * 0.1, height * 0.1)
        .setScale(0.3 * buttonScale);
    } else {
      this.startButton = this.add
        .image(width * 0.1, height * 0.1, "playBtn2")
        .setInteractive()
        .setOrigin(0, 0)
        .setScale(0.3 * buttonScale);
    }

    if (this.loadButton) {
      this.loadButton
        .setPosition(width * 0.1, height * 0.3)
        .setScale(0.3 * buttonScale);
    } else {
      this.loadButton = this.add
        .image(width * 0.1, height * 0.3, "playBtn3")
        .setInteractive()
        .setOrigin(0, 0)
        .setScale(0.3 * buttonScale);
    }

    if (this.settingsButton) {
      this.settingsButton
        .setPosition(width * 0.1, height * 0.5)
        .setScale(0.3 * buttonScale);
    } else {
      this.settingsButton = this.add
        .image(width * 0.1, height * 0.5, "playBtn4")
        .setInteractive()
        .setOrigin(0, 0)
        .setScale(0.3 * buttonScale);
    }

    this.startButton.on("pointerover", () =>
      this.startButton.setScale(0.35 * buttonScale)
    );
    this.startButton.on("pointerout", () =>
      this.startButton.setScale(0.3 * buttonScale)
    );

    this.loadButton.on("pointerover", () =>
      this.loadButton.setScale(0.35 * buttonScale)
    );
    this.loadButton.on("pointerout", () =>
      this.loadButton.setScale(0.3 * buttonScale)
    );

    this.settingsButton.on("pointerover", () =>
      this.settingsButton.setScale(0.35 * buttonScale)
    );
    this.settingsButton.on("pointerout", () =>
      this.settingsButton.setScale(0.3 * buttonScale)
    );
  }

  showSettingsModal() {
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

  closeSettingsModal() {
    if (this.setupRoot) {
      this.setupRoot.unmount();
      this.setupRoot = null;
    }

    const setupBar = document.getElementById("setup-bar");
    if (setupBar) {
      setupBar.remove();
    }

    this.settingsOpen = false;
  }
}
