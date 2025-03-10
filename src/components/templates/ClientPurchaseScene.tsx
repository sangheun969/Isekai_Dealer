import Phaser from "phaser";
import itemInfo from "../organisms/itemInfo";

export default class ClientPurchaseScene extends Phaser.Scene {
  private selectedClient: Phaser.GameObjects.Image | null = null;
  private speechText: Phaser.GameObjects.Text | null = null;
  private button: Phaser.GameObjects.Image | null = null;
  private buttonText: Phaser.GameObjects.Text | null = null;
  private cancelButton: Phaser.GameObjects.Image | null = null;
  private cancelButtonText: Phaser.GameObjects.Text | null = null;
  private selectedItem: any | null = null;
  private purchasePrice: number = 0;
  private moneyImage: Phaser.GameObjects.Image | null = null;
  private inventory: any[];
  private money: number;
  private openModal: ((item: any, price: number) => void) | null = null;
  private onPurchase: ((item: any, price: number) => void) | null = null;

  constructor() {
    super({ key: "ClientPurchaseScene" });
    this.inventory = [];
    this.money = 0;
  }

  init(data: {
    inventory: any[];
    money: number;
    openModal: (item: any, price: number) => void;
    onPurchase: (item: any, price: number) => void;
  }) {
    this.inventory = data.inventory;
    this.money = data.money;
    this.openModal = data.openModal;
    this.onPurchase = data.onPurchase;
  }

  create() {
    if (this.inventory.length === 0) return;

    if (Math.random() < 0.25) {
      this.showClient();
    }
  }

  showClient() {
    const clientNumber = Math.floor(Math.random() * 14) + 1;
    this.selectedClient = this.add.image(400, 300, `client${clientNumber}`);

    const randomItemIndex = Math.floor(Math.random() * this.inventory.length);
    this.selectedItem = this.inventory[randomItemIndex];
    this.purchasePrice = Math.floor(this.selectedItem.price * 1.2);

    const moneyImageKey =
      this.purchasePrice <= 10000 ? "moneyCoin2" : "moneyCoin4";
    this.moneyImage = this.add.image(400, 450, moneyImageKey).setInteractive();

    this.moneyImage.on("pointerdown", () => {
      if (this.openModal && this.selectedItem) {
        this.openModal(this.selectedItem, this.purchasePrice);
      }
    });

    const speechBubble = this.add.image(400, 200, "speechBubble9");
    this.speechText = this.add.text(
      350,
      180,
      "이 물건이 마음에 드는군요 이 가격이면 가능할까요?",
      {
        fontSize: "20px",
        color: "#000",
        fontFamily: "Arial",
      }
    );

    this.button = this.add.image(350, 500, "speechBubble8").setInteractive();
    this.buttonText = this.add.text(320, 490, "판매하기", {
      fontSize: "18px",
      color: "#000",
      fontFamily: "Arial",
    });

    this.cancelButton = this.add
      .image(450, 500, "speechBubble8")
      .setInteractive();
    this.cancelButtonText = this.add.text(420, 490, "안 팔아요", {
      fontSize: "18px",
      color: "#000",
      fontFamily: "Arial",
    });

    this.button.on("pointerdown", () => {
      this.handlePurchase();
    });

    this.cancelButton.on("pointerdown", () => {
      this.handleCancel();
    });
  }

  handlePurchase() {
    if (!this.selectedItem) return;

    if (this.onPurchase) {
      this.onPurchase(this.selectedItem, this.purchasePrice);
    }

    console.log(
      `✅ ${
        this.selectedItem.name
      }을 ${this.purchasePrice.toLocaleString()} 코인에 판매했습니다!`
    );
    this.cleanupUI();
    this.scene.stop();
  }

  handleCancel() {
    this.cleanupUI();
    this.showClient();
  }

  cleanupUI() {
    this.selectedClient?.destroy();
    this.speechText?.destroy();
    this.button?.destroy();
    this.buttonText?.destroy();
    this.cancelButton?.destroy();
    this.cancelButtonText?.destroy();
    this.moneyImage?.destroy();
  }
}
