import Phaser from "phaser";

export default class StoryScene extends Phaser.Scene {
  private selectedCharacter: string | null = null;
  private storyTextIndex = 0;
  private currentCharacterImage: Phaser.GameObjects.Image | null = null;

  private storyData = [
    {
      text: "늦은 밤, 도시 한구석에 자리한 작은 전당포. 'XX 전당포'라는 낡은 간판이 희미한 빛을 발하고 있다.",
      image: null,
    },
    {
      text: "주인공은 마감 준비를 하며 오늘 들어온 물건들을 정리하고 있다. 그때 문이 열리고 한 남자가 들어온다.",
      image: null,
    },
    {
      text: "(고개를 들며) '늦은 시간에 웬일이세요? 오늘은 마감이라 물건은 더 못 받는데'",
      image: "frontmen1",
    },
    {
      text: "(문을 닫고 안으로 들어오며) '시간이 늦어서 죄송합니다. 하지만 꼭 팔아야 할 물건이 있어서요.'",
      image: "frontmen1",
    },
  ];

  constructor() {
    super({ key: "StoryScene" });
  }

  preload() {
    this.load.image("pawnShopBackground", "/images/background/pawnShop1.png");
    this.load.image("nextBtn1", "/images/background/nextBtn1.png");
    this.load.image("frontmen1", "/images/npc/frontmen1.png"); // npc 이미지 추가
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.add
      .image(width / 2, height / 2, "pawnShopBackground")
      .setDisplaySize(width, height)
      .setDepth(0);

    const dialogueBox = this.add.graphics();
    const boxWidth = width * 0.8; // 박스 너비
    const boxHeight = 150; // 박스 높이
    const boxX = width / 2 - boxWidth / 2; // 박스 X 위치
    const boxY = height - 200; // 박스 Y 위치

    dialogueBox.fillStyle(0xffffff, 0.7); // 흰색(#ffffff)과 투명도 0.7
    dialogueBox.fillRoundedRect(boxX, boxY, boxWidth, boxHeight, 10);

    const dialogueText = this.add
      .text(width / 2, boxY + boxHeight / 2, "", {
        fontSize: "24px",
        color: "#121010",
        wordWrap: { width: boxWidth - 30 },
        align: "center",
        padding: { top: 10, bottom: 10 },
      })
      .setOrigin(0.5);

    // 처음에 첫 번째 대사부터 타이핑 시작
    let currentCharIndex = 0;
    const typingSpeed = 100;

    const typeText = () => {
      const currentData = this.storyData[this.storyTextIndex];
      const currentText = currentData.text;

      if (currentCharIndex < currentText.length) {
        dialogueText.setText(currentText.substring(0, currentCharIndex + 1));
        currentCharIndex++;
        this.time.delayedCall(typingSpeed, typeText);
      }
    };

    this.time.delayedCall(1000, typeText);

    const rightBtn = this.add
      .image(boxX + boxWidth - 30, boxY + boxHeight / 2, "nextBtn1")
      .setOrigin(0.5)
      .setInteractive()
      .setScale(0.1)
      .setAlpha(0.7);

    this.tweens.add({
      targets: rightBtn,
      y: { value: rightBtn.y - 10, ease: "Sine.easeInOut", yoyo: true }, // 위로 10픽셀 위아래 반복
      duration: 500, // 500ms 동안
      repeat: -1, // 무한 반복
      ease: "Sine.easeInOut", // 부드럽게 움직이는 효과
    });

    // pointerdown 이벤트: 오른쪽 버튼 클릭 시
    rightBtn.on("pointerdown", () => {
      this.advanceStory();
    });

    // keydown 이벤트: 스페이스바 눌렀을 때
    this.input?.keyboard?.on("keydown-SPACE", () => {
      this.advanceStory();
    });
  }

  advanceStory() {
    const currentData = this.storyData[this.storyTextIndex];

    if (currentData.image) {
      this.showCharacterImage(currentData.image);
    }
    this.storyTextIndex = (this.storyTextIndex + 1) % this.storyData.length;
    this.scene.restart();
  }

  showCharacterImage(imageKey: string) {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // 이전에 추가된 이미지가 있으면 지우기
    if (this.currentCharacterImage) {
      this.currentCharacterImage.destroy();
    }

    // 새로운 이미지 추가 (처음에는 투명하게 설정)
    const characterImage = this.add.image(width / 2, height / 2, imageKey);
    characterImage.setAlpha(0); // 이미지의 투명도를 0으로 설정
    characterImage.setDepth(1); // 배경보다 앞에 위치하도록 depth 설정

    // 이미지가 천천히 나타나는 효과를 추가
    this.tweens.add({
      targets: characterImage,
      alpha: 1, // 최종 투명도
      duration: 1000, // 1초 동안 변화
      ease: "Sine.easeInOut", // 부드러운 이징 함수
    });

    // 새로 생성된 이미지 객체를 저장
    this.currentCharacterImage = characterImage;

    // 콘솔 로그로 이미지 위치 확인
    console.log(`Character Image: ${imageKey}`);
    console.log(
      `Image Position: X = ${characterImage.x}, Y = ${characterImage.y}`
    );
  }
}
