import Phaser from "phaser";
import itemInfo from "../organisms/itemInfo";

class ItemStatus extends Phaser.GameObjects.Container {
  private background?: Phaser.GameObjects.Graphics;
  private itemImage?: Phaser.GameObjects.Image;
  private itemNameText?: Phaser.GameObjects.Text;
  private itemDescriptionText?: Phaser.GameObjects.Text;
  private itemRarityText?: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    itemId: number // 🔹 imagePath 대신 id를 받아옴
  ) {
    super(scene, x, y);

    // 🔹 아이템 정보를 itemInfo에서 가져오기
    const item = itemInfo.find((i) => i.id === itemId);
    if (!item) {
      console.error(`아이템 정보를 찾을 수 없습니다. ID: ${itemId}`);
      return;
    }

    // 🔹 배경 패널
    this.background = scene.add.graphics();
    this.background.fillStyle(0x222222, 0.8);
    this.background.fillRoundedRect(-150, -100, 300, 500, 10);
    this.add(this.background);

    // 🔹 아이템 이미지 (id를 키로 사용하여 불러오기)
    this.itemImage = scene.add
      .image(0, -50, `item${item.id}`)
      .setScale(0.4)
      .setDepth(10);
    this.add(this.itemImage);

    // 🔹 아이템 이름
    this.itemNameText = scene.add
      .text(0, -10, item.name, {
        fontSize: "18px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);
    this.add(this.itemNameText);

    // 🔹 아이템 설명
    this.itemDescriptionText = scene.add
      .text(0, 20, item.text, {
        fontSize: "14px",
        color: "#cccccc",
        wordWrap: { width: 250 },
        align: "center",
      })
      .setOrigin(0.5);
    this.add(this.itemDescriptionText);

    // 🔹 희귀도 텍스트
    this.itemRarityText = scene.add
      .text(0, 70, `희귀도: ${item.rarity}`, {
        fontSize: "16px",
        color: "#ffcc00",
        align: "center",
      })
      .setOrigin(0.5);
    this.add(this.itemRarityText);

    // 🔹 씬에 추가
    scene.add.existing(this);
  }

  close() {
    this.destroy();
  }
}

export default ItemStatus;
