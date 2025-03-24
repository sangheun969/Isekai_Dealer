"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phaser_1 = __importDefault(require("phaser"));
const itemInfo_1 = __importDefault(require("../organisms/itemInfo"));
class ItemStatus extends phaser_1.default.GameObjects.Container {
    background;
    itemImage;
    itemNameText;
    itemDescriptionText;
    itemRarityText;
    constructor(scene, x, y, itemId) {
        super(scene, x, y);
        const item = itemInfo_1.default.find((i) => i.id === itemId);
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
exports.default = ItemStatus;
