import Phaser from "phaser";

export default class Scenes extends Phaser.Scene {
  constructor() {
    super({ key: "Scenes" });
  }

  preload() {
    this.load.image("background", "/images/background/storeBg3.png");
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const background = this.add.image(width / 2, height / 2, "background");

    background.setDisplaySize(width, height);

    const menuText = this.add
      .text(400, 100, "start", {
        fontSize: "32px",
        // fill: "#fff",
      })
      .setOrigin(0.5);
    const textBounds = menuText.getBounds();
    const textHeight = textBounds.height;
    menuText.setY(100 - textHeight / 2);
    menuText.setInteractive();
    menuText.on("pointerover", () => {
      menuText.setStyle({ fill: "#e07c20" });
    });

    menuText.on("pointerout", () => {
      menuText.setStyle({ fill: "#fff" });
    });

    menuText.on("pointerdown", () => {
      this.scene.start("SavePage");
    });
  }
}
