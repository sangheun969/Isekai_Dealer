import Phaser from "phaser";
import ItemStatus from "../components/templates/ItemStatus";
import itemInfo from "../components/organisms/itemInfo";
import SetUpBar from "../components/templates/SetUpBar";
import React from "react";
import ReactDOM from "react-dom";
import { saveGameProgress } from "../utils/apiService";

export default class GameScene extends Phaser.Scene {
  private background: Phaser.GameObjects.Image | null = null;
  private dialogueBox: Phaser.GameObjects.Graphics | null = null;
  private currentItem: Phaser.GameObjects.Image | null = null;
  private speechBubble: Phaser.GameObjects.Image | null = null;
  private speechBubble2: Phaser.GameObjects.Image | null = null;
  private money: number = 100000;
  private moneyText: Phaser.GameObjects.Text | null = null;
  private customer: Phaser.GameObjects.Image | null = null;
  private speechText: Phaser.GameObjects.Text | null = null;
  // private choiceText1: Phaser.GameObjects.Text | null = null;
  // private choiceText2: Phaser.GameObjects.Text | null = null;
  private currentItemStatus: ItemStatus | null = null;
  private currentItemKey: string | null = null;
  private choiceButton1: Phaser.GameObjects.Graphics | null = null;
  private choiceButtonText1: Phaser.GameObjects.Text | null = null;
  private choiceButtonGroup: Phaser.GameObjects.Group | null = null;
  private selectedItemKey: string | null = null;
  private isSetupBarOpen: boolean = false;
  private suggestedPrice: number = 0;

  private inventory: any[] = [];

  constructor() {
    super({ key: "GameScene" });
  }

  init(data: { savedData?: { money: number; items: any[] } }) {
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
    this.load.image("listItems", "/images/background/listItems.png");
    this.load.image("speechBubble", "/images/background/speechBubble5.png");
    this.load.image("speechBubble2", "/images/background/speechBubble6.png");
    this.load.image("coin", "/images/background/myCoin.png");
    this.load.audio("buttonClick", "/audios/Button1.mp3");

    for (let i = 1; i <= 8; i++) {
      this.load.image(`client${i}`, `/images/npc/client${i}.png`);
    }
  }

  create() {
    const { width, height } = this.scale;
    this.choiceButtonGroup = this.add.group();

    this.background = this.add
      .sprite(0, 0, "pawnShopBackground3")
      .setDisplaySize(width, height)
      .setOrigin(0, 0);
    this.add
      .image(width / 2, height, "table2")
      .setDisplaySize(width, height)
      .setDepth(5)
      .setOrigin(0.5, 0.5);

    this.spawnRandomCustomer();

    this.moneyText = this.add
      .text(-50, 20, `💰 ${this.money.toLocaleString()} 코인`, {
        fontSize: "24px",
        color: "#fff",
      })
      .setDepth(10)
      .setOrigin(1, 0);

    this.add
      .text(-50, 60, "💾 저장", {
        fontSize: "24px",
        color: "#fff",
        padding: { left: 10, right: 10, top: 5, bottom: 5 },
      })
      .setInteractive()
      .setDepth(10)
      .setOrigin(1, 0)
      .on("pointerdown", async () => {
        await saveGameProgress(this.money, this.inventory);
      });

    const list1 = this.add.image(width * 0.1, height * 0.85, "list1");
    list1.setScale(0.4).setDepth(6).setOrigin(0.5, 0.5);
    list1.setInteractive();

    const listItemsImage = this.add.image(width / 2, height / 2, "listItems");
    listItemsImage.setVisible(false).setDepth(10);

    list1.on("pointerdown", () => {
      listItemsImage.setVisible(!listItemsImage.visible);
    });
    this.input.keyboard?.on("keydown-ESC", this.openSetupBar, this);
  }

  openSetupBar() {
    if (this.isSetupBarOpen) return;
    this.isSetupBarOpen = true;

    const modalContainer = document.createElement("div");
    modalContainer.id = "setup-bar-modal";
    document.body.appendChild(modalContainer);

    const closeSetupBar = () => {
      this.isSetupBarOpen = false;
      ReactDOM.unmountComponentAtNode(modalContainer);
      document.body.removeChild(modalContainer);
    };

    ReactDOM.render(
      <SetUpBar onClose={closeSetupBar} scene={this} />,
      modalContainer
    );
  }

