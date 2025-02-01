import Phaser from "phaser";
import storyData from "../components/templates/storyData";

export default class StoryScene extends Phaser.Scene {
  private selectedCharacter: string | null = null;
  private storyTextIndex = 0;
  private storyData = storyData;
  private currentCharacterImage: Phaser.GameObjects.Image | null = null;
  private dialogueTextBelow: Phaser.GameObjects.Text | null = null;
  constructor() {
    super({ key: "StoryScene" });
  }

  preload() {
    this.load.image("pawnShopBackground2", "/images/background/storeBg4.png");
    this.load.image("frontmen3", "/images/npc/frontmen3.png");
    // this.load.image("gauntletItem", "/images/items/gauntleItem.png");
    this.load.image("speechBubble2", "/images/background/speechBubble2.png");
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    this.add
      .image(width / 2, height / 2, "pawnShopBackground2")
      .setDisplaySize(width, height)
      .setDepth(0);

    const speechBubble = this.add
      .image(width / 4, height / 3.5, "speechBubble2")
      .setScale(0.5)
      .setDepth(10);

    this.displayStoryText(this.storyTextIndex, speechBubble);
  }

  displayStoryText(index: number, speechBubble: Phaser.GameObjects.Image) {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const story = this.storyData[index];
    if (!story) return;

    const textColor = story.id === 1 ? "#000000" : "#064d06";

    // 기존 텍스트 제거
    this.children.list
      .filter((child) => child.type === "Text")
      .forEach((textObj) => textObj.destroy());

    if (story.id === 2) {
      const dialogueText = this.add.text(
        speechBubble.x,
        speechBubble.y - speechBubble.displayHeight * 0.1,
        story.text,
        {
          fontSize: "24px",
          color: textColor,
          wordWrap: { width: speechBubble.displayWidth * 0.8 },
          align: "center",
          padding: { top: 10, bottom: 10 },
        }
      );
      dialogueText.setOrigin(0.5).setDepth(11);
    }

    // 'id:1'의 경우 말풍선 바로 아래에 대사 표시
    if (story.id === 1) {
      const dialogueBox = this.add.graphics();
      const boxWidth = width * 0.25; // 박스 너비
      const boxHeight = 120; // 박스 높이
      const boxX = width / 5 - boxWidth / 4; // 박스 X 위치
      const boxY = speechBubble.y + speechBubble.displayHeight * 0.5; // 박스 Y 위치

      // 박스 배경 그리기
      dialogueBox.fillStyle(0xffffff, 1); // 배경 색상 (흰색)
      dialogueBox.fillRoundedRect(boxX, boxY, boxWidth, boxHeight, 20); // 둥근 모서리

      // 박스에 텍스트 추가
      this.dialogueTextBelow = this.add.text(
        width / 4,
        boxY + boxHeight / 2,
        story.text,
        {
          fontSize: "18px",
          color: textColor,
          wordWrap: { width: boxWidth * 0.8 },
          align: "center",
          padding: { top: 10, bottom: 10 },
        }
      );
      this.dialogueTextBelow.setOrigin(0.5).setDepth(12);
      dialogueBox.setInteractive(
        new Phaser.Geom.Rectangle(boxX, boxY, boxWidth, boxHeight),
        Phaser.Geom.Rectangle.Contains
      );
      // 박스를 클릭 가능하도록 설정
      dialogueBox.setInteractive();
      dialogueBox.on("pointerdown", () => {
        this.advanceStory();
        this.displayStoryText(this.storyTextIndex, speechBubble);
      });
    }

    // 캐릭터 이미지 표시
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
    const speechBubble = this.children.list.find(
      (child) =>
        (child as Phaser.GameObjects.Image).texture?.key === "speechBubble2"
    );
    if (speechBubble) {
      this.displayStoryText(
        this.storyTextIndex,
        speechBubble as Phaser.GameObjects.Image
      );
    }
  }

  showCharacterImage(imageKey: string) {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const characterImage = this.add.image(width / 2, height / 2.25, imageKey);
    characterImage.setAlpha(0).setDepth(1).setScale(0.4);
    characterImage.y += 10;

    this.tweens.add({
      targets: characterImage,
      alpha: 1,
      duration: 1000,
      ease: "Sine.easeInOut",
    });

    this.currentCharacterImage = characterImage;
  }
}
