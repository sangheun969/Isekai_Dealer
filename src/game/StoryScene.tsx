import Phaser from "phaser";
import storyData from "../components/templates/storyData";
import storyData2 from "../components/templates/storyData2";

export default class StoryScene extends Phaser.Scene {
  private storyTextIndex = 0;
  private storyData = storyData;
  private storyData2 = storyData2;
  private currentCharacterImage: Phaser.GameObjects.Image | null = null;
  private dialogueTextBelow: Phaser.GameObjects.Text | null = null;
  private dialogueBox: Phaser.GameObjects.Graphics | null = null;
  private speechBubble: Phaser.GameObjects.Image | null = null;

  constructor() {
    super({ key: "StoryScene" });
  }

  preload() {
    this.load.image("pawnShopBackground2", "/images/background/storeBg6.png");
    this.load.image("table1", "/images/background/table1.png");
    this.load.image("frontmen3", "/images/npc/frontmen3.png");
    this.load.image("speechBubble4", "/images/background/speechBubble4.png");
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.add
      .image(width / 2, height / 2, "pawnShopBackground2")
      .setDisplaySize(width, height)
      .setDepth(0);

    const table = this.add
      .image(width / 2, height, "table1")
      .setDisplaySize(width, height)
      .setDepth(2);

    const speechBubble = this.add
      .image(width / 4.5, height / 3.5, "speechBubble4")
      .setScale(0.8)
      .setDepth(10)
      .setAlpha(0);

    this.displayStoryText(this.storyTextIndex, speechBubble);
  }

  displayStoryText(index: number, speechBubble: Phaser.GameObjects.Image) {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    if (index >= this.storyData.length) return;

    const currentStory = this.storyData[index];
    const currentStory2 = this.storyData2[index];
    this.children.each((child) => {
      if (child instanceof Phaser.GameObjects.Text) {
        child.destroy();
      }
    });

    const dialogueTextTop = this.add.text(
      speechBubble.x + 50,
      speechBubble.y - speechBubble.displayHeight * 0.1,
      currentStory.text,
      {
        fontSize: "28px",
        color: "#064d06",
        wordWrap: { width: speechBubble.displayWidth * 0.7 },
        align: "center",
        padding: { top: 10, bottom: 10 },
      }
    );
    dialogueTextTop.setOrigin(0.5).setDepth(11);

    if (currentStory.image) {
      this.showCharacterImage(currentStory.image);
    }

    if (currentStory2) {
      const boxWidth = width * 0.25;
      const boxHeight = 120;
      const boxX = width / 5 - boxWidth / 4;
      const boxY = speechBubble.y + speechBubble.displayHeight * 0.5;
      this.dialogueBox = this.add.graphics();
      this.dialogueBox.fillStyle(0xffffff, 1);
      this.dialogueBox.fillRoundedRect(boxX, boxY, boxWidth, boxHeight, 20);

      if (this.dialogueTextBelow) {
        this.dialogueTextBelow.destroy();
      }

      this.dialogueTextBelow = this.add.text(
        boxX + boxWidth / 2,
        boxY + boxHeight / 2,
        currentStory2.text,
        {
          fontSize: "18px",
          color: "#000000",
          wordWrap: { width: boxWidth * 0.8 },
          align: "center",
          padding: { top: 5, bottom: 5 },
        }
      );
      this.dialogueTextBelow.setOrigin(0.5).setDepth(12);

      this.dialogueBox.setInteractive(
        new Phaser.Geom.Rectangle(boxX, boxY, boxWidth, boxHeight),
        Phaser.Geom.Rectangle.Contains
      );

      this.dialogueBox.on("pointerdown", () => {
        this.advanceStory(speechBubble);
      });
    }
  }

  advanceStory(speechBubble: Phaser.GameObjects.Image) {
    this.storyTextIndex++;

    if (this.storyTextIndex >= this.storyData.length) {
      this.storyTextIndex = 0;
    }

    this.displayStoryText(this.storyTextIndex, speechBubble);
  }

  showCharacterImage(imageKey: string | null) {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    if (imageKey === null) {
      if (this.currentCharacterImage) {
        this.tweens.add({
          targets: this.currentCharacterImage,
          alpha: 0,
          duration: 500,
          ease: "Sine.easeInOut",
        });
      }
      if (this.speechBubble) {
        this.speechBubble.setAlpha(0);
      }

      return;
    }
    if (
      this.currentCharacterImage &&
      this.currentCharacterImage.texture.key === imageKey
    ) {
      this.tweens.add({
        targets: this.currentCharacterImage,
        alpha: 1,
        duration: 500,
        ease: "Sine.easeInOut",
      });

      // speechBubble 보이기
      if (this.speechBubble) {
        this.speechBubble.setAlpha(1);
      }

      return;
    } else if (this.currentCharacterImage) {
      this.currentCharacterImage.destroy();
    }

    this.currentCharacterImage = this.add.image(
      width / 2,
      height / 1.8,
      imageKey
    );
    this.currentCharacterImage.setAlpha(0).setDepth(1).setScale(0.6);
    this.currentCharacterImage.y += 10;

    this.tweens.add({
      targets: this.currentCharacterImage,
      alpha: 1,
      duration: 1000,
      ease: "Sine.easeInOut",
    });
    if (!this.speechBubble) {
      this.speechBubble = this.add
        .image(width / 4, height / 3.5, "speechBubble4")
        .setScale(0.8)
        .setDepth(10)
        .setAlpha(0);
    }

    // speechBubble 보이기
    this.speechBubble.setAlpha(1);
  }
}
