import Phaser from "phaser";
import storyData from "../components/templates/storyData";
import storyData2 from "../components/templates/storyData2";

export default class StoryScene extends Phaser.Scene {
  private storyTextIndex = 0;
  private storyData = storyData;
  private storyData2 = storyData2;
  private currentCharacterImage: Phaser.GameObjects.Image | null = null;
  private dialogueTextBelow: Phaser.GameObjects.Text | null = null;
  private dialogueBox:
    | Phaser.GameObjects.Graphics
    | Phaser.GameObjects.Image
    | null = null;
  private speechBubble: Phaser.GameObjects.Image | null = null;
  private speechBubble2: Phaser.GameObjects.Image | null = null;
  private characterNameText: Phaser.GameObjects.Text | null = null;
  private gauntletItemImage: Phaser.GameObjects.Image | null = null;
  private gameObject: Phaser.GameObjects.Image | null = null;
  private background: Phaser.GameObjects.Image | null = null;
  private typingTimer?: Phaser.Time.TimerEvent;
  constructor() {
    super({ key: "StoryScene" });
  }

  init(data: { reset?: boolean }) {
    if (data?.reset) {
      this.storyTextIndex = 0;
      this.currentCharacterImage?.destroy();
      this.currentCharacterImage = null;
      this.dialogueTextBelow?.destroy();
      this.dialogueTextBelow = null;
      this.dialogueBox?.destroy();
      this.dialogueBox = null;
      this.characterNameText?.destroy();
      this.characterNameText = null;
      this.gauntletItemImage?.destroy();
      this.gauntletItemImage = null;
      this.gameObject?.destroy();
      this.gameObject = null;
      this.background?.destroy();
      this.background = null;
      this.typingTimer?.remove(false);
    }
  }

  preload() {
    this.load.image("pawnShopBackground2", "/images/background/storeBg1.png");
    this.load.image("pawnShopBackground3", "/images/background/storeBg5.png");
    this.load.image("pawnShopBackground1", "/images/mapBg/shop1.png");
    this.load.image("master", "/images/main/master4.png");
    this.load.image("table1", "/images/background/table1.png");
    this.load.image("frontmen3", "/images/npc/frontmen4.png");
    this.load.image("speechBubble9", "/images/background/speechBubble9.png");
    this.load.image("speechBubble2", "/images/background/speechBubble2.png");
    this.load.image("speechBubble8", "/images/background/speechBubble8.png");

    this.load.image("speechBubble6", "/images/background/speechBubble6.png");
    this.load.image("gauntletItem", "images/items/gauntletItem1.png");
    this.load.audio("buttonClick", "/audios/Button1.mp3");
  }

  create() {
    if (!this.scale) {
      console.warn("🚨 [StoryScene] this.scale가 아직 준비되지 않음!");
      return;
    }

    this.scale.on("resize", () => {
      this.updateUI();
    });
    this.updateUI();

    this.displayStoryText(this.storyTextIndex, this.speechBubble!);
  }

  updateUI() {
    if (
      !this.scale ||
      typeof this.scale.width === "undefined" ||
      typeof this.scale.height === "undefined"
    ) {
      console.warn("🚨 [updateUI] this.scale가 아직 초기화되지 않았습니다!");
      return;
    }
    const width = this.scale.width;
    const height = this.scale.height;
    const scaleFactor = width / 1920;

    if (this.background) {
      this.background.setDisplaySize(width, height);
    } else {
      this.background = this.add
        .sprite(0, 0, "pawnShopBackground2")
        .setOrigin(0, 0)
        .setDisplaySize(width, height);
    }

    this.add
      .image(width / 2, height, "table1")
      .setDisplaySize(width, height)
      .setDepth(2)
      .setOrigin(0.5, 0.5);

    if (this.textures.exists("gauntletItem")) {
      if (!this.gauntletItemImage) {
        this.gauntletItemImage = this.add.image(
          width / 2,
          height / 1.2,
          "gauntletItem"
        );
      }
      this.gauntletItemImage
        .setDisplaySize(300 * scaleFactor, 300 * scaleFactor)
        .setDepth(3)
        .setAlpha(0);
    }

    this.speechBubble = this.add
      .image(width / 5, height / 3 - 40, "speechBubble9")
      .setScale(0.9)
      .setDepth(3)
      .setAlpha(0);

    if (this.speechBubble) {
      this.speechBubble.setDisplaySize(
        this.speechBubble.width * 0.6,
        this.speechBubble.height * 0.4
      );
    }

    this.gameObject = this.add
      .image(width, height, "exampleImage")
      .setDepth(12)
      .setAlpha(0);

    this.displayStoryText(this.storyTextIndex, this.speechBubble);
  }

