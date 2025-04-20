import Phaser from "phaser";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  preload() {
    this.load.audio("bgm", "/audios/Isekai_1.mp3");
    this.load.image("playBtn5", "/images/main/playBtn5.png");
    this.load.image("playBtn6", "/images/main/playBtn6.png");
    this.load.image("playBtn7", "/images/main/playBtn7.png");
    this.load.image("playBtn8", "/images/main/playBtn8.png");
    this.load.audio("buttonClick", "/audios/Button1.mp3");
    this.load.image("startMenuBg", "/images/background/startMenuBg.png");
  }

  create() {
    console.log("✅ 리소스 로드 완료");

    this.input.once("pointerdown", () => {
      const soundManager = this.sound as Phaser.Sound.WebAudioSoundManager;

      if (soundManager.context.state === "suspended") {
        soundManager.context.resume();
      }

      const existingBgm = this.registry.get("bgm") as Phaser.Sound.BaseSound;

      if (!existingBgm || !existingBgm.isPlaying) {
        const bgm = this.sound.add("bgm", {
          loop: true,
          volume: 0.5,
        });
        bgm.play();
        this.registry.set("bgm", bgm);
        console.log("🎵 글로벌 배경음악 재생 시작");
      }

      this.scene.start("Scenes");
    });
  }
}
