import Phaser from "phaser";
export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: "BootScene" });
    }
    preload() {
        this.load.audio("backgroundMusic", "/audios/Isekai_1.mp3");
    }
    create() {
        if (!this.sound.get("backgroundMusic")) {
            const bgm = this.sound.add("backgroundMusic", {
                loop: true,
                volume: 0.5,
            });
            bgm.play();
            this.registry.set("backgroundMusic", bgm);
        }
        this.scene.start("Scenes");
    }
}
