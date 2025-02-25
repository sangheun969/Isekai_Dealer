import Phaser from "phaser";
import React from "react";
import ReactDOM from "react-dom/client";
import SetUpBar from "../components/templates/SetUpBar";
import { loadGameProgress } from "../backend/gameDataService";

export default class Scenes extends Phaser.Scene {
  private settingsOpen = false;
  private setupRoot: ReactDOM.Root | null = null;

  constructor() {
    super({ key: "Scenes" });
  }

  preload() {
    this.load.image("background", "/images/background/storeBg3.png");
    this.load.audio("buttonClick", "/audios/Button1.mp3");
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const background = this.add.image(width / 2, height / 2, "background");
    background.setDisplaySize(width, height);

    // 🔥 효과음 추가 후 registry에 저장
    const buttonClickSound = this.sound.add("buttonClick", { volume: 0.5 });
    this.registry.set("buttonClick", buttonClickSound);

    const startButton = this.add
      .text(width / 2, height / 2 - 50, "시작", {
        fontSize: "32px",
        color: "#fff",
        backgroundColor: "#333",
        padding: { top: 10, bottom: 10 },
      })
      .setOrigin(0.5)
      .setInteractive();

    const settingsButton = this.add
      .text(width / 2, height / 2 + 70, "설정", {
        fontSize: "32px",
        color: "#fff",
        backgroundColor: "#333",
        padding: { top: 10, bottom: 10 },
      })
      .setOrigin(0.5)
      .setInteractive()
      .setDepth(10);

    const loadButton = this.add
      .text(width / 2, height / 2 + 90, "불러오기", {
        fontSize: "32px",
        color: "#fff",
        backgroundColor: "#333",
        padding: { top: 10, bottom: 10 },
      })
      .setOrigin(0.5)
      .setInteractive()
      .setDepth(10)
      .on("pointerdown", async () => {
        const savedData = await loadGameProgress();
        if (savedData) {
          console.log("불러온 데이터:", savedData);
          this.scene.start("CharacterSelect", { data: savedData });
        } else {
          console.log("저장된 데이터가 없습니다.");
        }
      });

    startButton.on("pointerover", () => {
      startButton.setStyle({ color: "#ffcc00" });
    });

    startButton.on("pointerout", () => {
      startButton.setStyle({ color: "#fff" });
    });

    startButton.on("pointerdown", () => {
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

      this.scene.start("SavePage");
    });

    settingsButton.on("pointerover", () => {
      settingsButton.setStyle({ color: "#ffcc00" });
    });

    settingsButton.on("pointerout", () => {
      settingsButton.setStyle({ color: "#fff" });
    });

    settingsButton.on("pointerdown", () => {
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