  private spawnRandomCustomer() {
    const { width, height } = this.scale;

    const randomClientNumber = Phaser.Math.Between(1, 9);
    const customerKey = `client${randomClientNumber}`;

    this.customer = this.add.image(width / 2, height + 220, customerKey);
    this.customer.setScale(0.6).setDepth(4).setOrigin(0.5, 1);

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
          if (this.currentItem) {
            this.currentItem.destroy();
          }

          this.currentItem = this.add.image(width / 2, height / 1.2, itemKey);
          this.currentItem.setScale(0.6).setDepth(6).setOrigin(0.5, 0.5);
          this.currentItem.setInteractive();

          this.currentItem.on("pointerover", () => {
            this.currentItem?.setTint(0xdddddd);
          });

          this.currentItem.on("pointerout", () => {
            this.currentItem?.clearTint();
          });

          this.currentItem.on("pointerdown", () => {
            let effectSound = this.registry.get("buttonClick") as
              | Phaser.Sound.BaseSound
              | undefined;
            if (!effectSound) {
              effectSound = this.sound.add("buttonClick", { volume: 0.5 });
              this.registry.set("buttonClick", effectSound);
            }
            const effectVolume = this.registry.get("effectVolume") as
              | number
              | undefined;
            if (
              effectSound instanceof Phaser.Sound.WebAudioSound &&
              effectVolume !== undefined
            ) {
              effectSound.setVolume(effectVolume);
            }
            effectSound.play();
            this.toggleItemStatus(randomItem);
            this.currentItemKey = itemKey;
          });
        } else {
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
      .text(
        width / 4.5,
        height / 3 - 50,
        "안녕하세요. 이 물건을 보여드릴게요",
        {
          fontFamily: "Arial",
          fontSize: "22px",
          color: "#ffffff",
          wordWrap: { width: this.speechBubble.displayWidth * 0.7 },
          align: "center",
        }
      )
      .setOrigin(0.5)
      .setDepth(7);

    const { buttonGraphics, buttonText } = this.createButton(
      width / 4,
      height / 1.8,
      "어떻게 하고 싶으시죠?",
      () => {
        if (!this.selectedItemKey) {
          console.warn("선택된 아이템이 없습니다.");
          return;
        }

        const item = itemInfo.find(
          (i) => i.id === Number(this.selectedItemKey?.replace("item", ""))
        );

        if (!item) {
          console.warn(
            `아이템 정보를 찾을 수 없습니다. (key: ${this.selectedItemKey})`
          );
          return;
        }
        console.log(
          `아이템 정보: ${item.name}, ${item.text}, 희귀도: ${item.rarity}`
        );

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
        this.suggestedPrice =
          Math.floor(Phaser.Math.Between(minPrice, maxPrice) / 100) * 100;
        if (this.speechText) {
          this.speechText.setText(
            `${this.suggestedPrice.toLocaleString()}코인에 팔고 싶습니다`
          );
        }
        this.choiceButtonGroup?.clear(true, true);

        this.updateSpeechAndButtons();
      }
    );
    this.choiceButtonGroup?.add(buttonGraphics);
    this.choiceButtonGroup?.add(buttonText);

    const { buttonGraphics: cancelButton, buttonText: cancelText } =
      this.createButton(width / 4, height / 1.6, "관심 없어요", () => {
        console.log("관심 없어요 선택");
      });

    this.choiceButtonGroup?.add(cancelButton);
    this.choiceButtonGroup?.add(cancelText);
  }

