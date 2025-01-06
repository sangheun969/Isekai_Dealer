import Phaser from "phaser";
import SelectMain from "./SelectMain";
import Scenes from "./Scenes";

export default class SavePage extends Phaser.Scene {
  constructor() {
    super({ key: "SavePage" }); // 씬의 고유 키를 지정
  }

  preload() {
    // 필요한 리소스를 여기에 로드할 수 있습니다.
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // 버튼을 화면에 배치
    const backButton = this.add
      .text(width / 2, height / 2 - 200, "back", {
        fontSize: "16px",
      })
      .setOrigin(0.5)
      .setInteractive();
    backButton.on("pointerdown", () => {
      this.scene.start("Scenes");
    });

    const save1Button = this.add
      .text(width / 2, height / 2 - 100, "Save 1", {
        fontSize: "32px",
      })
      .setOrigin(0.5)
      .setInteractive();

    save1Button.on("pointerdown", () => {
      // 'SelectMain' 씬으로 이동
      this.scene.start("SelectMain");
    });

    const save2Button = this.add
      .text(width / 2, height / 2, "Save 2", {
        fontSize: "32px",
      })
      .setOrigin(0.5)
      .setInteractive();

    save2Button.on("pointerdown", () => {
      // 저장된 다른 씬을 시작하도록 설정 가능
    });

    const save3Button = this.add
      .text(width / 2, height / 2 + 100, "Save 3", {
        fontSize: "32px",
      })
      .setOrigin(0.5)
      .setInteractive();

    save3Button.on("pointerdown", () => {
      // 저장된 다른 씬을 시작하도록 설정 가능
    });
  }
}
