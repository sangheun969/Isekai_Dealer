import Phaser from "phaser";
import React from "react";
import ReactDOM from "react-dom/client";
import SetUpBar from "../components/templates/SetUpBar";

export default class Scenes extends Phaser.Scene {
  private settingsOpen = false;
  private setupRoot: ReactDOM.Root | null = null;

  constructor() {
    super({ key: "Scenes" });
  }

  preload() {
    this.load.image("background", "/images/background/storeBg3.png");
    // this.load.audio("backgroundMusic", "/audios/Isekai_1.mp3");
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const background = this.add.image(width / 2, height / 2, "background");
    background.setDisplaySize(width, height);

    const menuText = this.add
      .text(width / 2, height / 2 - 50, "시작", {
        fontSize: "32px",
        padding: { top: 10, bottom: 10 },
      })
      .setOrigin(0.5)
      .setInteractive();

    menuText.on("pointerdown", () => {
      this.scene.start("SavePage");
    });

    const settingsButton = this.add
      .text(width / 2, height / 2 + 70, "설정", {
        fontSize: "32px",
        color: "#fff",
        padding: { top: 10, bottom: 10 },
      })
      .setOrigin(0.5)
      .setInteractive()
      .setDepth(10);

    settingsButton.on("pointerdown", () => {
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