  private updateSpeechAndButtons() {
    const { width, height } = this.scale;
    if (this.choiceButtonGroup) {
      this.choiceButtonGroup.children.each((child) => {
        (child as Phaser.GameObjects.GameObject).destroy();
        return true;
      });
    }

    this.choiceButtonGroup = this.add.group();

    this.choiceButton1?.destroy();
    this.choiceButton1 = null;

    this.choiceButtonText1?.destroy();
    this.choiceButtonText1 = null;

    const { buttonGraphics: newButton1, buttonText: newText1 } =
      this.createButton(width / 4, height / 1.8, "좋습니다.", () => {
        if (this.money >= this.suggestedPrice) {
          this.money -= this.suggestedPrice;
          console.log(`돈 ${this.money.toLocaleString()} 코인`);

          if (this.moneyText) {
            this.moneyText.setText(`💰 ${this.money.toLocaleString()} 코인`);
          }

          if (this.currentItem) {
            console.log("아이템 삭제됨");
            this.currentItem.destroy();
            this.currentItem = null;
          }
          this.selectedItemKey = null;

          this.customer?.destroy();
          this.customer = null;

          this.speechBubble?.destroy();
          this.speechBubble = null;

          this.speechBubble2?.destroy();
          this.speechBubble2 = null;

          this.speechText?.destroy();
          this.speechText = null;

          this.choiceButtonGroup?.clear(true, true);
          this.choiceButtonGroup?.destroy(true);
          this.choiceButtonGroup = this.add.group();
          this.spawnRandomCustomer();
        } else {
          console.warn("잔액 부족! 거래할 수 없습니다.");
          if (this.speechText) {
            this.speechText.setText("잔액이 부족합니다. 거래할 수 없습니다.");
          }
        }
      });
    const { buttonGraphics: newButton2, buttonText: newText2 } =
      this.createButton(
        width / 4,
        height / 1.6,
        "이러시면 저희 남는게 없어요..",
        () => {
          console.log("이러시면 저희 남는게 없어요.");
        }
      );

    this.choiceButtonGroup.add(newButton1);
    this.choiceButtonGroup.add(newText1);
    this.choiceButtonGroup.add(newButton2);
    this.choiceButtonGroup.add(newText2);
  }

  public toggleItemStatus(item: {
    id: number;
    name: string;
    text: string;
    image: string;
    rarity: string;
  }) {
    if (this.currentItemStatus) {
      this.currentItemStatus.close();
      this.currentItemStatus = null;
    } else {
      this.currentItemStatus = new ItemStatus(
        this,
        this.scale.width - 250, // 🔹 화면 오른쪽에 배치
        this.scale.height / 2,
        item.id
      );
    }
  }

  private createButton(
    x: number,
    y: number,
    text: string,
    callback: () => void
  ): {
    buttonGraphics: Phaser.GameObjects.Graphics;
    buttonText: Phaser.GameObjects.Text;
  } {
    const buttonWidth = 300;
    const buttonHeight = 50;

    const buttonGraphics = this.add.graphics();
    buttonGraphics.fillStyle(0x444444, 1);
    buttonGraphics.fillRoundedRect(
      x - buttonWidth / 2,
      y - buttonHeight / 2,
      buttonWidth,
      buttonHeight,
      10
    );
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

    buttonGraphics.setInteractive(
      new Phaser.Geom.Rectangle(
        x - buttonWidth / 2,
        y - buttonHeight / 2,
        buttonWidth,
        buttonHeight
      ),
      Phaser.Geom.Rectangle.Contains
    );

    buttonGraphics.on("pointerover", () => {
      buttonGraphics.clear();
      buttonGraphics.fillStyle(0x888888, 1);
      buttonGraphics.fillRoundedRect(
        x - buttonWidth / 2,
        y - buttonHeight / 2,
        buttonWidth,
        buttonHeight,
        10
      );
    });

    buttonGraphics.on("pointerout", () => {
      buttonGraphics.clear();
      buttonGraphics.fillStyle(0x444444, 1);
      buttonGraphics.fillRoundedRect(
        x - buttonWidth / 2,
        y - buttonHeight / 2,
        buttonWidth,
        buttonHeight,
        10
      );
    });

    buttonGraphics.on("pointerdown", () => {
      let effectSound = this.registry.get("buttonClick") as
        | Phaser.Sound.BaseSound
        | undefined;
      if (!effectSound) {
        effectSound = this.sound.add("buttonClick", { volume: 0.5 });
        this.registry.set("buttonClick", effectSound);
      }
      const effectVolume = this.registry.get("effectVolume") as
        | number
        | undefined;
      if (
        effectSound instanceof Phaser.Sound.WebAudioSound &&
        effectVolume !== undefined
      ) {
        effectSound.setVolume(effectVolume);
      }
      effectSound.play();
      callback();
    });

    return { buttonGraphics, buttonText };
  }
}
