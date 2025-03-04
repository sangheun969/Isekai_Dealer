import Phaser from "phaser";
import ItemStatus from "../components/templates/ItemStatus";
import itemInfo from "../components/organisms/itemInfo";
import SetUpBar from "../components/templates/SetUpBar";
import ItemList from "../components/templates/ItemList";
import { createRoot, Root } from "react-dom/client";
import React from "react";
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
  private itemDisplayGroup: Phaser.GameObjects.Group | null = null;
  private catImage: Phaser.GameObjects.Image | null = null;
  private isCatImageToggled: boolean = false;
  private itemListRoot: Root | null = null;
  private setupBarRoot: Root | null = null;
  private currentCustomerId: number | null = null;
  private currentClientPersonality: string | null = null;
  private currentItemData: any | null = null;

  private inventory: any[] = [];

  private personalities: string[] = [
    "호구",
    "철저한 협상가",
    "도둑놈 기질",
    "초보 수집가",
    "화끈한 사람",
    "부유한 바보",
    "수상한 밀수업자",
  ];

  constructor() {
    super({ key: "GameScene" });
  }

  async saveGameState() {
    await saveGameProgress(this.money, this.inventory, {
      customerId: this.currentCustomerId,
      personality: this.currentClientPersonality,
      item: this.currentItemData,
    });
  }

  init(data: { savedData?: { money: number; items: any[]; customer?: any } }) {
    if (data.savedData) {
      console.log("📥 불러온 데이터 적용:", data.savedData);
      this.money = data.savedData.money;
      this.inventory = data.savedData.items;

      if (data.savedData.customer) {
        this.currentCustomerId = data.savedData.customer.customerId;
        this.currentClientPersonality = data.savedData.customer.personality;
        this.currentItemData = data.savedData.customer.item;
      } else {
        this.spawnRandomCustomer();
      }
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
    this.load.image("cat1", "/images/main/cat1.png");
    this.load.image("cat2", "/images/main/cat2.png");

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

    this.itemDisplayGroup = this.add.group();

    this.moneyText = this.add
      .text(width - 10, 50, `💰 ${this.money.toLocaleString()} 코인`, {
        fontSize: "32px",
        color: "#fff",
        padding: { left: 10, right: 10, top: 5, bottom: 5 },
      })
      .setDepth(10)
      .setOrigin(1, 0);

    this.add
      .text(width - 10, 90, "💾 저장", {
        fontSize: "32px",
        color: "#fff",
        padding: { left: 10, right: 10, top: 5, bottom: 5 },
      })
      .setInteractive()
      .setDepth(10)
      .setOrigin(1, 0)
      .on("pointerdown", async () => {
        await saveGameProgress(this.money, this.inventory);
      });

    this.input.keyboard?.on("keydown-I", () => {
      this.openItemList();
    });

    const list1 = this.add.image(width * 0.1, height * 0.85, "list1");
    list1.setScale(0.4).setDepth(6).setOrigin(0.5, 0.5);
    list1.setInteractive();
    list1.on("pointerdown", () => {
      this.openItemList();
    });
    this.input.keyboard?.on("keydown-ESC", this.openSetupBar, this);

    this.catImage = this.add
      .image(width - 150, height - 100, "cat1")
      .setScale(0.3)
      .setDepth(10)
      .setInteractive();

    this.catImage.on("pointerdown", () => {
      this.toggleCatImage();
    });
  }

  private openItemList() {
    if (document.getElementById("item-list-modal")) return;

    this.input.enabled = false;

    const modalContainer = document.createElement("div");
    modalContainer.id = "item-list-modal";
    document.body.appendChild(modalContainer);

    const closeItemList = () => {
      this.closeItemList();
    };

    if (!this.itemListRoot) {
      this.itemListRoot = createRoot(modalContainer);
    }

    this.itemListRoot.render(
      <ItemList
        inventory={this.inventory}
        itemsPerPage={3}
        onClose={closeItemList}
      />
    );
  }
  private closeItemList() {
    const modalContainer = document.getElementById("item-list-modal");
    if (modalContainer && this.itemListRoot) {
      this.itemListRoot.unmount();
      this.itemListRoot = null;
      document.body.removeChild(modalContainer);
    }
    this.input.enabled = true;
  }

  openSetupBar() {
    if (this.isSetupBarOpen) return;
    this.isSetupBarOpen = true;

    const modalContainer = document.createElement("div");
    modalContainer.id = "setup-bar-modal";
    document.body.appendChild(modalContainer);

    const closeSetupBar = () => {
      this.isSetupBarOpen = false;
      this.closeSetupBar();
    };

    if (!this.setupBarRoot) {
      this.setupBarRoot = createRoot(modalContainer);
    }

    this.setupBarRoot.render(<SetUpBar onClose={closeSetupBar} scene={this} />);
  }

  closeSetupBar() {
    const modalContainer = document.getElementById("setup-bar-modal");
    if (modalContainer && this.setupBarRoot) {
      this.setupBarRoot.unmount();
      this.setupBarRoot = null;
      document.body.removeChild(modalContainer);
    }
  }

  private spawnRandomCustomer() {
    const { width, height } = this.scale;

    if (this.customer) {
      this.customer.destroy();
      this.customer = null;
    }
    if (this.speechBubble) {
      this.speechBubble.destroy();
      this.speechBubble = null;
    }
    if (this.speechText) {
      this.speechText.destroy();
      this.speechText = null;
    }
    if (this.choiceButtonGroup) {
      this.choiceButtonGroup.clear(true, true);
    }

    if (this.currentCustomerId && this.currentItemData) {
      console.log(`🔄 기존 손님 로드: 고객 ID ${this.currentCustomerId}`);
    } else {
      this.currentCustomerId = Phaser.Math.Between(1, 8);
      this.currentClientPersonality =
        this.personalities[
          Phaser.Math.Between(0, this.personalities.length - 1)
        ];
      this.currentItemData = Phaser.Math.RND.pick(itemInfo);
    }

    const customerKey = `client${this.currentCustomerId}`;
    this.customer = this.add.image(width / 2, height + 220, customerKey);
    this.customer.setScale(0.6).setDepth(4).setOrigin(0.5, 1);

    if (this.currentItemData) {
      console.log("📦 현재 아이템 데이터:", this.currentItemData);
      this.loadItem(this.currentItemData);
    }

    // 🔹 대사 및 선택 버튼 추가
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
        this.spawnRandomCustomer();
      });

    this.choiceButtonGroup?.add(cancelButton);
    this.choiceButtonGroup?.add(cancelText);
  }

  private loadItem(itemData: any) {
    const { width, height } = this.scale;

    console.log("🔄 아이템 로드 시작:", itemData);

    if (this.currentItem) this.currentItem.destroy();

    // 🔹 Phaser가 해당 아이템 이미지를 로드했는지 확인
    const itemKey = `item${itemData.id}`;
    if (!this.textures.exists(itemKey)) {
      console.warn(`🚨 아이템 이미지 로드되지 않음: ${itemData.image}`);
      this.load.image(itemKey, itemData.image);
      this.load.once("complete", () => {
        this.createItemDisplay(itemKey);
      });
      this.load.start();
    } else {
      this.createItemDisplay(itemKey);
    }
  }

  private createItemDisplay(itemKey: string) {
    const { width, height } = this.scale;

    console.log("✅ 아이템 화면에 추가:", itemKey);

    this.currentItem = this.add.image(width / 2, height / 1.2, itemKey);
    this.currentItem.setScale(0.6).setDepth(6).setOrigin(0.5, 0.5);
    this.currentItem.setInteractive();

    this.selectedItemKey = itemKey;

    this.currentItem.on("pointerover", () =>
      this.currentItem?.setTint(0xdddddd)
    );
    this.currentItem.on("pointerout", () => this.currentItem?.clearTint());
    this.currentItem.on("pointerdown", () => {
      let effectSound = this.registry.get("buttonClick") as
        | Phaser.Sound.BaseSound
        | undefined;
      if (!effectSound) {
        effectSound = this.sound.add("buttonClick", { volume: 0.5 });
        this.registry.set("buttonClick", effectSound);
      }
      effectSound.play();

      this.selectedItemKey = itemKey;

      const item = itemInfo.find((i) => `item${i.id}` === itemKey);

      if (item) {
        this.toggleItemStatus(item);
      } else {
        console.warn(`🚨 아이템 정보를 찾을 수 없습니다: ${itemKey}`);
      }
    });
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

    const { buttonGraphics: newButton1, buttonText: newText1 } =
      this.createButton(width / 4, height / 1.8, "좋습니다.", () => {
        if (!this.selectedItemKey) {
          console.warn(
            "🚨 아이템이 선택되지 않았습니다. 기본 아이템을 사용합니다."
          );
          this.selectedItemKey = `item${this.currentItemData?.id ?? 1}`;
        }

        if (this.money >= this.suggestedPrice) {
          this.money -= this.suggestedPrice;
          console.log(`돈 ${this.money.toLocaleString()} 코인`);

          if (this.moneyText) {
            this.moneyText.setText(`💰 ${this.money.toLocaleString()} 코인`);
          }

          const item = itemInfo.find(
            (i) => i.id === Number(this.selectedItemKey?.replace("item", ""))
          );

          if (item) {
            this.inventory.push({ ...item, price: this.suggestedPrice });
            console.log("📦 인벤토리에 추가됨:", item);
          }

          if (this.currentItem) {
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
        this.scale.width - 250,
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

  private toggleCatImage() {
    if (!this.catImage) return;

    this.isCatImageToggled = !this.isCatImageToggled;
    this.catImage.setTexture(this.isCatImageToggled ? "cat2" : "cat1");
  }

  private showClientPersonality() {
    if (!this.currentClientPersonality) return;
    this.add.text(100, 100, `손님 성격: ${this.currentClientPersonality}`, {
      fontSize: "20px",
      color: "#fff",
    });
  }
}
