import { jsx as _jsx } from "react/jsx-runtime";
import Phaser from "phaser";
import ItemStatus from "../components/templates/ItemStatus.js";
import itemInfo from "../components/organisms/itemInfo.js";
import SetUpBar from "../components/templates/SetUpBar.js";
import ReactDOM from "react-dom";
import { saveGameProgress } from "../utils/apiService.js";
export default class GameScene extends Phaser.Scene {
    background = null;
    dialogueBox = null;
    speechBubble = null;
    speechBubble2 = null;
    coinIcon = null;
    moneyText = null;
    money = 100000;
    customer = null;
    speechText = null;
    choiceText1 = null;
    choiceText2 = null;
    currentItemStatus = null;
    currentItemKey = null;
    choiceButton1 = null;
    choiceButtonText1 = null;
    choiceButtonGroup = null;
    selectedItemKey = null;
    isSetupBarOpen = false;
    inventory = [];
    constructor() {
        super({ key: "GameScene" });
    }
    init(data) {
        if (data.savedData) {
            console.log("📥 불러온 데이터 적용:", data.savedData);
            this.money = data.savedData.money;
            this.inventory = data.savedData.items;
        }
    }
    preload() {
        this.load.image("pawnShopBackground3", "/images/background/storeBg5.png");
        this.load.image("table2", "/images/background/table2.png");
        this.load.image("list1", "/images/background/list1.png");
        this.load.image("speechBubble", "/images/background/speechBubble5.png");
        this.load.image("speechBubble2", "/images/background/speechBubble6.png");
        this.load.image("coin", "/images/background/myCoin.png");
        this.load.audio("buttonClick", "/audios/Button1.mp3");
        for (let i = 1; i <= 10; i++) {
            this.load.image(`client${i}`, `/images/npc/client${i}.png`);
        }
    }
    create() {
        const { width, height } = this.scale;
        this.choiceButtonGroup = this.add.group();
        const list1 = this.add.image(width * 0.1, height * 0.85, "list1");
        list1.setScale(0.3).setDepth(6).setOrigin(0.5, 0.5);
        this.background = this.add
            .sprite(0, 0, "pawnShopBackground3")
            .setDisplaySize(width, height)
            .setOrigin(0, 0);
        this.add
            .image(width / 2, height, "table2")
            .setDisplaySize(width, height)
            .setDepth(5)
            .setOrigin(0.5, 0.5);
        this.moneyText = this.add
            .text(width - 120, 40, `${this.money.toLocaleString()}`, {
            fontFamily: "Arial",
            fontSize: "28px",
            color: "#ffffff",
            fontStyle: "bold",
        })
            .setDepth(5);
        this.spawnRandomCustomer();
        this.add
            .text(50, 50, `💰 ${this.money.toLocaleString()} 코인`, {
            fontSize: "24px",
            color: "#fff",
        })
            .setDepth(10);
        this.add
            .text(50, 100, "💾 저장", { fontSize: "24px", color: "#fff" })
            .setInteractive()
            .on("pointerdown", async () => {
            await saveGameProgress(this.money, this.inventory);
        });
    }
    openSetupBar() {
        this.isSetupBarOpen = true;
        const modalContainer = document.createElement("div");
        modalContainer.id = "setup-bar-modal";
        document.body.appendChild(modalContainer);
        const closeSetupBar = () => {
            this.isSetupBarOpen = false;
            ReactDOM.unmountComponentAtNode(modalContainer);
            document.body.removeChild(modalContainer);
        };
        ReactDOM.render(_jsx(SetUpBar, { onClose: closeSetupBar, scene: this }), modalContainer);
    }
    spawnRandomCustomer() {
        const { width, height } = this.scale;
        const randomClientNumber = Phaser.Math.Between(1, 9);
        const customerKey = `client${randomClientNumber}`;
        this.customer = this.add.image(width / 2, height, customerKey);
        this.customer.setScale(0.7).setDepth(4).setOrigin(0.5, 1);
        const randomItem = Phaser.Math.RND.pick(itemInfo);
        if (randomItem) {
            const itemKey = `item${randomItem.id}`;
            this.selectedItemKey = itemKey;
            if (!this.textures.exists(itemKey)) {
                console.warn(`이미지가 로드되지 않아 추가 로드: ${randomItem.image}`);
                this.load.image(itemKey, randomItem.image);
            }
            this.load.once("complete", () => {
                if (this.textures.exists(itemKey)) {
                    const item = this.add.image(width / 2, height / 1.2, itemKey);
                    item.setScale(0.6).setDepth(6).setOrigin(0.5, 0.5);
                    item.setInteractive();
                    item.on("pointerover", () => {
                        item.setTint(0xdddddd);
                    });
                    item.on("pointerout", () => {
                        item.clearTint();
                    });
                    item.on("pointerdown", () => {
                        let effectSound = this.registry.get("buttonClick");
                        if (!effectSound) {
                            effectSound = this.sound.add("buttonClick", { volume: 0.5 });
                            this.registry.set("buttonClick", effectSound);
                        }
                        const effectVolume = this.registry.get("effectVolume");
                        if (effectSound instanceof Phaser.Sound.WebAudioSound &&
                            effectVolume !== undefined) {
                            effectSound.setVolume(effectVolume);
                        }
                        effectSound.play();
                        this.toggleItemStatus(randomItem);
                        this.currentItemKey = itemKey;
                    });
                }
                else {
                    console.error(`이미지를 찾을 수 없음: ${itemKey}`);
                }
            });
            this.load.start();
        }
        this.speechBubble = this.add
            .image(width / 4.5, height / 3, "speechBubble")
            .setScale(0.7)
            .setDepth(3)
            .setAlpha(1);
        this.speechText = this.add
            .text(width / 4.5, height / 3 - 50, "안녕하세요. 이 물건을 보여드릴게요", {
            fontFamily: "Arial",
            fontSize: "22px",
            color: "#ffffff",
            wordWrap: { width: this.speechBubble.displayWidth * 0.7 },
            align: "center",
        })
            .setOrigin(0.5)
            .setDepth(7);
        const { buttonGraphics, buttonText } = this.createButton(width / 4, height / 1.8, "어떻게 하고 싶으시죠?", () => {
            if (!this.selectedItemKey) {
                console.warn("선택된 아이템이 없습니다.");
                return;
            }
            const item = itemInfo.find((i) => i.id === Number(this.selectedItemKey?.replace("item", "")));
            if (!item) {
                console.warn(`아이템 정보를 찾을 수 없습니다. (key: ${this.selectedItemKey})`);
                return;
            }
            console.log(`아이템 정보: ${item.name}, ${item.text}, 희귀도: ${item.rarity}`);
            let minPercentage = 0.05;
            let maxPercentage = 0.1;
            switch (item.rarity) {
                case "일반":
                    maxPercentage = 0.05;
                    break;
                case "희귀":
                    minPercentage = 0.05;
                    maxPercentage = 0.15;
                    break;
                case "전설":
                    minPercentage = 0.15;
                    maxPercentage = 0.25;
                    break;
                case "신화":
                    minPercentage = 0.25;
                    maxPercentage = 0.4;
                    break;
            }
            const minPrice = Math.floor(this.money * minPercentage);
            const maxPrice = Math.floor(this.money * maxPercentage);
            const suggestedPrice = Math.floor(Phaser.Math.Between(minPrice, maxPrice) / 100) * 100;
            if (this.speechText) {
                this.speechText.setText(`${suggestedPrice.toLocaleString()}코인에 팔고 싶습니다`);
            }
            this.choiceButtonGroup?.clear(true, true);
            this.updateSpeechAndButtons();
        });
        this.choiceButtonGroup?.add(buttonGraphics);
        this.choiceButtonGroup?.add(buttonText);
        const { buttonGraphics: cancelButton, buttonText: cancelText } = this.createButton(width / 4, height / 1.6, "관심 없어요", () => {
            console.log("관심 없어요 선택");
        });
        this.choiceButtonGroup?.add(cancelButton);
        this.choiceButtonGroup?.add(cancelText);
    }
    updateSpeechAndButtons() {
        const { width, height } = this.scale;
        this.choiceButtonGroup?.clear(true, true);
        const { buttonGraphics: newButton1, buttonText: newText1 } = this.createButton(width / 4, height / 1.8, "좋습니다.", () => {
            console.log(`좋습니다 선택`);
        });
        const { buttonGraphics: newButton2, buttonText: newText2 } = this.createButton(width / 4, height / 1.6, "이러시면 저희 남는게 없어요..", () => {
            console.log("이러시면 저희 남는게 없어요.");
        });
        this.choiceButtonGroup?.add(newButton1);
        this.choiceButtonGroup?.add(newText1);
        this.choiceButtonGroup?.add(newButton2);
        this.choiceButtonGroup?.add(newText2);
    }
    toggleItemStatus(item) {
        if (this.currentItemStatus) {
            this.currentItemStatus.close();
            this.currentItemStatus = null;
        }
        else {
            this.currentItemStatus = new ItemStatus(this, this.scale.width - 250, this.scale.height / 2, item.id);
        }
    }
    createButton(x, y, text, callback) {
        const buttonWidth = 300;
        const buttonHeight = 50;
        const buttonGraphics = this.add.graphics();
        buttonGraphics.fillStyle(0x444444, 1);
        buttonGraphics.fillRoundedRect(x - buttonWidth / 2, y - buttonHeight / 2, buttonWidth, buttonHeight, 10);
        buttonGraphics.setDepth(7);
        const buttonText = this.add
            .text(x, y, text, {
            fontFamily: "Arial",
            fontSize: "20px",
            color: "#ffffff",
            align: "center",
        })
            .setOrigin(0.5)
            .setDepth(8);
        buttonGraphics.setInteractive(new Phaser.Geom.Rectangle(x - buttonWidth / 2, y - buttonHeight / 2, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains);
        buttonGraphics.on("pointerover", () => {
            buttonGraphics.clear();
            buttonGraphics.fillStyle(0x888888, 1);
            buttonGraphics.fillRoundedRect(x - buttonWidth / 2, y - buttonHeight / 2, buttonWidth, buttonHeight, 10);
        });
        buttonGraphics.on("pointerout", () => {
            buttonGraphics.clear();
            buttonGraphics.fillStyle(0x444444, 1);
            buttonGraphics.fillRoundedRect(x - buttonWidth / 2, y - buttonHeight / 2, buttonWidth, buttonHeight, 10);
        });
        buttonGraphics.on("pointerdown", () => {
            let effectSound = this.registry.get("buttonClick");
            if (!effectSound) {
                effectSound = this.sound.add("buttonClick", { volume: 0.5 });
                this.registry.set("buttonClick", effectSound);
            }
            const effectVolume = this.registry.get("effectVolume");
            if (effectSound instanceof Phaser.Sound.WebAudioSound &&
                effectVolume !== undefined) {
                effectSound.setVolume(effectVolume);
            }
            effectSound.play();
            callback();
        });
        return { buttonGraphics, buttonText };
    }
}
