import Phaser from "phaser";
import itemInfo from "../organisms/itemInfo";

class ItemStatus extends Phaser.GameObjects.Container {
  private background?: Phaser.GameObjects.Image;
  private itemImage?: Phaser.GameObjects.Image;
  private itemNameText?: Phaser.GameObjects.Text;
  private itemDescriptionText?: Phaser.GameObjects.Text;
  private itemRarityText?: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number, itemId: number) {
    super(scene, x, y);
    this.setDepth(10);

    const item = itemInfo.find((i) => i.id === itemId);
    if (!item) {
      console.error(`아이템 정보를 찾을 수 없습니다. ID: ${itemId}`);
      return;
    }

    const offsetX = -700;

    this.background = scene.add.image(offsetX, 0, "itemStatusBg");
    const desiredWidth = 1200;
    const originalWidth = this.background.width;
    const originalHeight = this.background.height;
    const scale = desiredWidth / originalWidth;

    this.background.setScale(scale).setDepth(2);
    this.add(this.background);

    this.itemImage = scene.add
      .image(offsetX + 280, 10, `item${item.id}`)
      .setScale(0.8)
      .setDepth(10);

    this.add(this.itemImage);

    this.itemNameText = scene.add
      .text(offsetX - 300, -300, item.name, {
        fontSize: "52px",
        color: "#070606",
        align: "left",
      })
      .setOrigin(0.5)
      .setPadding(0, 15, 0, 15);
    this.add(this.itemNameText);

    this.itemDescriptionText = scene.add
      .text(offsetX - 300, 0, item.text, {
        fontSize: "36px",
        color: "#252525",
        wordWrap: { width: 350 },
        align: "left",
      })
      .setOrigin(0.5)
      .setPadding(0, 15, 0, 15);
    this.add(this.itemDescriptionText);

    this.itemRarityText = scene.add
      .text(offsetX - 300, -250, `희귀도: ${item.rarity}`, {
        fontSize: "32px",
        color: "#8a5301",
        align: "left",
      })
      .setOrigin(0.5)
      .setPadding(0, 15, 0, 15);
    this.add(this.itemRarityText);

    const closeButton = scene.add
      .image(
        offsetX + this.background.displayWidth / 2 - 70,
        -this.background.displayHeight / 2 + 50,
        "closeIcon"
      )
      .setDisplaySize(40, 40)
      .setInteractive({ useHandCursor: true })
      .setDepth(11);

    closeButton.on("pointerdown", () => {
      this.close();
    });

    this.add(closeButton);

    scene.add.existing(this);
  }

  close() {
    this.destroy();
  }
}

export default ItemStatus;
