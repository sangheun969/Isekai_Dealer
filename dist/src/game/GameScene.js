"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const phaser_1 = __importDefault(require("phaser"));
const ItemStatus_1 = __importDefault(require("../components/templates/ItemStatus"));
const itemInfo_1 = __importDefault(require("../components/organisms/itemInfo"));
const SetUpBar_1 = __importDefault(require("../components/templates/SetUpBar"));
const ItemList_1 = __importDefault(require("../components/templates/ItemList"));
const client_1 = require("react-dom/client");
const apiService_1 = require("../utils/apiService");
const EndOfDayModalProps_1 = __importDefault(require("../components/templates/EndOfDayModalProps"));
const ItemPurchaseModal_1 = __importDefault(require("../components/organisms/ItemPurchaseModal"));
const PersonalityModal_1 = __importDefault(require("../components/templates/PersonalityModal"));
const PetListModal_1 = __importDefault(require("../components/templates/PetListModal"));
const priceEvaluation_1 = require("../components/templates/priceEvaluation");
class GameScene extends phaser_1.default.Scene {
    background = null;
    dialogueBox = null;
    currentItem = null;
    speechBubble = null;
    speechBubble2 = null;
    money = 100000;
    moneyText = null;
    customer = null;
    speechText = null;
    currentItemStatus = null;
    currentItemKey = null;
    choiceButton1 = null;
    choiceButtonText1 = null;
    choiceButtonGroup = null;
    selectedItemKey = null;
    isSetupBarOpen = false;
    suggestedPrice = 0;
    itemDisplayGroup = null;
    petImage;
    isCatImageToggled = false;
    itemListRoot = null;
    setupBarRoot = null;
    currentCustomerId = null;
    currentClientPersonality = null;
    personalityModalRoot = null;
    isPersonalityModalOpen = false;
    currentClientGreedLevel = 1;
    currentItemData = null;
    lastClientPrice = 0;
    price;
    buttonText5;
    setModalState = null;
    reactContext = null;
    modalContainer = null;
    modalRoot = null;
    currentClient = null;
    moneyImage = null;
    reinputButton = null;
    selectedItem = null;
    purchasePrice = 0;
    negotiationAttempts = 0;
    maxNegotiationAttempts = 0;
    dailyClientCount = 0;
    todayPurchaseAmount = 0;
    todaySalesAmount = 0;
    todayPurchaseCount = 0;
    todaySalesCount = 0;
    dailyClientText = null;
    modalOpen = false;
    petListRoot = null;
    tableImage;
    standImage;
    saveText;
    client;
    speechBubble8;
    speechBubble9;
    buttonImage6;
    buttonText6;
    buttonImage7;
    buttonText7;
    yesButton;
    yesText;
    petList = [];
    petListButton = null;
    selectedPet = this.petList[0];
    inventory = [];
    list1 = null;
    personalities = [
        "호구",
        "철저한 협상가",
        "도둑놈 기질",
        "초보 수집가",
        "화끈한 사람",
        "부유한 바보",
        "수상한 밀수업자",
    ];
    getMoney() {
        return this.money;
    }
    getInventory() {
        return this.inventory;
    }
    setDailyClientCount(value) {
        this.dailyClientCount = value;
        if (this.dailyClientText) {
            this.dailyClientText.setText(`${this.dailyClientCount}명/8`);
        }
    }
    resetCustomerData() {
        this.currentCustomerId = null;
        this.currentClientPersonality = null;
        this.currentItemData = null;
    }
    spawnNewCustomer() {
        this.spawnRandomCustomer();
    }
    constructor() {
        super({ key: "GameScene" });
        this.price = 0;
        this.buttonText5 = null;
        this.inventory = [];
        this.money = 0;
    }
    async saveGameState() {
        try {
            await (0, apiService_1.saveGameProgress)(this.money, this.inventory, this.petList, {
                personality: this.currentClientPersonality,
                item: this.currentItemData,
            });
            if (this.moneyText) {
                this.moneyText.setText(`💰 ${this.money.toLocaleString()} 코인`);
            }
        }
        catch (error) {
            console.error("❌ 게임 데이터 저장 실패:", error);
        }
    }
    handleNewSuggestedPrice(newSuggestedPrice) {
        this.price = newSuggestedPrice;
        if (this.buttonText5) {
            this.buttonText5.setText(`제안 가격: ${this.price}코인`);
        }
        else {
            console.warn("🚨 this.buttonText5가 존재하지 않아 setText를 실행할 수 없습니다.");
        }
    }
    registerReactContext(reactComponent) {
        this.reactContext = reactComponent;
        this.setModalState = (isOpen, item, price) => {
            if (this.reactContext) {
                this.reactContext.setState({
                    isModalOpen: isOpen,
                    modalItem: item || null,
                    modalPrice: price || null,
                });
            }
            else {
                console.warn("❌ this.reactContext가 설정되지 않음!");
            }
        };
    }
    someLogicToCalculateNewPrice() {
        const calculatedPrice = Math.floor(this.suggestedPrice * 0.9);
        return calculatedPrice;
    }
    setGameData(money, inventory, petList) {
        console.log("🔄 [GameScene] 게임 데이터 설정 중...");
        this.money = money;
        this.inventory = inventory;
        this.petList = petList || [];
        console.log("✅ [GameScene] 게임 데이터 설정 완료:", {
            money: this.money,
            inventory: this.inventory,
            petList: this.petList,
        });
        this.updateUI();
    }
    init(data) {
        if (data.savedData) {
            this.money = data.savedData.money;
            this.inventory = data.savedData.items;
            this.dailyClientCount = 1;
            if (data.savedData.customer) {
                this.currentCustomerId = data.savedData.customer.customerId;
                this.currentClientPersonality = data.savedData.customer.personality;
                this.currentItemData = data.savedData.customer.item;
            }
            else {
                this.spawnRandomCustomer();
            }
        }
    }
    preload() {
        this.load.image("pawnShopBackground3", "/images/background/storeBg5.png");
        this.load.image("table2", "/images/background/table2.png");
        this.load.image("stand2", "/images/background/stand2.png");
        this.load.image("list4", "/images/background/list4.png");
        this.load.image("petList", "/images/background/animalList.png");
        this.load.image("speechBubble9", "/images/background/speechBubble9.png");
        this.load.image("speechBubble6", "/images/background/speechBubble6.png");
        this.load.image("speechBubble8", "/images/background/speechBubble8.png");
        this.load.image("coin", "/images/background/myCoin.png");
        this.load.audio("buttonClick", "/audios/Button1.mp3");
        this.load.image("cat1", "/images/main/cat1.png");
        this.load.image("reinputIcon", "/images/icon/icon1.png");
        this.load.image("amountPaid1", "/images/items/moneyCoin2.png");
        this.load.image("amountPaid2", "/images/items/moneyCoin4.png");
        this.load.image("reinputPrice", "/images/background/reinputPrice.png");
        this.load.image("statsImg2", "/images/background/statsImg2.png");
        this.cameras.main.setBackgroundColor("#000000");
        for (let i = 1; i <= 16; i++) {
            this.load.image(`client${i}`, `/images/npc/client${i}.png`);
        }
    }
    async create() {
        const storyScene = this.scene.get("StoryScene");
        if (storyScene && storyScene.scene.isActive()) {
            this.scene.stop("StoryScene");
        }
        try {
            const gameData = await (0, apiService_1.loadGameProgress)();
            if (gameData) {
                this.money = gameData.money;
                this.inventory = gameData.items;
                this.currentCustomerId = gameData.customerData?.customerId || null;
                this.currentClientPersonality =
                    gameData.customerData?.personality || null;
                this.currentItemData = gameData.customerData?.item || null;
            }
            else {
                console.warn("⚠️ 저장된 게임 데이터가 없음. 기본값 사용.");
            }
        }
        catch (error) {
            console.error("❌ 게임 데이터 불러오기 실패:", error);
        }
        this.choiceButtonGroup = this.add.group();
        this.itemDisplayGroup = this.add.group();
        this.updateUI();
        const hasInventoryItems = this.inventory.length > 0;
        if (hasInventoryItems && Math.random() < 0.4) {
            this.spawnBuyer();
        }
        else {
            this.spawnRandomCustomer();
        }
        this.input.keyboard?.on("keydown-ESC", this.openSetupBar, this);
        this.events.on("getPlayerMoney", (callback) => {
            callback(this.money);
        });
        this.events.on("updatePlayerMoney", async (newMoney) => {
            this.money = newMoney;
            this.moneyText?.setText(`💰 ${this.money.toLocaleString()} 코인`);
            console.log("💾 [GameScene] 업데이트된 자산 저장:", this.money);
            await (0, apiService_1.saveGameProgress)(this.money, this.inventory, this.petList, {
                customerId: this.currentCustomerId,
                personality: this.currentClientPersonality,
                item: this.currentItemData,
            });
        });
        this.events.on("addNewPet", (pet) => {
            this.addPet(pet);
        });
    }
    createMoneyText() {
        this.moneyText = this.add.text(50, 50, `💰 ${this.money.toLocaleString()} 코인`, {
            fontSize: "32px",
            color: "#ffffff",
        });
    }
    createDailyClientText() {
        this.dailyClientText = this.add.text(200, 50, `${this.dailyClientCount}명/8`, {
            fontSize: "32px",
            color: "#ffffff",
        });
    }
    updateUI() {
        if (!this.cameras || !this.cameras.main) {
            console.warn("🚨 [GameScene] cameras.main이 없어서 새로 추가합니다.");
            this.cameras.main = this.cameras.add(0, 0, 1920, 1080);
        }
        console.log("🔄 [GameScene] updateUI 실행. 현재 화면 크기:", this.scale.width, this.scale.height);
        if (!this.moneyText || !this.moneyText.active || !this.moneyText.setText) {
            console.warn("⚠️ moneyText가 존재하지 않거나 destroy됨. UI를 다시 생성합니다.");
            this.createMoneyText();
        }
        this.moneyText?.setText(`💰 ${this.money.toLocaleString()} 코인`);
        if (!this.dailyClientText || this.dailyClientText) {
            console.warn("⚠️ dailyClientText가 존재하지 않거나 destroy됨. UI를 다시 생성합니다.");
            this.createDailyClientText();
        }
        this.dailyClientText?.setText(`${this.dailyClientCount}명/8`);
        if (this.petList.length > 0) {
            console.log("🐾 펫 리스트 복구:", this.petList);
            this.selectedPet = this.petList[0];
        }
        else {
            console.warn("⚠️ 보유한 펫이 없음.");
            this.selectedPet = { id: 0, name: "기본 고양이", image: "cat1" };
        }
        if (this.petImage && this.selectedPet?.image) {
            this.petImage.setTexture(this.selectedPet.image);
        }
        else {
            console.warn("❌ petImage 또는 selectedPet.image가 존재하지 않습니다!", this.petImage, this.selectedPet);
        }
        if (!this.petImage) {
            this.petImage = this.add.image(100, 100, "defaultPet");
        }
        if (!this.selectedPet || !this.selectedPet.image) {
            this.selectedPet = { id: 0, name: "기본 고양이", image: "cat1" };
        }
        if (!this.textures.exists(this.selectedPet.image)) {
            this.selectedPet.image = "cat1";
        }
        const { width, height } = this.scale;
        this.background = this.add
            .image(0, 0, "pawnShopBackground3")
            .setOrigin(0, 0)
            .setDisplaySize(width, height);
        this.tableImage = this.add
            .image(width / 2, height, "table2")
            .setDisplaySize(width, height)
            .setDepth(5)
            .setOrigin(0.5, 0.5);
        this.standImage = this.add
            .image(width / 2, height - 90, "stand2")
            .setDisplaySize(width, height)
            .setScale(0.6)
            .setDepth(6)
            .setOrigin(0.5, 0.5);
        this.saveText = this.add
            .text(width - 10, 90, "💾 저장", {
            fontSize: "32px",
            color: "#fff",
            padding: { left: 10, right: 10, top: 5, bottom: 5 },
        })
            .setInteractive()
            .setDepth(10)
            .setOrigin(1, 0)
            .on("pointerdown", async () => {
            console.log("💾 게임 데이터 저장 중...");
            await (0, apiService_1.saveGameProgress)(this.money, this.inventory, this.petList);
            console.log("✅ 게임 저장 완료!");
        });
        this.moneyText = this.add
            .text(width - 10, 50, `💰 ${this.money.toLocaleString()} 코인`, {
            fontSize: "32px",
            color: "#fff",
            padding: { left: 10, right: 10, top: 5, bottom: 5 },
        })
            .setDepth(10)
            .setOrigin(1, 0);
        this.dailyClientText = this.add
            .text(width - 140, 90, `${this.dailyClientCount}명/8`, {
            fontSize: "28px",
            color: "#fff",
            padding: { left: 10, right: 10, top: 5, bottom: 5 },
        })
            .setDepth(10)
            .setOrigin(1, 0);
        this.petListButton = this.add
            .image(width - 40, 150, "petList")
            .setScale(0.2)
            .setDepth(6)
            .setOrigin(1, 0)
            .setInteractive();
        this.petListButton.on("pointerdown", () => {
            console.log("🐾 PetListModal 열기!");
            this.showPetListModal();
        });
        this.list1 = this.add
            .image(width * 0.1, height * 0.85, "list4")
            .setScale(0.5)
            .setDepth(6)
            .setOrigin(0.3, 0.5)
            .setInteractive();
        this.list1.on("pointerdown", () => {
            this.openItemList();
        });
        if (!this.selectedPet) {
            this.selectedPet = {
                id: 0,
                name: "기본 고양이",
                image: "cat1",
            };
        }
        this.petImage = this.add
            .image(width - 150, height - 100, this.selectedPet.image)
            .setScale(0.3)
            .setDepth(10)
            .setInteractive();
        this.petImage.on("pointerdown", () => this.toggleCatImage());
    }
    incrementDailyClientCount() {
        this.dailyClientCount++;
        if (this.dailyClientCount > 8) {
            this.dailyClientCount = 1;
            this.showEndOfDayModal();
        }
        if (this.dailyClientText) {
            this.dailyClientText.setText(`${this.dailyClientCount}명/8`);
        }
        else {
            console.warn("⚠️ dailyClientText가 존재하지 않아 업데이트할 수 없습니다.");
        }
    }
    cleanupUI() {
        if (!this.choiceButtonGroup) {
            console.warn("⚠️ [cleanupUI] choiceButtonGroup이 없음. 새로 생성합니다.");
            this.choiceButtonGroup = this.add.group();
            return;
        }
        if (this.choiceButtonGroup) {
            const children = this.choiceButtonGroup.getChildren();
            if (Array.isArray(children) && children.length > 0) {
                children.forEach((child) => {
                    if (child instanceof phaser_1.default.GameObjects.Image ||
                        child instanceof phaser_1.default.GameObjects.Text) {
                        child.setAlpha(0);
                    }
                });
                if (this.choiceButtonGroup.clear) {
                    this.choiceButtonGroup.clear(true, true);
                }
            }
        }
        if (this.choiceButtonGroup) {
            this.choiceButtonGroup.setVisible(false);
        }
        if (this.currentItem) {
            this.currentItem.setAlpha(0);
            this.currentItem = null;
        }
        this.selectedItemKey = null;
        if (this.customer) {
            this.customer.setAlpha(0);
            this.customer = null;
        }
        if (this.speechBubble) {
            this.speechBubble.setAlpha(0);
            this.speechBubble = null;
        }
        if (this.speechText) {
            this.speechText.setAlpha(0);
            this.speechText = null;
        }
    }
    openItemList() {
        if (document.getElementById("item-list-modal"))
            return;
        this.input.enabled = false;
        const modalContainer = document.createElement("div");
        modalContainer.id = "item-list-modal";
        document.body.appendChild(modalContainer);
        const closeItemList = () => {
            this.closeItemList();
        };
        if (!this.itemListRoot) {
            this.itemListRoot = (0, client_1.createRoot)(modalContainer);
        }
        this.itemListRoot.render((0, jsx_runtime_1.jsx)(ItemList_1.default, { inventory: this.inventory, itemsPerPage: 3, onClose: closeItemList }));
    }
    closeItemList() {
        const modalContainer = document.getElementById("item-list-modal");
        if (modalContainer && this.itemListRoot) {
            this.itemListRoot.unmount();
            this.itemListRoot = null;
            document.body.removeChild(modalContainer);
        }
        this.input.enabled = true;
    }
    openSetupBar() {
        if (this.isSetupBarOpen)
            return;
        this.isSetupBarOpen = true;
        const modalContainer = document.createElement("div");
        modalContainer.id = "setup-bar-modal";
        document.body.appendChild(modalContainer);
        const closeSetupBar = () => {
            this.isSetupBarOpen = false;
            this.closeSetupBar();
        };
        if (!this.setupBarRoot) {
            this.setupBarRoot = (0, client_1.createRoot)(modalContainer);
        }
        this.setupBarRoot.render((0, jsx_runtime_1.jsx)(SetUpBar_1.default, { onClose: closeSetupBar, scene: this }));
    }
    closeSetupBar() {
        const modalContainer = document.getElementById("setup-bar-modal");
        if (modalContainer && this.setupBarRoot) {
            this.setupBarRoot.unmount();
            this.setupBarRoot = null;
            document.body.removeChild(modalContainer);
        }
    }
    createImageButtonWithText(x, y, imageKey, text, callback) {
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
            let effectSound = this.registry.get("buttonClick");
            if (!effectSound) {
                effectSound = this.sound.add("buttonClick", { volume: 0.5 });
                this.registry.set("buttonClick", effectSound);
            }
            effectSound.play();
            callback();
        });
        return { buttonImage, buttonText };
    }
    clearClientUI() {
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
    spawnRandomCustomer() {
        const { width, height } = this.scale;
        this.clearClientUI();
        if (!this.choiceButtonGroup) {
            console.warn("⚠️ [spawnRandomCustomer] choiceButtonGroup이 없어 새로 생성합니다.");
            this.choiceButtonGroup = this.add.group();
        }
        else {
            const children = this.choiceButtonGroup.getChildren();
            if (Array.isArray(children) && children.length > 0) {
                children.forEach((child) => {
                    if (child && child.destroy) {
                        child.destroy();
                    }
                });
                this.choiceButtonGroup.clear(true, true);
            }
        }
        this.cleanupUI();
        this.currentCustomerId = phaser_1.default.Math.Between(1, 8);
        this.currentItemData = phaser_1.default.Math.RND.pick(itemInfo_1.default);
        this.currentClientPersonality = phaser_1.default.Math.RND.pick(this.personalities);
        this.currentClientGreedLevel = this.getRandomGreedLevel();
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
                Math.floor(phaser_1.default.Math.Between(minPrice, maxPrice) / 100) * 100;
        }
        this.speechBubble = this.add
            .image(width / 3.6, height / 3 - 25, "speechBubble9")
            .setScale(0.6)
            .setDepth(3)
            .setAlpha(1);
        this.speechBubble.setDisplaySize(this.speechBubble.width * 0.6, this.speechBubble.height * 0.3);
        const greetingTexts = [
            "이 물건을 좀 봐주게",
            "이 물건을 보여드릴게요",
            "좋은 물건을 가지고 왔네",
            "이건 꼭 보셔야 해요!",
            "이거 흥미로울 겁니다.",
        ];
        const randomGreeting = greetingTexts[Math.floor(Math.random() * greetingTexts.length)];
        this.speechText = this.add
            .text(width / 3.6, height / 3 - 40, randomGreeting, {
            fontFamily: "Arial",
            fontSize: "22px",
            color: "#ffffff",
            wordWrap: { width: this.speechBubble.displayWidth * 0.7 },
            align: "center",
        })
            .setOrigin(0.5)
            .setDepth(7);
        this.incrementDailyClientCount();
        this.clearChoiceButtons();
        const { buttonImage: buttonImage1, buttonText: buttonText1 } = this.createImageButtonWithText(width / 3.6, height / 1.5 - 100, "speechBubble8", "어떻게 하고 싶으시죠?", () => {
            this.clearChoiceButtons();
            this.updateSpeechAndButtons();
        });
        const { buttonImage: buttonImage2, buttonText: buttonText2 } = this.createImageButtonWithText(width / 3.6, height / 1.5, "speechBubble8", "관심 없어요", () => {
            this.clearChoiceButtons();
            this.clearClientUI();
            const hasInventoryItems = this.inventory.length > 0;
            if (hasInventoryItems && Math.random() < 0.4) {
                this.spawnBuyer();
            }
            else {
                this.spawnRandomCustomer();
            }
        });
        this.choiceButtonGroup.add(buttonImage1);
        this.choiceButtonGroup.add(buttonText1);
        this.choiceButtonGroup.add(buttonImage2);
        this.choiceButtonGroup.add(buttonText2);
    }
    clearChoiceButtons() {
        if (this.choiceButtonGroup) {
            this.choiceButtonGroup.getChildren().forEach((child) => {
                if (child instanceof phaser_1.default.GameObjects.Text ||
                    child instanceof phaser_1.default.GameObjects.Graphics) {
                    child.destroy();
                }
            });
            this.choiceButtonGroup.clear(true, true);
        }
    }
    loadItem(itemData) {
        if (this.currentItem) {
            console.log(`🗑️ 이전 아이템 (${this.currentItemKey}) 제거`);
            this.currentItem.destroy();
            this.currentItem = null;
            this.currentItemKey = null;
        }
        const itemKey = `item${itemData.id}`;
        if (this.currentItemKey === itemKey) {
            console.warn(`⚠️ 중복 아이템 (${itemKey}) 로드 방지`);
            return;
        }
        if (!this.textures.exists(itemKey)) {
            this.load.image(itemKey, itemData.image);
            this.load.once("complete", () => {
                this.createItemDisplay(itemKey);
            });
            this.load.start();
        }
        else {
            this.createItemDisplay(itemKey);
        }
    }
    createItemDisplay(itemKey) {
        const { width, height } = this.scale;
        this.currentItem = this.add.image(width / 2, height / 1.2, itemKey);
        this.currentItem.setScale(0.7).setDepth(6).setOrigin(0.5, 0.5);
        this.currentItem.setInteractive();
        this.selectedItemKey = itemKey;
        this.currentItem.on("pointerover", () => this.currentItem?.setTint(0xdddddd));
        this.currentItem.on("pointerout", () => this.currentItem?.clearTint());
        this.currentItem.on("pointerdown", () => {
            let effectSound = this.registry.get("buttonClick");
            if (!effectSound) {
                effectSound = this.sound.add("buttonClick", { volume: 0.5 });
                this.registry.set("buttonClick", effectSound);
            }
            effectSound.play();
            this.selectedItemKey = itemKey;
            const item = itemInfo_1.default.find((i) => `item${i.id}` === itemKey);
            if (item) {
                this.toggleItemStatus(item);
            }
            else {
                console.warn(`🚨 아이템 정보를 찾을 수 없습니다: ${itemKey}`);
            }
        });
    }
    updateSpeechAndButtons() {
        const { width, height } = this.scale;
        this.clearChoiceButtons();
        if (this.speechText) {
            this.speechText.setText(`💰${this.suggestedPrice.toLocaleString()}코인에 팔고 싶습니다.`);
        }
        this.negotiationAttempts = Math.floor(Math.random() * 2) + 2;
        console.log(`🔄 새로운 고객 등장! 협상 가능 횟수: ${this.negotiationAttempts}`);
        const { buttonImage: buttonImage3, buttonText: buttonText3 } = this.createImageButtonWithText(width / 3.6, height / 1.5 - 100, "speechBubble8", "좋습니다.", () => {
            if (!this.selectedItemKey) {
                console.warn("🚨 아이템이 선택되지 않았습니다.");
                return;
            }
            if (this.money >= this.suggestedPrice) {
                this.money -= this.suggestedPrice;
                this.todayPurchaseAmount += this.suggestedPrice;
                this.todayPurchaseCount++;
                if (this.moneyText) {
                    this.moneyText.setText(`💰 ${this.money.toLocaleString()} 코인`);
                }
                const item = itemInfo_1.default.find((i) => i.id === Number(this.selectedItemKey?.replace("item", "")));
                if (item) {
                    this.inventory.push({ ...item, price: this.suggestedPrice });
                }
                this.cleanupUI();
                const hasInventoryItems = this.inventory.length > 0;
                if (hasInventoryItems && Math.random() < 0.5) {
                    console.log("🛒 새로운 고객이 등장합니다: 아이템 구매자");
                    this.spawnBuyer();
                }
                else {
                    console.log("🛍️ 새로운 고객이 등장합니다: 아이템 판매자");
                    this.spawnRandomCustomer();
                }
            }
            else {
                console.warn("잔액 부족! 거래할 수 없습니다.");
                if (this.speechText) {
                    this.speechText.setText("잔액이 부족합니다. 거래할 수 없습니다.");
                }
            }
        });
        const { buttonImage: buttonImage4, buttonText: buttonText4 } = this.createImageButtonWithText(width / 3.6, height / 1.5, "speechBubble8", "음..이 가격은 어떨까요?", () => {
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
                inputElement.style.width = "350px";
                inputElement.style.height = "80px";
                inputElement.style.fontSize = "24px";
                inputElement.style.padding = "5px";
                inputElement.style.border = "1px solid white";
                inputElement.style.background = "transparent";
                inputElement.style.color = "white";
                inputElement.style.textAlign = "center";
                inputElement.style.outline = "none";
                inputElement.addEventListener("input", (event) => {
                    const target = event.target;
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
                    if (isNaN(price))
                        return;
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
                        buttonImage5.destroy();
                        buttonText5.destroy();
                        reinputButton.setVisible(false);
                        inputBg.setVisible(false);
                        createInputField(String(price));
                    });
                    let negotiationAttempts = 0;
                    let minAcceptablePrice = (0, priceEvaluation_1.getMinAcceptablePrice)(this.suggestedPrice, this.currentClientPersonality);
                    const { buttonImage: buttonImage5, buttonText: buttonText5 } = this.createImageButtonWithText(width / 3.6, height / 1.5, "speechBubble8", `제안 가격: ${price}코인`, () => {
                        let { response: responseText } = (0, priceEvaluation_1.getResponseText)(price, minAcceptablePrice, this.currentClientPersonality, this.suggestedPrice);
                        if (this.speechText) {
                            this.speechText.setText(responseText);
                        }
                        if (buttonImage3 && buttonText3) {
                            buttonImage3.setVisible(false);
                            buttonText3.setVisible(false);
                        }
                        const newSuggestedPrice = this.someLogicToCalculateNewPrice();
                        this.handleNewSuggestedPrice(newSuggestedPrice);
                        if (this.buttonText5) {
                            this.buttonText5.setText(`제안 가격: ${this.price}코인`);
                        }
                        else {
                            console.warn("🚨 this.buttonText5가 null이므로 setText 실행 불가");
                        }
                        if (price >= minAcceptablePrice ||
                            price === newSuggestedPrice) {
                            buttonImage5.destroy();
                            buttonText5.destroy();
                            if (reinputButton) {
                                reinputButton.setVisible(false);
                            }
                            const { buttonImage: yesButton, buttonText: yesText } = this.createImageButtonWithText(width / 3.6, height / 1.5, "speechBubble8", "예", () => {
                                if (this.speechText) {
                                    this.speechText.setText("음..알겠습니다.");
                                }
                                yesButton.destroy();
                                yesText.destroy();
                                const { buttonImage: confirmButton, buttonText: confirmText, } = this.createImageButtonWithText(width / 3.6, height / 1.5, "speechBubble8", "좋습니다.", () => {
                                    if (!this.selectedItemKey) {
                                        console.warn("🚨 아이템이 선택되지 않았습니다.");
                                        return;
                                    }
                                    const finalPrice = Number(price);
                                    this.todayPurchaseAmount += this.suggestedPrice;
                                    this.todayPurchaseCount++;
                                    if (this.money >= finalPrice) {
                                        this.money -= finalPrice;
                                        console.log(`💰 ${this.money.toLocaleString()} 코인 남음`);
                                        if (this.moneyText) {
                                            this.moneyText.setText(`💰 ${this.money.toLocaleString()} 코인`);
                                        }
                                        const item = itemInfo_1.default.find((i) => i.id ===
                                            Number(this.selectedItemKey?.replace("item", "")));
                                        if (item) {
                                            this.inventory.push({
                                                ...item,
                                                price: finalPrice,
                                            });
                                        }
                                        this.cleanupUI();
                                        const hasInventoryItems = this.inventory.length > 0;
                                        if (hasInventoryItems &&
                                            Math.random() < 0.5) {
                                            this.spawnBuyer();
                                        }
                                        else {
                                            this.spawnRandomCustomer();
                                        }
                                    }
                                    else {
                                        console.warn("잔액 부족! 거래할 수 없습니다.");
                                        if (this.speechText) {
                                            this.speechText.setText("잔액이 부족합니다. 거래할 수 없습니다.");
                                        }
                                    }
                                });
                                this.choiceButtonGroup?.add(confirmButton);
                                this.choiceButtonGroup?.add(confirmText);
                            });
                            this.choiceButtonGroup?.add(yesButton);
                            this.choiceButtonGroup?.add(yesText);
                        }
                        else {
                            if (this.buttonText5) {
                                this.buttonText5.setText(`제안 가격: ${newSuggestedPrice}코인`);
                            }
                        }
                        if (price < minAcceptablePrice) {
                            this.negotiationAttempts--;
                            console.log(`🚨 협상 실패! 남은 시도 횟수: ${this.negotiationAttempts}`);
                            if (this.negotiationAttempts <= 0) {
                                console.log("❌ 최대 협상 횟수 도달! 협상 종료");
                                this.speechText?.setText("그만하죠. 이 가격으로는 거래할 수 없습니다.");
                                const { buttonImage: endButton, buttonText: endText } = this.createImageButtonWithText(width / 3.6, height / 1.5, "speechBubble8", "다음 고객", () => {
                                    endButton.destroy();
                                    endText.destroy();
                                    this.cleanupUI();
                                    const hasInventoryItems = this.inventory.length > 0;
                                    if (hasInventoryItems && Math.random() < 0.4) {
                                        this.spawnBuyer();
                                    }
                                    else {
                                        this.spawnRandomCustomer();
                                    }
                                });
                                if (buttonImage5)
                                    buttonImage5.setVisible(false);
                                if (buttonText5)
                                    buttonText5.setVisible(false);
                                if (reinputButton) {
                                    reinputButton.setVisible(false);
                                }
                                this.choiceButtonGroup?.add(endButton);
                                this.choiceButtonGroup?.add(endText);
                                return;
                            }
                            negotiationAttempts++;
                            if (this.currentClientPersonality === "철저한 협상가") {
                                this.suggestedPrice = Math.floor(this.suggestedPrice * 0.9);
                                responseText = `이 가격은 말도 안 됩니다! 다시 생각해 보세요. 💰${this.suggestedPrice}코인은 어떨까요?`;
                            }
                            else if (this.currentClientPersonality === "도둑놈 기질") {
                                this.suggestedPrice = Math.floor(this.suggestedPrice * 0.8);
                                responseText = `너무 비싸요! 💰${this.suggestedPrice}코인이면 거래할게요.`;
                            }
                            else if (this.currentClientPersonality === "초보 수집가") {
                                this.suggestedPrice = Math.floor(this.suggestedPrice * 0.95);
                                responseText = `음... 좀 비싸지만 💰${this.suggestedPrice}코인이라면 괜찮을 것 같아요.`;
                            }
                        }
                    });
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
        });
        this.choiceButtonGroup?.add(buttonImage3);
        this.choiceButtonGroup?.add(buttonText3);
        this.choiceButtonGroup?.add(buttonImage4);
        this.choiceButtonGroup?.add(buttonText4);
    }
    toggleItemStatus(item) {
        if (this.currentItemStatus) {
            this.currentItemStatus.close();
            this.currentItemStatus = null;
        }
        else {
            this.currentItemStatus = new ItemStatus_1.default(this, this.scale.width - 250, this.scale.height / 2, item.id);
        }
    }
    toggleCatImage() {
        if (!this.petImage)
            return;
        if (this.isPersonalityModalOpen) {
            this.closePersonalityModal();
        }
        else {
            this.showClientPersonality();
        }
    }
    getRandomGreedLevel() {
        return phaser_1.default.Math.Between(1, 5);
    }
    showClientPersonality() {
        if (!this.currentClientPersonality || this.isPersonalityModalOpen)
            return;
        if (document.getElementById("personality-modal"))
            return;
        const modalContainer = document.createElement("div");
        modalContainer.id = "personality-modal";
        document.body.appendChild(modalContainer);
        if (!this.personalityModalRoot) {
            this.personalityModalRoot = (0, client_1.createRoot)(modalContainer);
        }
        this.personalityModalRoot.render((0, jsx_runtime_1.jsx)(PersonalityModal_1.default, { personality: this.currentClientPersonality, greedLevel: this.currentClientGreedLevel }));
        setTimeout(() => {
            this.isPersonalityModalOpen = true;
        }, 0);
    }
    closePersonalityModal() {
        const modalContainer = document.getElementById("personality-modal");
        if (modalContainer && this.personalityModalRoot) {
            this.personalityModalRoot.unmount();
            this.personalityModalRoot = null;
            document.body.removeChild(modalContainer);
        }
        this.isPersonalityModalOpen = false;
        this.input.enabled = true;
    }
    spawnBuyer() {
        const { width, height } = this.scale;
        this.clearClientUI();
        this.maxNegotiationAttempts = phaser_1.default.Math.Between(2, 4);
        this.negotiationAttempts = 0;
        if (this.inventory.length === 0) {
            console.warn("📦 인벤토리가 비어 있어 구매자가 등장하지 않음");
            this.spawnRandomCustomer();
            return;
        }
        const clientNumber = Math.floor(Math.random() * 14) + 1;
        this.customer = this.add.image(width / 2, height + 220, `client${clientNumber}`);
        this.customer.setScale(0.7).setDepth(4).setOrigin(0.5, 1);
        this.currentClientGreedLevel = this.getRandomGreedLevel();
        const randomItemIndex = Math.floor(Math.random() * this.inventory.length);
        this.selectedItem = this.inventory[randomItemIndex];
        this.selectedItemKey = `item${this.selectedItem.id}`;
        const originalPrice = this.selectedItem.originalPrice || this.selectedItem.price;
        const purchasePrice = Math.floor(this.selectedItem.price * 1.2);
        this.purchasePrice = purchasePrice;
        this.lastClientPrice = purchasePrice;
        if (this.setModalState) {
            this.setModalState(true, this.selectedItem, purchasePrice);
        }
        const moneyImageKey = purchasePrice <= 10000 ? "amountPaid1" : "amountPaid2";
        this.moneyImage = this.add
            .image(width / 2, height / 1.2, moneyImageKey)
            .setInteractive({ useHandCursor: true })
            .setDepth(6)
            .setScale(0.6)
            .setOrigin(0.5, 0.5);
        this.moneyImage.on("pointerdown", () => {
            this.openItemPurchaseModal(this.selectedItem, purchasePrice, originalPrice);
        });
        this.speechBubble = this.add
            .image(width / 3.6, height / 3 - 25, "speechBubble9")
            .setScale(0.6)
            .setDepth(3)
            .setAlpha(1);
        this.speechBubble.setDisplaySize(this.speechBubble.width * 0.6, this.speechBubble.height * 0.3);
        this.speechText = this.add
            .text(width / 3.6, height / 3 - 40, `이 물건을 사고 싶은데, ${purchasePrice.toLocaleString()} 코인 이정도면 괜찮은가?`, {
            fontSize: "20px",
            color: "#fffafa",
            fontFamily: "Arial",
            align: "center",
            wordWrap: { width: 300 },
        })
            .setOrigin(0.5)
            .setDepth(6);
        this.setupNegotiationButtons(this.speechText.y + 50);
        this.incrementDailyClientCount();
    }
    handleItemSale(soldItem, salePrice) {
        console.log(`✅ ${soldItem.name}을 ${salePrice.toLocaleString()}코인에 판매했습니다!`);
        this.todaySalesAmount += salePrice;
        this.todaySalesCount++;
        this.inventory = this.inventory.filter((item) => item.id !== soldItem.id);
        this.money += salePrice;
        if (this.moneyText) {
            this.moneyText.setText(`💰 ${this.money.toLocaleString()} 코인`);
        }
        this.cleanupBuyerUI();
        this.saveGameState();
    }
    cleanupBuyerUI() {
        if (this.choiceButtonGroup) {
            try {
                if (this.choiceButtonGroup.getChildren().length > 0) {
                    this.choiceButtonGroup.getChildren().forEach((child) => {
                        if (child && child.destroy) {
                            child.destroy();
                        }
                    });
                    this.choiceButtonGroup.clear(true, true);
                }
                this.choiceButtonGroup.destroy(true);
                this.choiceButtonGroup = null;
            }
            catch (error) {
                console.error("❌ [cleanupBuyerUI] choiceButtonGroup 제거 중 오류 발생:", error);
            }
        }
        else {
            console.warn("⚠️ [cleanupBuyerUI] choiceButtonGroup이 이미 존재하지 않음.");
        }
        if (!this.choiceButtonGroup) {
            this.choiceButtonGroup = this.add.group();
            console.log("✅ [cleanupBuyerUI] choiceButtonGroup 새로 생성됨.");
        }
        console.log("✅ [cleanupBuyerUI] 정리 완료");
    }
    createConfirmButtonCallback(confirmedPrice) {
        return () => {
            if (!this.selectedItemKey) {
                console.warn("🚨 아이템이 선택되지 않았습니다.");
                return;
            }
            const itemIndex = this.inventory.findIndex((item) => `item${item.id}` === this.selectedItemKey);
            if (itemIndex === -1) {
                console.warn("🚨 선택한 아이템이 인벤토리에 없습니다.");
                return;
            }
            if (this.moneyImage) {
                this.moneyImage.destroy();
                this.moneyImage = null;
            }
            const soldItem = this.inventory[itemIndex];
            const salePrice = confirmedPrice ?? Math.floor(soldItem.price * 1.2);
            console.log("✅ 최종 판매 가격:", salePrice);
            this.todaySalesAmount += salePrice;
            this.todaySalesCount++;
            this.inventory.splice(itemIndex, 1);
            this.money += salePrice;
            if (this.moneyText) {
                this.moneyText.setText(`💰 ${this.money.toLocaleString()} 코인`);
            }
            this.cleanupUI();
            const hasInventoryItems = this.inventory.length > 0;
            if (hasInventoryItems && Math.random() < 0.4) {
                this.spawnBuyer();
            }
            else {
                this.spawnRandomCustomer();
            }
        };
    }
    setupNegotiationButtons(speechTextY, confirmedPrice) {
        const { width, height } = this.scale;
        const { buttonImage: buttonImage6, buttonText: buttonText6 } = this.createImageButtonWithText(width / 3.6, height / 1.5 - 100, "speechBubble8", "좋습니다.", this.createConfirmButtonCallback(confirmedPrice));
        const { buttonImage: buttonImage7, buttonText: buttonText7 } = this.createImageButtonWithText(width / 3.6, height / 1.5, "speechBubble8", "재협상을 하시죠.", () => {
            this.negotiationAttempts++;
            buttonImage6.setVisible(false);
            buttonText6.setVisible(false);
            buttonImage7.setVisible(false);
            buttonText7.setVisible(false);
            buttonImage8.setVisible(false);
            buttonText8.setVisible(false);
            if (this.negotiationAttempts >= this.maxNegotiationAttempts) {
                if (this.speechText) {
                    const exitMessages = [
                        "크으으으으",
                        "됐어요, 안 살래요!",
                        "더러워서 간다!",
                        "적당히 하쇼!",
                    ];
                    const message = exitMessages[Math.floor(Math.random() * exitMessages.length)];
                    this.speechText.setText(message);
                }
                this.time.delayedCall(1500, () => {
                    this.cleanupBuyerUI();
                    const hasInventoryItems = this.inventory.length > 0;
                    if (hasInventoryItems && Math.random() < 0.4) {
                        this.spawnBuyer();
                    }
                    else {
                        this.spawnRandomCustomer();
                    }
                });
                return;
            }
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
                inputElement.style.left = "50%";
                inputElement.style.top = "50%";
                inputElement.style.transform = "translate(-50%, -50%)";
                inputElement.style.width = "350px";
                inputElement.style.height = "80px";
                inputElement.style.fontSize = "24px";
                inputElement.style.padding = "5px";
                inputElement.style.border = "1px solid white";
                inputElement.style.background = "transparent";
                inputElement.style.color = "white";
                inputElement.style.textAlign = "center";
                inputElement.style.outline = "none";
                document.body.appendChild(inputElement);
                inputElement.focus();
                const warningMessage = document.createElement("div");
                warningMessage.innerText = "협상 가격 이상만 가능합니다";
                warningMessage.style.position = "fixed";
                warningMessage.style.position = "absolute";
                warningMessage.style.opacity = "1";
                warningMessage.style.left = "40%";
                warningMessage.style.top = "10%";
                warningMessage.style.width = "auto";
                warningMessage.style.height = "auto";
                warningMessage.style.fontSize = "32px";
                warningMessage.style.color = "red";
                warningMessage.style.fontWeight = "bold";
                warningMessage.style.background = "rgba(83, 86, 255, 0.7)";
                warningMessage.style.padding = "10px 20px";
                warningMessage.style.borderRadius = "5px";
                warningMessage.style.textAlign = "center";
                warningMessage.style.display = "none";
                document.body.appendChild(warningMessage);
                const confirmButton = document.createElement("button");
                confirmButton.innerText = "확인";
                confirmButton.style.position = "absolute";
                confirmButton.style.left = "50%";
                confirmButton.style.top = "55%";
                confirmButton.style.transform = "translate(-50%, -50%)";
                confirmButton.style.width = "80px";
                confirmButton.style.height = "40px";
                confirmButton.style.fontSize = "14px";
                confirmButton.style.background = "gray";
                confirmButton.style.color = "white";
                confirmButton.style.cursor = "pointer";
                confirmButton.disabled = true;
                document.body.appendChild(confirmButton);
                inputElement.addEventListener("input", (event) => {
                    const target = event.target;
                    target.value = target.value.replace(/[^0-9]/g, "");
                    const price = Number(target.value.trim());
                    if (price >= this.purchasePrice) {
                        warningMessage.style.display = "none";
                        confirmButton.disabled = false;
                        confirmButton.style.background = "green";
                    }
                    else {
                        warningMessage.style.display = "block";
                        confirmButton.disabled = true;
                        confirmButton.style.background = "gray";
                    }
                });
                const purchasePrice = Math.floor(this.selectedItem.price * 1.2);
                this.purchasePrice = purchasePrice;
                confirmButton.addEventListener("click", () => {
                    const price = Number(inputElement.value.trim());
                    if (price < this.purchasePrice) {
                        warningMessage.style.display = "block";
                        if (document.body.contains(warningMessage)) {
                            console.log("✅ warningMessage DOM에 존재함");
                            warningMessage.style.display = "block";
                        }
                        else {
                            console.error("🚨 warningMessage 요소가 존재하지 않습니다!");
                        }
                        setTimeout(() => {
                            console.log("⏳ 2초 후 메시지 제거 체크");
                            if (document.body.contains(warningMessage)) {
                                warningMessage.style.display = "none";
                                console.log("✅ warningMessage 숨김");
                            }
                        }, 2000);
                    }
                    else {
                        if (document.body.contains(inputElement)) {
                            document.body.removeChild(inputElement);
                        }
                        if (document.body.contains(confirmButton)) {
                            document.body.removeChild(confirmButton);
                        }
                        if (document.body.contains(warningMessage)) {
                            document.body.removeChild(warningMessage);
                        }
                        inputBg.setVisible(false);
                        const { buttonImage: yesButton, buttonText: yesText } = this.createImageButtonWithText(width / 3.6, height / 1.5, "speechBubble8", `${price.toLocaleString()}코인에 해드리겠습니다.`, () => {
                            const minPurchasePrice = (0, priceEvaluation_1.getMinPurchasePrice)(this.suggestedPrice, this.currentClientPersonality);
                            const maxMultipliers = {
                                호구: 2.5,
                                "철저한 협상가": 1.2,
                                "도둑놈 기질": 1.5,
                                "부유한 바보": 3.0,
                                "초보 수집가": 1.8,
                                "화끈한 사람": 2.0,
                                "수상한 밀수업자": 1.6,
                            };
                            const personality = this.currentClientPersonality ?? "철저한 협상가";
                            const maxNegotiationPrice = this.suggestedPrice *
                                (maxMultipliers[personality] || 2.0);
                            const { response: negotiationResponse, isFinal, increasedPrice, } = (0, priceEvaluation_1.getPurchaseResponseText)(price, minPurchasePrice, this.currentClientPersonality, this.lastClientPrice, this.suggestedPrice, maxNegotiationPrice);
                            const rejectionMultiplier = phaser_1.default.Math.FloatBetween(3, 4.5);
                            this.yesButton = yesButton;
                            this.yesText = yesText;
                            this.choiceButtonGroup?.add(yesButton);
                            this.choiceButtonGroup?.add(yesText);
                            if (price >= this.lastClientPrice * rejectionMultiplier) {
                                this.yesButton?.destroy();
                                this.yesText?.destroy();
                                if (this.speechText) {
                                    const exitMessages = [
                                        "크으으으으",
                                        "됐어요, 안 살래요!",
                                        "더러워서 간다!",
                                        "적당히 하쇼!",
                                    ];
                                    const message = exitMessages[Math.floor(Math.random() * exitMessages.length)];
                                    this.speechText.setText(message);
                                }
                                this.time.delayedCall(1500, () => {
                                    this.cleanupBuyerUI();
                                    const hasInventoryItems = this.inventory.length > 0;
                                    if (hasInventoryItems && Math.random() < 0.4) {
                                        this.spawnBuyer();
                                    }
                                    else {
                                        this.spawnRandomCustomer();
                                    }
                                });
                                return;
                            }
                            if (this.speechText) {
                                this.speechText.setText(negotiationResponse);
                            }
                            yesButton.destroy();
                            yesText.destroy();
                            if (isFinal) {
                                this.yesButton?.destroy();
                                this.yesText?.destroy();
                                const { buttonImage: confirmButton, buttonText: confirmText, } = this.createImageButtonWithText(width / 3.6, height / 1.5, "speechBubble8", "판매하기", () => {
                                    if (this.moneyImage) {
                                        this.moneyImage.destroy();
                                        this.moneyImage = null;
                                    }
                                    this.todaySalesAmount += price;
                                    this.todaySalesCount++;
                                    this.handleItemSale(this.selectedItem, price);
                                    this.cleanupUI();
                                    const hasInventoryItems = this.inventory.length > 0;
                                    if (hasInventoryItems && Math.random() < 0.4) {
                                        this.spawnBuyer();
                                    }
                                    else {
                                        this.spawnRandomCustomer();
                                    }
                                });
                                this.choiceButtonGroup?.add(confirmButton);
                                this.choiceButtonGroup?.add(confirmText);
                            }
                            else {
                                buttonImage6.setVisible(true);
                                buttonText6.setVisible(true);
                                buttonImage7.setVisible(true);
                                buttonText7.setVisible(true);
                                buttonImage8.setVisible(true);
                                buttonText8.setVisible(true);
                            }
                        });
                        this.choiceButtonGroup?.add(yesButton);
                        this.choiceButtonGroup?.add(yesText);
                    }
                });
            };
            createInputField();
        });
        const { buttonImage: buttonImage8, buttonText: buttonText8 } = this.createImageButtonWithText(width / 3.6, height / 1.5 + 100, "speechBubble8", "안팝니다.", () => {
            if (this.moneyImage) {
                this.moneyImage.destroy();
                this.moneyImage = null;
                console.log("💰 돈 이미지 제거 완료!");
            }
            this.cleanupUI();
            const hasInventoryItems = this.inventory.length > 0;
            if (hasInventoryItems && Math.random() < 0.4) {
                this.spawnBuyer();
            }
            else {
                this.spawnRandomCustomer();
            }
        });
        this.choiceButtonGroup?.add(buttonImage6);
        this.choiceButtonGroup?.add(buttonText6);
        this.choiceButtonGroup?.add(buttonImage7);
        this.choiceButtonGroup?.add(buttonText7);
        this.choiceButtonGroup?.add(buttonImage8);
        this.choiceButtonGroup?.add(buttonText8);
    }
    openItemPurchaseModal(item, price, originalPrice) {
        if (this.modalContainer)
            return;
        this.modalContainer = document.createElement("div");
        this.modalContainer.id = "item-purchase-modal";
        document.body.appendChild(this.modalContainer);
        this.modalRoot = (0, client_1.createRoot)(this.modalContainer);
        this.modalRoot.render((0, jsx_runtime_1.jsx)(ItemPurchaseModal_1.default, { item: item, purchasePrice: price, originalPrice: originalPrice, onClose: this.closeItemPurchaseModal.bind(this) }));
    }
    closeItemPurchaseModal() {
        if (this.modalContainer && this.modalRoot) {
            this.modalRoot.unmount();
            document.body.removeChild(this.modalContainer);
            this.modalContainer = null;
            this.modalRoot = null;
        }
    }
    showEndOfDayModal() {
        if (document.getElementById("end-of-day-modal"))
            return;
        this.input.enabled = false;
        const modalContainer = document.createElement("div");
        modalContainer.id = "end-of-day-modal";
        document.body.appendChild(modalContainer);
        const closeModal = () => {
            this.closeEndOfDayModal();
        };
        if (!this.modalRoot) {
            this.modalRoot = (0, client_1.createRoot)(modalContainer);
        }
        this.modalRoot.render((0, jsx_runtime_1.jsx)(EndOfDayModalProps_1.default, { purchases: this.todayPurchaseAmount, sales: this.todaySalesAmount, purchaseCount: this.todayPurchaseCount, salesCount: this.todaySalesCount, revenue: this.todaySalesAmount - this.todayPurchaseAmount, onClose: closeModal }));
    }
    closeEndOfDayModal() {
        const modalContainer = document.getElementById("end-of-day-modal");
        if (modalContainer && this.modalRoot) {
            this.modalRoot.unmount();
            this.modalRoot = null;
            document.body.removeChild(modalContainer);
        }
        this.input.enabled = true;
        this.dailyClientCount = 0;
        this.todayPurchaseAmount = 0;
        this.todaySalesAmount = 0;
        this.todayPurchaseCount = 0;
        this.todaySalesCount = 0;
    }
    showPetListModal() {
        if (this.modalOpen)
            return;
        this.modalOpen = true;
        this.input.enabled = false;
        if (document.getElementById("pet-list-modal"))
            return;
        const modalContainer = document.createElement("div");
        modalContainer.id = "pet-list-modal";
        document.body.appendChild(modalContainer);
        const closePetList = () => {
            if (this.petListRoot) {
                this.petListRoot.unmount();
                this.petListRoot = null;
            }
            document.body.removeChild(modalContainer);
            this.modalOpen = false;
            this.input.enabled = true;
        };
        if (!this.petListRoot) {
            this.petListRoot = (0, client_1.createRoot)(modalContainer);
        }
        this.petListRoot.render((0, jsx_runtime_1.jsx)(PetListModal_1.default, { itemsPerPage: 3, onClose: closePetList }));
    }
    addPet(pet) {
        if (!this.petList.some((p) => p.id === pet.id)) {
            this.petList.push(pet);
            localStorage.setItem("ownedPets", JSON.stringify(this.petList));
            console.log("🐾 펫이 추가됨:", pet.name);
        }
    }
    getPetList() {
        return this.petList;
    }
    setSelectedPet(pet) {
        if (!this.petImage || !this.textures.exists(pet.image))
            return;
        this.selectedPet = pet;
        this.petImage.setTexture(pet.image);
    }
    resetDailyClientText() {
        if (!this.cameras || !this.cameras.main) {
            console.warn("🚨 [resetDailyClientText] cameras.main이 아직 초기화되지 않았습니다!");
            return;
        }
        const width = this.cameras.main.width;
        console.log("🔄 [GameScene] dailyClientText 초기화 시작...");
        if (this.dailyClientText) {
            console.log("♻️ 기존 dailyClientText 재활용");
            this.dailyClientText.setText(`${this.dailyClientCount}명/8`);
        }
        else {
            console.warn("⚠️ dailyClientText가 존재하지 않음. 새로 생성합니다.");
            this.dailyClientText = this.add
                .text(width - 140, 90, `${this.dailyClientCount}명/8`, {
                fontSize: "28px",
                color: "#fff",
                padding: { left: 10, right: 10, top: 5, bottom: 5 },
            })
                .setDepth(10)
                .setOrigin(1, 0);
        }
        console.log("✅ dailyClientText가 정상적으로 갱신됨:", this.dailyClientText.text);
    }
    refreshUI() {
        console.log("🔄 [GameScene] UI 다시 그리는 중...");
        if (!this.scene.isActive()) {
            console.warn("⚠️ [GameScene] 활성화되지 않음. UI 업데이트 건너뜀.");
            return;
        }
        this.updateUI();
        if (!this.client) {
            console.warn("⚠️ 클라이언트가 없음. 새 클라이언트 생성");
            if (this.inventory.length > 0 && Math.random() < 0.4) {
                this.spawnBuyer();
            }
            else {
                this.spawnRandomCustomer();
            }
        }
        if (!this.speechBubble8) {
            console.warn("⚠️ speechBubble8 없음. 새로 추가.");
            this.speechBubble8 = this.add
                .image(400, 300, "speechBubble8")
                .setDepth(10);
        }
        if (!this.speechBubble9) {
            console.warn("⚠️ speechBubble9 없음. 새로 추가.");
            this.speechBubble9 = this.add
                .image(600, 300, "speechBubble9")
                .setDepth(10);
        }
        console.log("✅ [GameScene] refreshUI 완료.");
    }
    displayInventoryItems() {
        console.log("📦 [GameScene] 인벤토리 UI 업데이트 중...");
        if (!this.itemDisplayGroup) {
            this.itemDisplayGroup = this.add.group();
        }
        else {
            this.itemDisplayGroup.clear(true, true);
        }
        if (this.inventory.length === 0) {
            console.warn("⚠️ [GameScene] 인벤토리에 아이템이 없음.");
            return;
        }
        this.inventory.forEach((item, index) => {
            const xPos = 100 + index * 100;
            const yPos = this.scale.height - 150;
            const itemSprite = this.add.sprite(xPos, yPos, item.image);
            itemSprite.setScale(0.5).setInteractive();
            itemSprite.on("pointerdown", () => {
                console.log(`🛍️ [GameScene] 아이템 선택됨: ${item.name}`);
            });
            this.itemDisplayGroup?.add(itemSprite);
        });
        console.log("✅ [GameScene] 인벤토리 UI 갱신 완료.");
    }
}
exports.default = GameScene;
