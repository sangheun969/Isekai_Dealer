import Phaser from "phaser";

export default class StoryScene extends Phaser.Scene {
  private selectedCharacter: string | null = null;

  constructor() {
    super({ key: "StoryScene" });
  }

  preload() {
    this.load.image("pawnShopBackground", "/images/background/pawnShop1.png");
  }
  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.add
      .image(width / 2, height / 2, "pawnShopBackground")
      .setDisplaySize(width, height);

    const dialogueText = this.add
      .text(
        width / 2,
        height - 100,
        "선택한 캐릭터와 함께 가게에 입장합니다!",
        {
          fontSize: "24px",
          color: "#121010",
          wordWrap: { width: width - 20 },
          align: "center",
        }
      )
      .setOrigin(0.5);
  }

  handleCharacterSelect(character: string) {
    this.selectedCharacter = character;
    console.log("Selected Character:", this.selectedCharacter);
    this.scene.start("StoryScene");
  }
}
