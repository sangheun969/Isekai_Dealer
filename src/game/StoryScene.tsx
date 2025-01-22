import Phaser from "phaser";
import storyData from "../components/templates/storyData";

export default class StoryScene extends Phaser.Scene {
  private selectedCharacter: string | null = null;
  private storyTextIndex = 0;
  private storyData = storyData;
  private currentCharacterImage: Phaser.GameObjects.Image | null = null;

  constructor() {
    super({ key: "StoryScene" });
  }

  preload() {
    this.load.image("pawnShopBackground", "/images/background/pawnShop1.png");
    this.load.image("nextBtn1", "/images/background/nextBtn1.png");
    this.load.image("frontmen1", "/images/npc/frontmen1.png");
    this.load.image("gauntletItem", "/images/items/gauntleItem.png");
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.add
      .image(width / 2, height / 2, "pawnShopBackground")
      .setDisplaySize(width, height)
      .setDepth(0);

    const dialogueBox = this.add.graphics();
    const boxWidth = width * 0.8;
    const boxHeight = 150;
    const boxX = width / 2 - boxWidth / 2;
    const boxY = height - 200;

    dialogueBox
      .fillStyle(0xffffff, 0.7) // 흰색(#ffffff)과 투명도 0.7
      .fillRoundedRect(boxX, boxY, boxWidth, boxHeight, 10)
      .setDepth(10);

    this.displayStoryText(this.storyTextIndex);

    const rightBtn = this.add
      .image(boxX + boxWidth - 30, boxY + boxHeight / 2, "nextBtn1")
      .setOrigin(0.5)
      .setInteractive()
      .setScale(0.1)
      .setAlpha(0.7);

    this.tweens.add({
      targets: rightBtn,
      y: { value: rightBtn.y - 10, ease: "Sine.easeInOut", yoyo: true },
      duration: 500,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    rightBtn.on("pointerdown", () => {
      this.advanceStory();
    });

    this.input?.keyboard?.on("keydown-SPACE", () => {
      this.advanceStory();
    });
  }

  /**
   * 현재 인덱스의 스토리 텍스트를 화면에 표시합니다.
   */
  displayStoryText(index: number) {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const story = this.storyData[index];
    if (!story) return;

    const textColor = story.id === 1 ? "#000000" : "#064d06";

    this.children.list
      .filter((child) => child.type === "Text")
      .forEach((textObj) => textObj.destroy());

    const dialogueText = this.add.text(width / 2, height - 125, story.text, {
      fontSize: "24px",
      color: textColor,
      wordWrap: { width: width * 0.8 },
      align: "center",
      padding: { top: 10, bottom: 10 },
    });

    dialogueText.setOrigin(0.5).setDepth(11);

    if (story.image) {
      this.showCharacterImage(story.image);
    } else if (this.currentCharacterImage) {
      this.currentCharacterImage.destroy();
      this.currentCharacterImage = null;
    }
  }

  /**
   * 다음 스토리 텍스트로 이동합니다.
   */
  advanceStory() {
    this.storyTextIndex = (this.storyTextIndex + 1) % this.storyData.length;
    this.displayStoryText(this.storyTextIndex);
  }

  /**
   * 캐릭터 이미지를 화면에 표시합니다.
   */
  showCharacterImage(imageKey: string) {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // if (this.currentCharacterImage) {
    //   this.currentCharacterImage.destroy();
    // }

    const characterImage = this.add.image(width / 2, height / 2, imageKey);
    characterImage.setAlpha(0).setDepth(1).setScale(0.7);
    characterImage.y += 20;

    this.tweens.add({
      targets: characterImage,
      alpha: 1,
      duration: 1000,
      ease: "Sine.easeInOut",
    });

    this.currentCharacterImage = characterImage;
  }
}
