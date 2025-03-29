"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phaser_1 = __importDefault(require("phaser"));
class BootScene extends phaser_1.default.Scene {
    constructor() {
        super({ key: "BootScene" });
    }
    preload() {
        this.load.audio("bgm", "/audios/Isekai_1.mp3");
    }
    create() {
        console.log("✅ 오디오 로드 완료");
        this.input.once("pointerdown", () => {
            const soundManager = this.sound;
            if (soundManager.context.state === "suspended") {
                soundManager.context.resume();
            }
            const existingBgm = this.registry.get("bgm");
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
exports.default = BootScene;
