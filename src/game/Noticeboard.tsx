import Phaser from "phaser";
import GameScene from "./GameScene";
import React from "react";
import { createRoot, Root } from "react-dom/client";
import { saveGameProgress, loadGameProgress } from "../utils/apiService";
import PetShopModal from "../components/templates/PetShopModal";

export default class Noticeboard extends Phaser.Scene {
  private petShopModalRoot: Root | null = null;
  constructor() {
    super({ key: "Noticeboard" });
  }

  preload() {
    this.load.image("boardlist2", "/images/background/boardlist2.png");
    this.load.image("boardlist3", "/images/background/boardlist3.png");
    this.load.image("bulletinboard", "/images/background/bulletinboard.png");
  }

  create() {
    const { width, height } = this.cameras.main;

    const background = this.add.image(width / 2, height / 2, "bulletinboard");
    background.setDisplaySize(width, height);

    const boardlist2 = this.add.image(width / 1.5, height / 1.5, "boardlist2");
    const boardlist3 = this.add.image(width / 2.5, height / 2.5, "boardlist3");

    boardlist2.setScale(0.4).setDepth(6).setOrigin(0.5, 0.5);
    boardlist2.setInteractive();

    boardlist2.on("pointerover", () => {
      this.tweens.add({
        targets: boardlist2,
        scale: 0.45,
        duration: 100,
        ease: "Linear",
      });
    });

    boardlist2.on("pointerout", () => {
      this.tweens.add({
        targets: boardlist2,
        scale: 0.4,
        duration: 100,
        ease: "Linear",
      });
    });

    boardlist2.on("pointerdown", () => {
      console.log("boardlist2~");
    });
    boardlist3.setScale(0.4).setDepth(6).setOrigin(0.5, 0.5);
    boardlist3.setInteractive();

    boardlist3.on("pointerover", () => {
      this.tweens.add({
        targets: boardlist3,
        scale: 0.45,
        duration: 100,
        ease: "Linear",
      });
    });

    boardlist3.on("pointerout", () => {
      this.tweens.add({
        targets: boardlist3,
        scale: 0.4,
        duration: 100,
        ease: "Linear",
      });
    });
    boardlist3.on("pointerdown", () => {
      console.log("펫 샵 열기");
      this.openPetShopModal();
    });

    const nextButton = this.add
      .text(width / 2, height - 100, "다음", {
        fontSize: "32px",
        fontStyle: "bold",
        color: "#ffffff",
        backgroundColor: "#007bff",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive();

    nextButton.on("pointerover", () => {
      nextButton.setStyle({ backgroundColor: "#0056b3" });
    });
    nextButton.on("pointerdown", async () => {
      this.scene.stop("Noticeboard");

      const gameScene = this.scene.get("GameScene") as GameScene;

      if (gameScene) {
        await saveGameProgress(gameScene.getMoney(), gameScene.getInventory(), {
          customerId: null,
          personality: null,
          item: null,
        });

        gameScene.cleanupUI();
        gameScene.cleanupBuyerUI();

        gameScene.setDailyClientCount(0);
        gameScene.resetCustomerData();
        const hasInventoryItems = gameScene.getInventory().length > 0;

        if (hasInventoryItems && Math.random() < 0.4) {
          gameScene.spawnBuyer();
        } else {
          gameScene.spawnRandomCustomer();
        }

        gameScene.scene.resume();
      } else {
        console.warn("⚠️ GameScene을 찾을 수 없습니다.");
      }
    });
  }

  private openPetShopModal() {
    if (document.getElementById("pet-shop-modal")) return;

    const modalContainer = document.createElement("div");
    modalContainer.id = "pet-shop-modal";
    document.body.appendChild(modalContainer);

    const closePetShop = () => {
      this.closePetShopModal();
    };

    if (!this.petShopModalRoot) {
      this.petShopModalRoot = createRoot(modalContainer);
    }

    this.petShopModalRoot.render(<PetShopModal onClose={closePetShop} />);
  }

  private closePetShopModal() {
    const modalContainer = document.getElementById("pet-shop-modal");
    if (modalContainer && this.petShopModalRoot) {
      this.petShopModalRoot.unmount();
      this.petShopModalRoot = null;
      document.body.removeChild(modalContainer);
    }
  }
}
