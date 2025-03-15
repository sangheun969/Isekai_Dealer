import Phaser from "phaser";
import GameScene from "./GameScene";
import { saveGameProgress, loadGameProgress } from "../utils/apiService";

export default class Noticeboard extends Phaser.Scene {
  constructor() {
    super({ key: "Noticeboard" });
  }

  preload() {
    this.load.image("bulletinboard", "/images/background/bulletinboard.png");
  }

  create() {
    const { width, height } = this.cameras.main;

    const background = this.add.image(width / 2, height / 2, "bulletinboard");
    background.setDisplaySize(width, height);

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

        console.log("✅ 자동 저장 완료. 고객 정보 초기화 후 재시작");

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
}
