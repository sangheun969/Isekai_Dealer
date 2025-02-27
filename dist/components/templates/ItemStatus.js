import Phaser from "phaser";
import itemInfo from "../organisms/itemInfo.js";
class ItemStatus extends Phaser.GameObjects.Container {
    background;
    itemImage;
    itemNameText;
    itemDescriptionText;
    itemRarityText;
    constructor(scene, x, y, itemId) {
        super(scene, x, y);
        const item = itemInfo.find((i) => i.id === itemId);
        if (!item) {
            console.error(`아이템 정보를 찾을 수 없습니다. ID: ${itemId}`);
            return;
        }
        this.background = scene.add.graphics();
        this.background.fillStyle(0x222222, 0.8);
        this.background.fillRoundedRect(-150, -100, 300, 600, 10);
        this.add(this.background);
        this.itemImage = scene.add
            .image(0, -50, `item${item.id}`)
            .setScale(0.4)
            .setDepth(10);
        this.add(this.itemImage);
        this.itemNameText = scene.add
            .text(0, -10, item.name, {
            fontSize: "18px",
            color: "#ffffff",
            align: "center",
        })
            .setOrigin(0.5);
        this.add(this.itemNameText);
        this.itemDescriptionText = scene.add
            .text(0, 20, item.text, {
            fontSize: "14px",
            color: "#cccccc",
            wordWrap: { width: 250 },
            align: "center",
        })
            .setOrigin(0.5);
        this.add(this.itemDescriptionText);
        this.itemRarityText = scene.add
            .text(0, 70, `희귀도: ${item.rarity}`, {
            fontSize: "16px",
            color: "#ffcc00",
            align: "center",
        })
            .setOrigin(0.5);
        this.add(this.itemRarityText);
        scene.add.existing(this);
    }
    close() {
        this.destroy();
    }
}
export default ItemStatus;
