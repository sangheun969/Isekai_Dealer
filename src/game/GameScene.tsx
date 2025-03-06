import Phaser from "phaser";
import ItemStatus from "../components/templates/ItemStatus";
import itemInfo from "../components/organisms/itemInfo";
import SetUpBar from "../components/templates/SetUpBar";
import ItemList from "../components/templates/ItemList";
import { createRoot, Root } from "react-dom/client";
import React from "react";
import { saveGameProgress } from "../utils/apiService";
import PersonalityModal from "../components/templates/PersonalityModal";

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
    this.load.image("reinputIcon", "/images/icon/icon1.png");

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

  private cleanupUI() {
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
    this.customer.setScale(0.6).setDepth(4).setOrigin(0.5, 1);

    if (this.currentItemData) {
      console.log("📦 현재 아이템 데이터:", this.currentItemData);
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

    const { buttonGraphics, buttonText } = this.createButton(
      width / 4,
      height / 1.8,
      "어떻게 하고 싶으시죠?",
      () => {
        this.clearChoiceButtons();
        this.updateSpeechAndButtons();
      }
    );

    this.choiceButtonGroup.add(buttonGraphics);
    this.choiceButtonGroup.add(buttonText);

    const { buttonGraphics: cancelButton, buttonText: cancelText } =
      this.createButton(width / 4, height / 1.8 + 60, "관심 없어요", () => {
        this.clearChoiceButtons();
        this.spawnRandomCustomer();
      });

    this.choiceButtonGroup.add(cancelButton);
    this.choiceButtonGroup.add(cancelText);
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
    const { width, height } = this.scale;

    console.log("🔄 아이템 로드 시작:", itemData);

    if (this.currentItem) this.currentItem.destroy();

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

    const { buttonGraphics: newButton1, buttonText: newText1 } =
      this.createButton(width / 4, height / 1.8, "좋습니다.", () => {
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
        height / 1.8 + 60,
        "이러시면 저희 남는게 없어요..",
        () => {
          newButton2.destroy();
          newText2.destroy();

          const createInputField = (defaultValue = "") => {
            const inputElement = document.createElement("input");
            inputElement.type = "text";
            inputElement.placeholder = "가격을 입력하세요...";
            inputElement.value = defaultValue;
            inputElement.style.position = "absolute";
            inputElement.style.left = `${width / 4 - 100}px`;
            inputElement.style.top = `${height / 1.8 + 50}px`;
            inputElement.style.width = "200px";
            inputElement.style.height = "30px";
            inputElement.style.fontSize = "16px";
            inputElement.style.padding = "5px";
            inputElement.style.border = "1px solid white";
            inputElement.style.background = "black";
            inputElement.style.color = "white";
            inputElement.style.textAlign = "center";

            inputElement.addEventListener("input", (event) => {
              const target = event.target as HTMLInputElement;
              target.value = target.value.replace(/[^0-9]/g, "");
            });

            const confirmButton = document.createElement("button");
            confirmButton.innerText = "확인";
            confirmButton.style.position = "absolute";
            confirmButton.style.left = `${width / 4 + 110}px`;
            confirmButton.style.top = `${height / 1.8 + 50}px`;
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

              const { buttonGraphics: priceButton, buttonText: priceText } =
                this.createButton(
                  width / 4,
                  height / 1.8 + 60,
                  `제안 가격: ${price}코인`,
                  () => {
                    console.log(`제안 가격: ${price}코인`);

                    let minAcceptablePrice = this.suggestedPrice;
                    switch (this.currentClientPersonality) {
                      case "호구":
                        minAcceptablePrice = this.suggestedPrice / 4;
                        break;
                      case "철저한 협상가":
                        minAcceptablePrice = this.suggestedPrice /2;
                        break;
                      case "도둑놈 기질":
                        minAcceptablePrice = this.suggestedPrice /0.8;
                        break;
                      case "부유한 바보":
                        minAcceptablePrice = 0;
                        break;
                      case "초보 수집가":
                        minAcceptablePrice = this.suggestedPrice /4;
                        break;
                      case "화끈한 사람":
                        minAcceptablePrice = this.suggestedPrice /4;
                        break;
                      case "수상한 밀수업자":
                        minAcceptablePrice = this.suggestedPrice /2;
                        break;
                    }

                    let responseText = `"${price}코인 이요?"`;

                    if (price >= minAcceptablePrice) {
                      switch (this.currentClientPersonality) {
                        case "철저한 협상가":
                          responseText = "이 정도면 괜찮겠군요.";
                          break;
                        case "도둑놈 기질":
                          responseText = "이런 가격에 판다고요? 개이득!";
                          break;
                        case "부유한 바보":
                          responseText =
                            "오! 좋아요, 아무 가격이나 괜찮습니다!";
                          break;
                        case "초보 수집가":
                          responseText = "이게 적정 가격일까요? 잘 모르겠네요.";
                          break;
                        case "화끈한 사람":
                          responseText = "좋아! 바로 거래합시다!";
                          break;
                        case "수상한 밀수업자":
                          responseText =
                            "이 가격이면 나도 남는 게 없군. 거래하지.";
                          break;
                      }
                    } else {
                      switch (this.currentClientPersonality) {
                        case "호구":
                          responseText = "음... 그 정도 바보 아닙니다.";
                          break;
                        case "철저한 협상가":
                          responseText =
                            "이 가격은 말도 안 됩니다! 다시 생각해 보세요.";
                          break;
                        case "도둑놈 기질":
                          responseText =
                            "바가지 씌우려고 했는데, 안 넘어가시네...";
                          break;
                        case "부유한 바보":
                          responseText = "이 가격은 좀 너무 낮은 것 같네요.";
                          break;
                        case "초보 수집가":
                          responseText =
                            "이 가격이 적정한지 모르겠어요... 조금 더 주세요!";
                          break;
                        case "화끈한 사람":
                          responseText = "흥! 이렇게 나오시겠다?";
                          break;
                        case "수상한 밀수업자":
                          responseText = "이 가격은 너무 낮군.";
                          break;
                      }
                    }

                    if (this.speechText) {
                      this.speechText.setText(responseText);
                    }

                    if (
                      responseText === "음... 그 정도 바보 아닙니다." ||
                      responseText ===
                        "이 가격은 말도 안 됩니다! 다시 생각해 보세요." ||
                      responseText === "이 가격은 좀 너무 낮은 것 같네요." ||
                      responseText ===
                        "이 가격이 적정한지 모르겠어요... 조금 더 주세요!" ||
                      responseText === "흥! 이렇게 나오시겠다?" ||
                      responseText === "이 가격은 너무 낮군."
                    ) {
                      return;
                    }

                    priceButton.destroy();
                    priceText.destroy();
                    newButton1.destroy();
                    newText1.destroy();
                    if (reinputButton) {
                      reinputButton.destroy();
                    }

                    const { buttonGraphics: yesButton, buttonText: yesText } =
                      this.createButton(
                        width / 4,
                        height / 1.8 + 60,
                        "예",
                        () => {
                          if (this.speechText) {
                            this.speechText.setText("음..알겠습니다.");
                          }

                          yesButton.destroy();
                          yesText.destroy();
                          const {
                            buttonGraphics: newButton1,
                            buttonText: newText1,
                          } = this.createButton(
                            width / 4,
                            height / 1.8,
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
                                      this.selectedItemKey?.replace("item", "")
                                    )
                                );
                                if (item) {
                                  this.inventory.push({
                                    ...item,
                                    price: finalPrice,
                                  });
                                  console.log("📦 인벤토리에 추가됨:", item);
                                }

                                this.cleanupUI();
                                this.spawnRandomCustomer();
                              } else {
                                console.warn("잔액 부족! 거래할 수 없습니다.");
                                if (this.speechText) {
                                  this.speechText.setText(
                                    "잔액이 부족합니다. 거래할 수 없습니다."
                                  );
                                }
                              }
                            }
                          );

                          this.choiceButtonGroup?.add(newButton1);
                          this.choiceButtonGroup?.add(newText1);
                        }
                      );

                    this.choiceButtonGroup?.add(yesButton);
                    this.choiceButtonGroup?.add(yesText);
                  }
                );

              const reinputButton = this.add
                .image(width / 4 + 170, height / 1.8 + 60, "reinputIcon")
                .setScale(0.1)
                .setDepth(8)
                .setInteractive();

              reinputButton.on("pointerdown", () => {
                console.log("재입력 버튼 클릭됨");

                priceButton.destroy();
                priceText.destroy();
                reinputButton.destroy();

                createInputField(String(price));
              });

              this.choiceButtonGroup?.add(priceButton);
              this.choiceButtonGroup?.add(priceText);
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

    this.choiceButtonGroup?.add(newButton1);
    this.choiceButtonGroup?.add(newText1);
    this.choiceButtonGroup?.add(newButton2);
    this.choiceButtonGroup?.add(newText2);
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
}