  displayStoryText(
    index: number,
    speechBubble: Phaser.GameObjects.Image | null
  ) {
    if (!speechBubble) {
      console.warn(
        "🚨 [StoryScene] speechBubble이 존재하지 않아 스토리 텍스트를 표시할 수 없음!"
      );
      return;
    }

    if (!this.cameras || !this.cameras.main) {
      console.warn("🚨 [StoryScene] cameras.main이 초기화되지 않음!");
      return;
    }

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
        fontSize: "32px",
        color: "#ffffff",
        wordWrap: { width: speechBubble.displayWidth * 0.7 },
        align: "left",
        padding: { top: 10, bottom: 10 },
      }
    );
    dialogueTextTop.setOrigin(0.5).setDepth(11);

    if (currentStory.item === "gauntletItem") {
      this.gauntletItemImage?.setAlpha(1);
    } else {
      this.gauntletItemImage?.setAlpha(0);
    }

    if (currentStory.image) {
      this.showCharacterImage(currentStory.image);

      if (currentStory.name) {
        if (this.characterNameText) {
          this.characterNameText.destroy();
        }
        this.characterNameText = this.add
          .text(width / 2, height * 0.2, currentStory.name, {
            fontFamily: "GowunDodum",
            fontSize: "24px",
            color: "#001380",
            fontStyle: "bold",
            align: "center",
          })
          .setOrigin(0.5)
          .setDepth(12);
      } else if (this.characterNameText) {
        this.characterNameText.destroy();
        this.characterNameText = null;
      }
    } else if (this.characterNameText) {
      this.characterNameText.destroy();
      this.characterNameText = null;
    }

    // 하단 텍스트 박스와 대사
    if (currentStory2) {
      const boxX = width / 5;
      const boxY = height / 1.5;

      this.dialogueTextBelow?.destroy();
      this.dialogueBox?.destroy();

      this.dialogueBox = this.add
        .image(boxX, boxY, "speechBubble2")
        .setDepth(3)
        .setAlpha(0.9)
        .setScale(0.6, 0.3)
        .setInteractive({ useHandCursor: true });

      this.dialogueTextBelow = this.add
        .text(boxX, boxY, currentStory2.text, {
          fontFamily: "GowunDodum",
          fontSize: "30px",
          color: "#000000",
          wordWrap: {
            width: this.dialogueBox.displayWidth * 0.9,
          },
          align: "center",
        })
        .setOrigin(0.5)
        .setDepth(15)
        .setAlpha(0.95);

      this.dialogueBox.on("pointerdown", () => {
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
        this.advanceStory(speechBubble);
      });
    }
  }

  changeBackground(newBackgroundKey: string) {
    if (this.background) {
      this.background.setTexture(newBackgroundKey);
      this.background.setDisplaySize(this.scale.width, this.scale.height);
      return;
    }

    this.background = this.add
      .image(0, 0, newBackgroundKey)
      .setOrigin(0, 0)
      .setDisplaySize(this.scale.width, this.scale.height);
  }

  advanceStory(speechBubble: Phaser.GameObjects.Image) {
    if (!speechBubble) {
      console.warn(
        "🚨 [StoryScene] speechBubble이 존재하지 않아 스토리 진행 불가!"
      );
      return;
    }
    const currentStory = this.storyData[this.storyTextIndex];

    if (this.storyTextIndex >= this.storyData.length - 1) {
      this.scene.sleep("StoryScene");
      this.scene.start("GameScene");
      return;
    }
    if (currentStory.effect === "흰화면") {
      this.addWhiteScreenEffect();
      this.changeBackground("pawnShopBackground1");
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
      this.speechBubble?.setAlpha(0);

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
      height / 1.5,
      imageKey
    );
    this.currentCharacterImage.setAlpha(0).setDepth(1).setScale(0.7);
    this.currentCharacterImage.y += 5;

    this.tweens.add({
      targets: this.currentCharacterImage,
      alpha: 1,
      duration: 1000,
      ease: "Sine.easeInOut",
    });
    if (!this.speechBubble) {
      this.speechBubble = this.add
        .image(width / 5, height / 3.5, "speechBubble8")
        .setScale(0.8)
        .setDepth(10)
        .setAlpha(0);
    }

    this.speechBubble.setAlpha(1);
  }
}
