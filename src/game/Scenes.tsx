import Phaser from "phaser";
import React from "react";
import ReactDOM from "react-dom/client";
import SetUpBar from "../components/templates/SetUpBar";
import { loadGameProgress, saveGameProgress } from "../utils/apiService";

export default class Scenes extends Phaser.Scene {
  private settingsOpen = false;
  private setupRoot: ReactDOM.Root | null = null;

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
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const background = this.add.image(width / 2, height / 2, "background");
    background.setDisplaySize(width, height);

    const buttonClickSound = this.sound.add("buttonClick", { volume: 0.5 });
    this.registry.set("buttonClick", buttonClickSound);

    const startButton = this.add
      .image(width / 2, height / 2, "playBtn2")
      .setInteractive()
      .setScale(0.3)
      .on("pointerdown", async () => {
        console.log("🆕 새 게임 시작!");

        const newGameData = {
          money: 100000,
          items: [],
        };

        await saveGameProgress(newGameData.money, newGameData.items);
        this.scene.start("StoryScene", { savedData: newGameData });
      })
      .on("pointerover", () => {
        this.tweens.add({
          targets: startButton,
          scale: 0.35,
          duration: 200,
          ease: "Power2",
        });
      })
      .on("pointerout", () => {
        this.tweens.add({
          targets: startButton,
          scale: 0.3,
          duration: 200,
          ease: "Power2",
        });
      });

    const loadButton = this.add
      .image(width / 2, height / 2 + 150, "playBtn3")
      .setInteractive()
      .setScale(0.3)
      .on("pointerdown", async () => {
        console.log("📥 게임 데이터를 불러오는 중...");
        const data = await loadGameProgress();

        if (data) {
          console.log("✅ 불러오기 완료!", data);
          this.scene.start("GameScene", { savedData: data });
        } else {
          console.warn("⚠️ 저장된 데이터가 없습니다!");
        }
      })
      .on("pointerover", () => {
        this.tweens.add({
          targets: loadButton,
          scale: 0.35,
          duration: 200,
          ease: "Power2",
        });
      })
      .on("pointerout", () => {
        this.tweens.add({
          targets: loadButton,
          scale: 0.3,
          duration: 200,
          ease: "Power2",
        });
      });

    const settingsButton = this.add
      .image(width / 2, height / 2 + 300, "playBtn4")
      .setInteractive()
      .setScale(0.3)
      .on("pointerdown", () => {
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
      })
      .on("pointerover", () => {
        this.tweens.add({
          targets: settingsButton,
          scale: 0.35,
          duration: 200,
          ease: "Power2",
        });
      })
      .on("pointerout", () => {
        this.tweens.add({
          targets: settingsButton,
          scale: 0.3,
          duration: 200,
          ease: "Power2",
        });
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
