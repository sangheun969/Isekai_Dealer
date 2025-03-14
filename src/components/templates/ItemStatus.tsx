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

    const item = itemInfo.find((i) => i.id === itemId);
    if (!item) {
      console.error(`아이템 정보를 찾을 수 없습니다. ID: ${itemId}`);
      return;
    }

    const offsetX = -200;

    this.background = scene.add.image(offsetX, 0, "statsImg2");
    this.background.setDisplaySize(550, 850);
    this.add(this.background);

    this.itemImage = scene.add
      .image(offsetX, -180, `item${item.id}`)
      .setScale(0.5)
      .setDepth(10);

    this.add(this.itemImage);

    this.itemNameText = scene.add
      .text(offsetX, 10, item.name, {
        fontSize: "32px",
        color: "#070606",
        align: "center",
      })
      .setOrigin(0.5)
      .setPadding(0, 15, 0, 15);
    this.add(this.itemNameText);

    this.itemDescriptionText = scene.add
      .text(offsetX, 160, item.text, {
        fontSize: "24px",
        color: "#252525",
        wordWrap: { width: 250 },
        align: "center",
      })
      .setOrigin(0.5)
      .setPadding(0, 15, 0, 15);
    this.add(this.itemDescriptionText);

    this.itemRarityText = scene.add
      .text(offsetX, 50, `희귀도: ${item.rarity}`, {
        fontSize: "24px",
        color: "#8a5301",
        align: "center",
      })
      .setOrigin(0.5)
      .setPadding(0, 15, 0, 15);
    this.add(this.itemRarityText);

    scene.add.existing(this);
  }

  close() {
    this.destroy();
  }
}

export default ItemStatus;
