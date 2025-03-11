import Phaser from "phaser";
import ItemStatus from "../components/templates/ItemStatus";
import itemInfo from "../components/organisms/itemInfo";
import SetUpBar from "../components/templates/SetUpBar";
import ItemList from "../components/templates/ItemList";
import { createRoot, Root } from "react-dom/client";
import React from "react";
// import { saveGameProgress, loadGameProgress } from "../backend/gameDataService";
import { saveGameProgress, loadGameProgress } from "../utils/apiService";

import ClientPurchaseScene from "../components/templates/ClientPurchaseScene";
import ItemPurchaseModal from "../components/organisms/ItemPurchaseModal";
import PersonalityModal from "../components/templates/PersonalityModal";

import {
  getMinAcceptablePrice,
  getResponseText,
} from "../components/templates/priceEvaluation";

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
  private personalityModalRoot: Root | null = null;
  private isPersonalityModalOpen: boolean = false;
  private currentItemData: any | null = null;
  private price: number;
  private buttonText5: Phaser.GameObjects.Text | null;
  private setModalState:
    | ((isOpen: boolean, item?: any, price?: number) => void)
    | null = null;
  private reactContext: React.Component<any, any> | null = null;
  private modalContainer: HTMLDivElement | null = null;
  private modalRoot: Root | null = null;
  private currentClient: Phaser.GameObjects.Image | null = null;
  private moneyImage: Phaser.GameObjects.Image | null = null;
  private reinputButton: Phaser.GameObjects.Image | null = null;

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
    this.price = 0;
    this.buttonText5 = null;
    this.inventory = [];
    this.money = 0;
  }

  async saveGameState() {
    try {
      await saveGameProgress(this.money, this.inventory, {
        customerId: this.currentCustomerId,
        personality: this.currentClientPersonality,
        item: this.currentItemData,
      });

      if (this.moneyText) {
        this.moneyText.setText(`💰 ${this.money.toLocaleString()} 코인`);
      }

      console.log("✅ 게임 데이터 저장 성공!");
    } catch (error) {
      console.error("❌ 게임 데이터 저장 실패:", error);
    }
  }

  private handleNewSuggestedPrice(newSuggestedPrice: number) {
    this.price = newSuggestedPrice;

    if (this.buttonText5) {
      this.buttonText5.setText(`제안 가격: ${this.price}코인`);
    } else {
      console.warn(
        "🚨 this.buttonText5가 존재하지 않아 setText를 실행할 수 없습니다."
      );
    }
  }

  public registerReactContext(reactComponent: React.Component) {
    this.reactContext = reactComponent;
    console.log("🔄 React Context 등록됨!");

    this.setModalState = (isOpen: boolean, item?: any, price?: number) => {
      console.log("🔄 setModalState 호출됨!", isOpen, item, price);
      if (this.reactContext) {
        this.reactContext.setState({
          isModalOpen: isOpen,
          modalItem: item || null,
          modalPrice: price || null,
        });
      } else {
        console.warn("❌ this.reactContext가 설정되지 않음!");
      }
    };
  }

  private someLogicToCalculateNewPrice(): number {
    const calculatedPrice = Math.floor(this.suggestedPrice * 0.9);
    return calculatedPrice;
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
    this.load.image("speechBubble9", "/images/background/speechBubble9.png");
    this.load.image("speechBubble6", "/images/background/speechBubble6.png");
    this.load.image("speechBubble8", "/images/background/speechBubble8.png");
    this.load.image("coin", "/images/background/myCoin.png");
    this.load.audio("buttonClick", "/audios/Button1.mp3");
    this.load.image("cat1", "/images/main/cat1.png");
    this.load.image("cat2", "/images/main/cat2.png");
    this.load.image("reinputIcon", "/images/icon/icon1.png");
    this.load.image("amountPaid1", "/images/items/moneyCoin2.png");
    this.load.image("amountPaid2", "/images/items/moneyCoin4.png");
    this.load.image("reinputPrice", "/images/background/reinputPrice.png");

    for (let i = 1; i <= 14; i++) {
      this.load.image(`client${i}`, `/images/npc/client${i}.png`);
    }
  }

  async create() {
    try {
      const gameData = await loadGameProgress();

      if (gameData) {
        console.log("✅ 게임 데이터 로드 성공:", gameData);

        this.money = gameData.money;
        this.inventory = gameData.items;
        this.currentCustomerId = gameData.customerData?.customerId || null;
        this.currentClientPersonality =
          gameData.customerData?.personality || null;
        this.currentItemData = gameData.customerData?.item || null;
      } else {
        console.warn("⚠️ 저장된 게임 데이터가 없음. 기본값 사용.");
      }
    } catch (error) {
      console.error("❌ 게임 데이터 불러오기 실패:", error);
    }

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

    const hasInventoryItems = this.inventory.length > 0;

    if (hasInventoryItems && Math.random() < 0.4) {
      this.spawnBuyer();
    } else {
      this.spawnRandomCustomer();
    }

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

    this.scene.launch("ClientPurchaseScene", {
      inventory: this.inventory,
      money: this.money,
      openModal: this.setModalState,
    });
  }

  private cleanupUI() {
    if (this.currentItem) {
      this.currentItem.destroy();
      this.currentItem = null;
    }
    this.selectedItemKey = null;

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
      this.choiceButtonGroup.destroy();
      this.choiceButtonGroup = this.add.group();
    }
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

  private createImageButtonWithText(
    x: number,
    y: number,
    imageKey: string,
    text: string,
    callback: () => void
  ): {
    buttonImage: Phaser.GameObjects.Image;
    buttonText: Phaser.GameObjects.Text;
  } {
    const buttonImage = this.add
      .image(x, y, imageKey)
      .setScale(0.5)
      .setDepth(7);
    buttonImage.setInteractive();

    const buttonText = this.add
      .text(x, y, text, {
        fontFamily: "Arial",
        fontSize: "22px",
        color: "#ffffff",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(8);

    buttonImage.on("pointerover", () => {
      buttonImage.setTint(0xdddddd);
    });

    buttonImage.on("pointerout", () => {
      buttonImage.clearTint();
    });

    buttonImage.on("pointerdown", () => {
      let effectSound = this.registry.get("buttonClick") as
        | Phaser.Sound.BaseSound
        | undefined;
      if (!effectSound) {
        effectSound = this.sound.add("buttonClick", { volume: 0.5 });
        this.registry.set("buttonClick", effectSound);
      }
      effectSound.play();
      callback();
    });

    return { buttonImage, buttonText };
  }
  private clearClientUI() {
    if (this.currentClient) {
      this.currentClient.destroy();
      this.currentClient = null;
    }

    if (this.customer) {
      this.customer.destroy();
      this.customer = null;
    }

    if (this.currentItem) {
      this.currentItem.destroy();
      this.currentItem = null;
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
      this.choiceButtonGroup.destroy();
      this.choiceButtonGroup = this.add.group();
    }
  }

  private spawnRandomCustomer() {
    const { width, height } = this.scale;

    this.clearClientUI();

    if (this.choiceButtonGroup) {
      this.choiceButtonGroup.getChildren().forEach((child) => {
        child.destroy();
      });
      this.choiceButtonGroup.clear(true, true);
      this.choiceButtonGroup.destroy(true);
    }
    this.choiceButtonGroup = this.add.group();

    this.cleanupUI();

    this.currentCustomerId = Phaser.Math.Between(1, 8);
    this.currentItemData = Phaser.Math.RND.pick(itemInfo);
    this.currentClientPersonality = Phaser.Math.RND.pick(this.personalities);

    const customerKey = `client${this.currentCustomerId}`;
    this.customer = this.add.image(width / 2, height + 220, customerKey);
    this.customer.setScale(0.7).setDepth(4).setOrigin(0.5, 1);

    if (this.currentItemData) {
      this.loadItem(this.currentItemData);

      let minPercentage = 0.05;
      let maxPercentage = 0.1;
      switch (this.currentItemData.rarity) {
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
    }

    this.speechBubble = this.add
      .image(width / 3.6, height / 3 - 25, "speechBubble9")
      .setScale(0.6)
      .setDepth(3)
      .setAlpha(1);

    if (this.speechBubble) {
      this.speechBubble.setDisplaySize(
        this.speechBubble.width * 0.6,
        this.speechBubble.height * 0.3
      );
    }

    this.speechText = this.add
      .text(
        width / 3.6,
        height / 3 - 40,
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
    if (this.choiceButtonGroup) {
      this.choiceButtonGroup.getChildren().forEach((child) => {
        if (
          child instanceof Phaser.GameObjects.Text ||
          child instanceof Phaser.GameObjects.Graphics
        ) {
          child.destroy();
        }
      });
      this.choiceButtonGroup.clear(true, true);
    }

    const { buttonImage: buttonImage1, buttonText: buttonText1 } =
      this.createImageButtonWithText(
        width / 3.6,
        height / 1.5 - 100,
        "speechBubble8",
        "어떻게 하고 싶으시죠?",
        () => {
          this.clearChoiceButtons();
          this.updateSpeechAndButtons();
        }
      );

    const { buttonImage: buttonImage2, buttonText: buttonText2 } =
      this.createImageButtonWithText(
        width / 3.6,
        height / 1.5,
        "speechBubble8",
        "관심 없어요",
        () => {
          this.clearChoiceButtons();

          this.clearClientUI();

          const hasInventoryItems = this.inventory.length > 0;

          if (hasInventoryItems && Math.random() < 0.4) {
            this.spawnBuyer();
          } else {
            this.spawnRandomCustomer();
          }
        }
      );

    this.choiceButtonGroup.add(buttonImage1);
    this.choiceButtonGroup.add(buttonText1);
    this.choiceButtonGroup.add(buttonImage2);
    this.choiceButtonGroup.add(buttonText2);
  }

  private clearChoiceButtons() {
    if (this.choiceButtonGroup) {
      this.choiceButtonGroup.getChildren().forEach((child) => {
        if (
          child instanceof Phaser.GameObjects.Text ||
          child instanceof Phaser.GameObjects.Graphics
        ) {
          child.destroy();
        }
      });
      this.choiceButtonGroup.clear(true, true);
    }
  }

  private loadItem(itemData: any) {
    if (this.currentItem) this.currentItem.destroy();

    const itemKey = `item${itemData.id}`;
    if (!this.textures.exists(itemKey)) {
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

    this.clearChoiceButtons();

    if (this.speechText) {
      this.speechText.setText(
        `${this.suggestedPrice.toLocaleString()}코인에 팔고 싶습니다.`
      );
    }

    const { buttonImage: buttonImage3, buttonText: buttonText3 } =
      this.createImageButtonWithText(
        width / 3.6,
        height / 1.5 - 100,
        "speechBubble8",
        "좋습니다.",
        () => {
          if (!this.selectedItemKey) {
            console.warn("🚨 아이템이 선택되지 않았습니다.");
            return;
          }

          if (this.money >= this.suggestedPrice) {
            this.money -= this.suggestedPrice;
            console.log(`💰 ${this.money.toLocaleString()} 코인 남음`);

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

            this.cleanupUI();
            const hasInventoryItems = this.inventory.length > 0;

            if (hasInventoryItems && Math.random() < 0.5) {
              console.log("🛒 새로운 고객이 등장합니다: 아이템 구매자");
              this.spawnBuyer();
            } else {
              console.log("🛍️ 새로운 고객이 등장합니다: 아이템 판매자");
              this.spawnRandomCustomer();
            }
          } else {
            console.warn("잔액 부족! 거래할 수 없습니다.");
            if (this.speechText) {
              this.speechText.setText("잔액이 부족합니다. 거래할 수 없습니다.");
            }
          }
        }
      );

    const { buttonImage: buttonImage4, buttonText: buttonText4 } =
      this.createImageButtonWithText(
        width / 3.6,
        height / 1.5,
        "speechBubble8",
        "이러시면 저희 남는게 없어요..",
        () => {
          buttonImage4.destroy();
          buttonText4.destroy();
          const createInputField = (defaultValue = "") => {
            const inputBg = this.add
              .image(width / 2, height / 2, "reinputPrice")
              .setScale(0.5)
              .setDepth(10);

            const inputElement = document.createElement("input");
            inputElement.type = "text";
            inputElement.placeholder = "가격을 입력하세요...";
            inputElement.value = defaultValue;
            inputElement.style.position = "absolute";
            inputElement.style.left = `${width / 2 - 150}px`;
            inputElement.style.top = `${height / 2 - 20}px`;
            inputElement.style.width = "300px";
            inputElement.style.height = "60px";
            inputElement.style.fontSize = "16px";
            inputElement.style.padding = "5px";
            inputElement.style.border = "1px solid white";
            inputElement.style.background = "transparent";
            inputElement.style.color = "white";
            inputElement.style.textAlign = "center";
            inputElement.style.outline = "none"; // ✅

            inputElement.addEventListener("input", (event) => {
              const target = event.target as HTMLInputElement;
              target.value = target.value.replace(/[^0-9]/g, "");
            });

            const confirmButton = document.createElement("button");
            confirmButton.innerText = "확인";
            confirmButton.style.position = "absolute";
            confirmButton.style.left = `${width / 2 + 80}px`;
            confirmButton.style.top = `${height / 2 + 40}px`;
            confirmButton.style.width = "60px";
            confirmButton.style.height = "36px";
            confirmButton.style.fontSize = "14px";
            confirmButton.style.padding = "5px";
            confirmButton.style.border = "1px solid white";
            confirmButton.style.background = "gray";
            confirmButton.style.color = "white";
            confirmButton.style.cursor = "pointer";

            document.body.appendChild(inputElement);
            document.body.appendChild(confirmButton);
            inputElement.focus();

            const handleInput = () => {
              const price = Number(inputElement.value.trim());
              if (isNaN(price)) return;

              document.body.removeChild(inputElement);
              document.body.removeChild(confirmButton);

              inputElement.remove();
              confirmButton.remove();
              inputBg.setVisible(false);

              const reinputButton = this.add
                .image(width / 4 + 230, height / 1.8 + 120, "reinputIcon")
                .setScale(0.1)
                .setDepth(8)
                .setInteractive();

              reinputButton.on("pointerdown", () => {
                console.log("🔄 재입력 버튼 클릭됨!");

                buttonImage5.destroy();
                buttonText5.destroy();
                reinputButton.setVisible(false);
                inputBg.setVisible(false);

                createInputField(String(price));
              });
              let negotiationAttempts = 0;
              const { buttonImage: buttonImage5, buttonText: buttonText5 } =
                this.createImageButtonWithText(
                  width / 3.6,
                  height / 1.5,
                  "speechBubble8",
                  `제안 가격: ${price}코인`,
                  () => {
                    const minAcceptablePrice = getMinAcceptablePrice(
                      this.suggestedPrice,
                      this.currentClientPersonality as string
                    );

                    let { response: responseText } = getResponseText(
                      price,
                      minAcceptablePrice,
                      this.currentClientPersonality as string,
                      this.suggestedPrice
                    );

                    if (this.speechText) {
                      this.speechText.setText(responseText);
                    }

                    if (buttonImage3 && buttonText3) {
                      buttonImage3.setVisible(false);
                      buttonText3.setVisible(false);
                    }

                    const newSuggestedPrice =
                      this.someLogicToCalculateNewPrice();
                    this.handleNewSuggestedPrice(newSuggestedPrice);

                    if (this.buttonText5) {
                      this.buttonText5.setText(`제안 가격: ${this.price}코인`);
                    } else {
                      console.warn(
                        "🚨 this.buttonText5가 null이므로 setText 실행 불가"
                      );
                    }

                    if (
                      price >= minAcceptablePrice ||
                      price === newSuggestedPrice
                    ) {
                      buttonImage5.destroy();
                      buttonText5.destroy();
                      if (reinputButton) {
                        reinputButton.setVisible(false);
                      }

                      const { buttonImage: yesButton, buttonText: yesText } =
                        this.createImageButtonWithText(
                          width / 3.6,
                          height / 1.5,
                          "speechBubble8",
                          "예",
                          () => {
                            if (this.speechText) {
                              this.speechText.setText("음..알겠습니다.");
                            }

                            yesButton.destroy();
                            yesText.destroy();

                            const {
                              buttonImage: confirmButton,
                              buttonText: confirmText,
                            } = this.createImageButtonWithText(
                              width / 3.6,
                              height / 1.5,
                              "speechBubble8",
                              "좋습니다.",
                              () => {
                                if (!this.selectedItemKey) {
                                  console.warn(
                                    "🚨 아이템이 선택되지 않았습니다."
                                  );
                                  return;
                                }
                                const finalPrice = Number(price);

                                if (this.money >= finalPrice) {
                                  this.money -= finalPrice;
                                  console.log(
                                    `💰 ${this.money.toLocaleString()} 코인 남음`
                                  );

                                  if (this.moneyText) {
                                    this.moneyText.setText(
                                      `💰 ${this.money.toLocaleString()} 코인`
                                    );
                                  }
                                  const item = itemInfo.find(
                                    (i) =>
                                      i.id ===
                                      Number(
                                        this.selectedItemKey?.replace(
                                          "item",
                                          ""
                                        )
                                      )
                                  );
                                  if (item) {
                                    this.inventory.push({
                                      ...item,
                                      price: finalPrice,
                                    });
                                  }

                                  this.cleanupUI();
                                  const hasInventoryItems =
                                    this.inventory.length > 0;

                                  if (
                                    hasInventoryItems &&
                                    Math.random() < 0.5
                                  ) {
                                    console.log(
                                      "🛒 새로운 고객이 등장합니다: 아이템 구매자"
                                    );
                                    this.spawnBuyer();
                                  } else {
                                    console.log(
                                      "🛍️ 새로운 고객이 등장합니다: 아이템 판매자"
                                    );
                                    this.spawnRandomCustomer();
                                  }
                                } else {
                                  console.warn(
                                    "잔액 부족! 거래할 수 없습니다."
                                  );
                                  if (this.speechText) {
                                    this.speechText.setText(
                                      "잔액이 부족합니다. 거래할 수 없습니다."
                                    );
                                  }
                                }
                              }
                            );

                            this.choiceButtonGroup?.add(confirmButton);
                            this.choiceButtonGroup?.add(confirmText);
                          }
                        );

                      this.choiceButtonGroup?.add(yesButton);
                      this.choiceButtonGroup?.add(yesText);
                    } else {
                      if (this.buttonText5) {
                        this.buttonText5.setText(
                          `제안 가격: ${newSuggestedPrice}코인`
                        );
                      }
                    }

                    const maxNegotiationAttempts =
                      Math.floor(Math.random() * 2) + 2;

                    if (negotiationAttempts >= maxNegotiationAttempts) {
                      console.log("❌ 최대 협상 횟수 도달! 협상 종료");
                      this.speechText?.setText(
                        "그만하죠. 이 가격으로는 거래할 수 없습니다."
                      );

                      const { buttonImage: endButton, buttonText: endText } =
                        this.createImageButtonWithText(
                          width / 3.6,
                          height / 1.5,
                          "speechBubble8",
                          "다음 고객",
                          () => {
                            endButton.destroy();
                            endText.destroy();
                            this.cleanupUI();
                            this.spawnRandomCustomer();
                          }
                        );

                      if (buttonImage5) buttonImage5.setVisible(false);
                      if (buttonText5) buttonText5.setVisible(false);
                      if (reinputButton) {
                        reinputButton.setVisible(false);
                      }

                      this.choiceButtonGroup?.add(endButton);
                      this.choiceButtonGroup?.add(endText);
                      return;
                    }

                    negotiationAttempts++;

                    if (this.currentClientPersonality === "철저한 협상가") {
                      this.suggestedPrice = Math.floor(
                        this.suggestedPrice * 0.9
                      );
                      responseText = `이 가격은 말도 안 됩니다! 다시 생각해 보세요. ${this.suggestedPrice}코인은 어떨까요?`;
                    } else if (
                      this.currentClientPersonality === "도둑놈 기질"
                    ) {
                      this.suggestedPrice = Math.floor(
                        this.suggestedPrice * 0.8
                      );
                      responseText = `너무 비싸요! ${this.suggestedPrice}코인이면 거래할게요.`;
                    } else if (
                      this.currentClientPersonality === "초보 수집가"
                    ) {
                      this.suggestedPrice = Math.floor(
                        this.suggestedPrice * 0.95
                      );
                      responseText = `음... 좀 비싸지만 ${this.suggestedPrice}코인이라면 괜찮을 것 같아요.`;
                    }
                  }
                );
              this.choiceButtonGroup?.add(buttonImage5);
              this.choiceButtonGroup?.add(buttonText5);
              this.choiceButtonGroup?.add(reinputButton);
            };

            inputElement.addEventListener("keydown", (event) => {
              if (event.key === "Enter") {
                handleInput();
              }
            });

            confirmButton.addEventListener("click", () => {
              handleInput();
            });
          };

          createInputField();
        }
      );

    this.choiceButtonGroup?.add(buttonImage3);
    this.choiceButtonGroup?.add(buttonText3);
    this.choiceButtonGroup?.add(buttonImage4);
    this.choiceButtonGroup?.add(buttonText4);
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

  private toggleCatImage() {
    if (!this.catImage) return;

    this.isCatImageToggled = !this.isCatImageToggled;
    this.catImage.setTexture(this.isCatImageToggled ? "cat2" : "cat1");

    if (this.isPersonalityModalOpen) {
      this.closePersonalityModal();
    } else {
      this.showClientPersonality();
    }
  }

  private showClientPersonality() {
    if (!this.currentClientPersonality || this.isPersonalityModalOpen) return;

    if (document.getElementById("personality-modal")) return;

    const modalContainer = document.createElement("div");
    modalContainer.id = "personality-modal";
    document.body.appendChild(modalContainer);

    if (!this.personalityModalRoot) {
      this.personalityModalRoot = createRoot(modalContainer);
    }

    this.personalityModalRoot.render(
      <PersonalityModal personality={this.currentClientPersonality} />
    );

    setTimeout(() => {
      this.isPersonalityModalOpen = true;
    }, 0);
  }

  private closePersonalityModal() {
    const modalContainer = document.getElementById("personality-modal");
    if (modalContainer && this.personalityModalRoot) {
      this.personalityModalRoot.unmount();
      this.personalityModalRoot = null;
      document.body.removeChild(modalContainer);
    }
    this.isPersonalityModalOpen = false;
    this.input.enabled = true;
  }

  private spawnBuyer() {
    const { width, height } = this.scale;

    this.clearClientUI();

    if (this.inventory.length === 0) {
      console.warn("📦 인벤토리가 비어 있어 구매자가 등장하지 않음");
      this.spawnRandomCustomer();
      return;
    }

    const clientNumber = Math.floor(Math.random() * 14) + 1;
    this.customer = this.add.image(
      width / 2,
      height + 220,
      `client${clientNumber}`
    );
    this.customer.setScale(0.7).setDepth(4).setOrigin(0.5, 1);

    const randomItemIndex = Math.floor(Math.random() * this.inventory.length);
    const selectedItem = this.inventory[randomItemIndex];

    this.selectedItemKey = `item${selectedItem.id}`;

    const originalPrice = selectedItem.originalPrice || selectedItem.price;

    const purchasePrice = Math.floor(selectedItem.price * 1.2);

    if (this.setModalState) {
      this.setModalState(true, selectedItem, purchasePrice);
    }
    const moneyImageKey =
      purchasePrice <= 10000 ? "amountPaid1" : "amountPaid2";
    this.moneyImage = this.add
      .image(width / 2, height / 1.2, moneyImageKey)
      .setInteractive({ useHandCursor: true })
      .setDepth(6)
      .setScale(0.6)
      .setOrigin(0.5, 0.5);

    this.moneyImage.on("pointerdown", () => {
      this.openItemPurchaseModal(selectedItem, purchasePrice, originalPrice);
    });

    this.speechBubble = this.add
      .image(width / 3.6, height / 3 - 25, "speechBubble9")
      .setScale(0.6)
      .setDepth(3)
      .setAlpha(1);

    this.speechBubble.setDisplaySize(
      this.speechBubble.width * 0.6,
      this.speechBubble.height * 0.3
    );

    this.speechText = this.add
      .text(
        width / 3.6,
        height / 3 - 40,
        `이 물건을 사고 싶은데, ${purchasePrice.toLocaleString()} 코인 이정도면 괜찮나요?`,
        {
          fontSize: "20px",
          color: "#fffafa",
          fontFamily: "Arial",
          align: "center",
          wordWrap: { width: 300 },
        }
      )
      .setOrigin(0.5)
      .setDepth(6);

    this.setupNegotiationButtons(this.speechText.y + 50);
  }

  private handleItemSale(soldItem: any, salePrice: number) {
    console.log(
      `✅ ${soldItem.name}을 ${salePrice.toLocaleString()}코인에 판매했습니다!`
    );

    this.inventory = this.inventory.filter((item) => item.id !== soldItem.id);

    this.money += salePrice;

    if (this.moneyText) {
      this.moneyText.setText(`💰 ${this.money.toLocaleString()} 코인`);
    }

    this.cleanupBuyerUI();

    this.saveGameState();
  }

  private cleanupBuyerUI() {
    this.choiceButtonGroup?.clear(true, true);
    this.choiceButtonGroup?.destroy();
    this.choiceButtonGroup = this.add.group();
  }

  private setupNegotiationButtons(speechTextY: number) {
    const { width, height } = this.scale;

    const buttonStartY = speechTextY + 50;

    const { buttonImage: buttonImage6, buttonText: buttonText6 } =
      this.createImageButtonWithText(
        width / 3.6,
        buttonStartY + 150,
        "speechBubble8",
        "좋습니다.",
        () => {
          if (!this.selectedItemKey) {
            console.warn("🚨 아이템이 선택되지 않았습니다.");
            return;
          }
          if (!this.selectedItemKey) {
            console.warn("아이템이 선태되지 않았습니다.");
            return;
          }
          const itemIndex = this.inventory.findIndex(
            (item) => `item${item.id}` === this.selectedItemKey
          );

          if (itemIndex === -1) {
            console.warn("🚨 선택한 아이템이 인벤토리에 없습니다.");
            return;
          }

          if (this.moneyImage) {
            this.moneyImage.destroy();
            this.moneyImage = null;
          }

          const soldItem = this.inventory[itemIndex];

          const salePrice = Math.floor(soldItem.price * 1.2);
          this.inventory.splice(itemIndex, 1);

          this.money += salePrice;

          if (this.moneyText) {
            this.moneyText.setText(`💰 ${this.money.toLocaleString()} 코인`);
          }

          this.cleanupUI();
          const hasInventoryItems = this.inventory.length > 0;

          if (hasInventoryItems && Math.random() < 0.4) {
            this.spawnBuyer();
          } else {
            this.spawnRandomCustomer();
          }
        }
      );

    const { buttonImage: buttonImage7, buttonText: buttonText7 } =
      this.createImageButtonWithText(
        width / 3.6,
        buttonStartY + 250,
        "speechBubble8",
        "재협상을 하시죠.",
        () => {
          console.log("🔄 협상 시작!");
        }
      );

    const { buttonImage: buttonImage8, buttonText: buttonText8 } =
      this.createImageButtonWithText(
        width / 3.6,
        buttonStartY + 350,
        "speechBubble8",
        "안팝니다.",
        () => {
          if (this.moneyImage) {
            this.moneyImage.destroy();
            this.moneyImage = null;
            console.log("💰 돈 이미지 제거 완료!");
          }

          this.cleanupUI();
          const hasInventoryItems = this.inventory.length > 0;

          if (hasInventoryItems && Math.random() < 0.4) {
            this.spawnBuyer();
          } else {
            this.spawnRandomCustomer();
          }
        }
      );

    this.choiceButtonGroup?.add(buttonImage6);
    this.choiceButtonGroup?.add(buttonText6);
    this.choiceButtonGroup?.add(buttonImage7);
    this.choiceButtonGroup?.add(buttonText7);
    this.choiceButtonGroup?.add(buttonImage8);
    this.choiceButtonGroup?.add(buttonText8);
  }

  private completeSale(soldItem: any, salePrice: number) {
    console.log(
      `✅ ${
        soldItem.name
      }을(를) ${salePrice.toLocaleString()} 코인에 판매했습니다!`
    );

    this.money += salePrice;
    if (this.moneyText) {
      this.moneyText.setText(`💰 ${this.money.toLocaleString()} 코인`);
    }

    this.inventory = this.inventory.filter((item) => item.id !== soldItem.id);

    this.saveGameState();

    console.log(`📦 남은 인벤토리:`, this.inventory);

    this.handleItemSale(soldItem, salePrice);

    this.spawnNextCustomer();
  }

  private spawnNextCustomer() {
    this.cleanupUI();

    const hasInventoryItems = this.inventory.length > 0;

    if (hasInventoryItems && Math.random() < 0.4) {
      this.spawnBuyer();
    } else {
      this.spawnRandomCustomer();
    }
  }

  private openItemPurchaseModal(
    item: any,
    price: number,
    originalPrice: number
  ) {
    if (this.modalContainer) return;

    this.modalContainer = document.createElement("div");
    this.modalContainer.id = "item-purchase-modal";
    document.body.appendChild(this.modalContainer);

    this.modalRoot = createRoot(this.modalContainer);
    this.modalRoot.render(
      <ItemPurchaseModal
        item={item}
        purchasePrice={price}
        originalPrice={originalPrice}
        onClose={this.closeItemPurchaseModal.bind(this)}
      />
    );
  }

  private closeItemPurchaseModal() {
    if (this.modalContainer && this.modalRoot) {
      this.modalRoot.unmount();
      document.body.removeChild(this.modalContainer);
      this.modalContainer = null;
      this.modalRoot = null;
    }
  }
}
