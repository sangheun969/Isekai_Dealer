import Phaser from "phaser";

export default class StoryScene extends Phaser.Scene {
  private selectedCharacter: string | null = null;

  constructor() {
    super({ key: "StoryScene" });
  }

  preload() {
    this.load.image("dialogueBox2", "/images/background/dialogueBox2.png");
    this.load.image("pawnShopBackground", "/images/background/pawnShop1.png");
    this.load.image("rightBtn1", "/images/background/rightBtn1.png");
    this.load.image("leftBtn1", "/images/background/leftBtn1.png");
  }
  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const storyText1 = "따문한 하루다";
    const storyText2 = "아아아아앙";

    this.add
      .image(width / 2, height / 2, "pawnShopBackground")
      .setDisplaySize(width, height);

    const dialogueBox = this.add
      .image(width / 2, height - 150, "dialogueBox2")
      .setOrigin(0.5)
      .setScale(1);

    const dialogueText = this.add
      .text(width / 2, dialogueBox.y, "", {
        // 처음엔 빈 문자열로 설정
        fontSize: "24px",
        color: "#121010",
        wordWrap: { width: dialogueBox.displayWidth - 30 },
        align: "center",
        padding: { top: 10, bottom: 10 },
      })
      .setOrigin(0.5);

    let currentCharIndex = 0;
    const typingSpeed = 100;

    const typeText = () => {
      if (currentCharIndex < storyText1.length) {
        dialogueText.setText(storyText1.substring(0, currentCharIndex + 1)); // 현재까지의 글자만 설정
        currentCharIndex++;
        this.time.delayedCall(typingSpeed, typeText); // 일정 시간 후에 재귀 호출
      }
    };

    this.time.delayedCall(1000, typeText);

    this.time.delayedCall(1000, () => {
      dialogueBox.setAlpha(0.7);
      dialogueText.setAlpha(1);
    });
    const rightBtn = this.add
      .image(
        dialogueBox.x + dialogueBox.displayWidth / 3,
        dialogueBox.y,
        "rightBtn1"
      )
      .setOrigin(0.5)
      .setInteractive()
      .setScale(0.1)
      .setAlpha(0)
      .setAlpha(0.7);

    rightBtn.on("pointerdown", () => {
      console.log("오른쪽 버튼 클릭됨!");
    });

    const leftBtn = this.add
      .image(
        dialogueBox.x - dialogueBox.displayWidth / 3,
        dialogueBox.y,
        "leftBtn1"
      )
      .setOrigin(0.5)
      .setInteractive()
      .setScale(0.1)
      .setAlpha(0)
      .setAlpha(0.7);

    leftBtn.on("pointerdown", () => {
      console.log("왼쪽 버튼 클릭됨!");
    });
  }

  handleCharacterSelect(character: string) {
    this.selectedCharacter = character;
    console.log("Selected Character:", this.selectedCharacter);
    this.scene.start("StoryScene");
  }
}
