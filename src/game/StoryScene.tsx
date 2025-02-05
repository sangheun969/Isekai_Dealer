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
  private speechBubble2: Phaser.GameObjects.Image | null = null;
  private characterNameText: Phaser.GameObjects.Text | null = null;
  private gauntletItemImage: Phaser.GameObjects.Image | null = null;
  private gameObject: Phaser.GameObjects.Image | null = null;
  private background?: Phaser.GameObjects.Sprite;

  constructor() {
    super({ key: "StoryScene" });
  }

  preload() {
    this.load.image("pawnShopBackground2", "/images/background/storeBg6.png");
    this.load.image("pawnShopBackground3", "images/background/storeBg8.png");
    this.load.image("table1", "/images/background/table1.png");
    this.load.image("frontmen3", "/images/npc/frontmen3.png");
    this.load.image("speechBubble", "/images/background/speechBubble5.png");
    this.load.image("speechBubble2", "/images/background/speechBubble6.png");
    this.load.image("gauntletItem", "images/items/gauntletItem1.png");
  }

  create() {
    const { width, height } = this.scale;

    this.background = this.add
      .sprite(0, 0, "pawnShopBackground2")
      .setDisplaySize(width, height)
      .setOrigin(0, 0);

    this.add
      .image(width / 2, height, "table1")
      .setDisplaySize(width, height)
      .setDepth(2)
      .setOrigin(0.5, 0.5);

    if (this.textures.exists("gauntletItem")) {
      this.gauntletItemImage = this.add
        .image(width / 2, height / 1.2, "gauntletItem")
        .setDisplaySize(300, 300)
        .setDepth(3)
        .setOrigin(0.5, 0.5)
        .setAlpha(0);
    }

    this.speechBubble = this.add
      .image(width / 4.5, height / 3, "speechBubble")
      .setScale(0.7)
      .setDepth(3)
      .setAlpha(0);

    this.speechBubble2 = this.add
      .image(width / 7, height / 7.5, "speechBubble2")
      .setScale(0.2)
      .setDepth(3)
      .setAlpha(0);

    this.gameObject = this.add
      .image(width, height, "exampleImage")
      .setDepth(12)
      .setAlpha(0);

    this.displayStoryText(this.storyTextIndex, this.speechBubble);
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
      speechBubble.x + 20,
      speechBubble.y - speechBubble.displayHeight * 0.1,
      currentStory.text || "",
      {
        fontFamily: "GowunDodum",
        fontSize: "28px",
        color: "#ffffff",
        wordWrap: { width: speechBubble.displayWidth * 0.7 },
        align: "center",
        padding: { top: 10, bottom: 10 },
      }
    );
    dialogueTextTop.setOrigin(0.5).setDepth(11);

    if (currentStory.item === "gauntletItem") {
      if (this.gauntletItemImage) {
        this.gauntletItemImage.setAlpha(1);
      }
    } else {
      if (this.gauntletItemImage) {
        this.gauntletItemImage.setAlpha(0);
      }
    }

    // 캐릭터 이미지 표시
    if (currentStory.image) {
      this.showCharacterImage(currentStory.image);
      if (currentStory.image === "frontmen3") {
        this.speechBubble2?.setAlpha(1);
        if (currentStory.name) {
          if (this.characterNameText) {
            this.characterNameText.destroy();
          }
          this.characterNameText = this.add
            .text(
              this.speechBubble2!.x,
              this.speechBubble2!.y - this.speechBubble2!.displayHeight * 0.01,
              currentStory.name,
              {
                fontFamily: "GowunDodum",
                fontSize: "20px",
                color: "#000000",
                fontStyle: "bold",
                align: "center",
                padding: { top: 10, bottom: 10 },
              }
            )
            .setOrigin(0.5)
            .setDepth(12);
        } else if (this.characterNameText) {
          // `name`이 null일 경우 텍스트 제거
          this.characterNameText.destroy();
          this.characterNameText = null;
        }
      } else {
        this.speechBubble2?.setAlpha(0);
      }
    }

    if (currentStory2) {
      const boxWidth = width * 0.25;
      const boxHeight = 90;
      const boxX = width / 7 - boxWidth / 4;
      const boxY = speechBubble.y + speechBubble.displayHeight * 0.3;

      this.dialogueBox = this.add.graphics();
      this.dialogueBox.fillStyle(0xffffff, 1);
      this.dialogueBox.fillRoundedRect(
        boxX - 2,
        boxY - 2,
        boxWidth + 4,
        boxHeight,
        15
      );

      if (this.dialogueTextBelow) {
        this.dialogueTextBelow.destroy();
      }

      this.dialogueTextBelow = this.add.text(
        boxX + boxWidth / 2,
        boxY + boxHeight / 2,
        currentStory2.text,
        {
          fontFamily: "GowunDodum",
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

      this.dialogueBox.on("pointerover", () => {
        this.dialogueBox?.clear();
        this.dialogueBox?.fillStyle(0xffcccc, 1);
        this.dialogueBox?.fillRoundedRect(
          boxX - 2,
          boxY - 2,
          boxWidth + 4,
          boxHeight,
          15
        );
      });

      this.dialogueBox.on("pointerout", () => {
        this.dialogueBox?.clear();
        this.dialogueBox?.fillStyle(0xffffff, 1);
        this.dialogueBox?.fillRoundedRect(
          boxX - 2,
          boxY - 2,
          boxWidth + 4,
          boxHeight,
          15
        );
      });

      this.dialogueBox.on("pointerdown", () => {
        this.advanceStory(speechBubble);
      });
    }
  }
  changeBackground(newBackgroundKey: string) {
    if (this.background) {
      this.background.setTexture(newBackgroundKey);
    }
  }

  advanceStory(speechBubble: Phaser.GameObjects.Image) {
    const currentStory = this.storyData[this.storyTextIndex];
    if (currentStory.effect === "흰화면") {
      this.addWhiteScreenEffect();
      this.changeBackground("pawnShopBackground3");
    } else if (currentStory.effect === null) {
      this.gameObject?.setAlpha(0);
    } else {
    }

    if (!currentStory.image && !currentStory.text) {
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
      if (this.speechBubble2) {
        this.speechBubble2.setAlpha(0);
      }
      if (this.characterNameText) {
        this.characterNameText.setAlpha(0);
      }
    }

    this.storyTextIndex++;

    if (this.storyTextIndex >= this.storyData.length) {
      this.storyTextIndex = 0;
    }

    this.displayStoryText(this.storyTextIndex, speechBubble);
  }

  addWhiteScreenEffect() {
    const whiteScreen = this.add.graphics();
    whiteScreen.fillStyle(0xffffff, 1);
    whiteScreen.fillRect(0, 0, this.scale.width, this.scale.height);
    whiteScreen.setAlpha(0);

    this.tweens.add({
      targets: whiteScreen,
      alpha: 1,
      duration: 700,
      ease: "Sine.easeInOut",
      yoyo: true,
      onComplete: () => {
        whiteScreen.destroy();
      },
    });
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
        .image(width / 4, height / 3.5, "speechBubble")
        .setScale(0.8)
        .setDepth(10)
        .setAlpha(0);
    }

    this.speechBubble.setAlpha(1);
  }
}
