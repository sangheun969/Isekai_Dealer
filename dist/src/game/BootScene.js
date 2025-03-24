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
exports.default = BootScene;
