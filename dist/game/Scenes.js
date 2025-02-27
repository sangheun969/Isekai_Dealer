import { jsx as _jsx } from "react/jsx-runtime";
import Phaser from "phaser";
import ReactDOM from "react-dom/client";
import SetUpBar from "../components/templates/SetUpBar.js";
import { loadGameProgress, saveGameProgress } from "../utils/apiService.js";
export default class Scenes extends Phaser.Scene {
    settingsOpen = false;
    setupRoot = null;
    constructor() {
        super({ key: "Scenes" });
    }
    preload() {
        this.load.image("background", "/images/background/storeBg3.png");
        this.load.audio("buttonClick", "/audios/Button1.mp3");
    }
    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const background = this.add.image(width / 2, height / 2, "background");
        background.setDisplaySize(width, height);
        const buttonClickSound = this.sound.add("buttonClick", { volume: 0.5 });
        this.registry.set("buttonClick", buttonClickSound);
        const startButton = this.add
            .text(width / 2, height / 2 - 50, "새 게임", {
            fontSize: "32px",
            color: "#fff",
            backgroundColor: "#333",
            padding: { top: 10, bottom: 10 },
        })
            .setOrigin(0.5)
            .setInteractive()
            .on("pointerdown", async () => {
            console.log("🆕 새 게임 시작!");
            const newGameData = {
                money: 100000,
                items: [],
            };
            await saveGameProgress(newGameData.money, newGameData.items);
            this.scene.start("StoryScene", { savedData: newGameData });
        });
        const settingsButton = this.add
            .text(width / 2, height / 2 + 70, "설정", {
            fontSize: "32px",
            color: "#fff",
            backgroundColor: "#333",
            padding: { top: 10, bottom: 10 },
        })
            .setOrigin(0.5)
            .setInteractive()
            .setDepth(10);
        const loadButton = this.add
            .text(width / 2, height / 2 + 110, "이어서 시작", {
            fontSize: "32px",
            color: "#fff",
            backgroundColor: "#333",
            padding: { top: 10, bottom: 10 },
        })
            .setOrigin(0.5)
            .setInteractive()
            .setDepth(10)
            .on("pointerdown", async () => {
            const savedData = await loadGameProgress();
            if (savedData) {
                console.log("불러온 데이터:", savedData);
                this.scene.start("CharacterSelect", { data: savedData });
            }
            else {
                console.log("저장된 데이터가 없습니다.");
            }
        });
        loadButton.on("pointerdown", async () => {
            console.log("📥 게임 데이터를 불러오는 중...");
            const data = await loadGameProgress();
            if (data) {
                console.log("✅ 불러오기 완료!", data);
                this.scene.start("GameScene", { savedData: data });
            }
            else {
                console.warn("⚠️ 저장된 데이터가 없습니다!");
            }
        });
        startButton.on("pointerover", () => {
            startButton.setStyle({ color: "#ffcc00" });
        });
        startButton.on("pointerout", () => {
            startButton.setStyle({ color: "#fff" });
        });
        startButton.on("pointerdown", () => {
            let effectSound = this.registry.get("buttonClick");
            if (!effectSound) {
                effectSound = this.sound.add("buttonClick", { volume: 0.5 });
                this.registry.set("buttonClick", effectSound);
            }
            const effectVolume = this.registry.get("effectVolume");
            if (effectSound instanceof Phaser.Sound.WebAudioSound &&
                effectVolume !== undefined) {
                effectSound.setVolume(effectVolume);
            }
            effectSound.play();
            this.scene.start("SavePage");
        });
        settingsButton.on("pointerover", () => {
            settingsButton.setStyle({ color: "#ffcc00" });
        });
        settingsButton.on("pointerout", () => {
            settingsButton.setStyle({ color: "#fff" });
        });
        settingsButton.on("pointerdown", () => {
            let effectSound = this.registry.get("buttonClick");
            if (!effectSound) {
                effectSound = this.sound.add("buttonClick", { volume: 0.5 });
                this.registry.set("buttonClick", effectSound);
            }
            const effectVolume = this.registry.get("effectVolume");
            if (effectSound instanceof Phaser.Sound.WebAudioSound &&
                effectVolume !== undefined) {
                effectSound.setVolume(effectVolume);
            }
            effectSound.play();
            if (!this.settingsOpen) {
                this.showSettingsModal();
            }
        });
    }
    showSettingsModal() {
        let setupBar = document.getElementById("setup-bar");
        if (!setupBar) {
            setupBar = document.createElement("div");
            setupBar.id = "setup-bar";
            document.body.appendChild(setupBar);
            this.setupRoot = ReactDOM.createRoot(setupBar);
        }
        this.setupRoot?.render(_jsx(SetUpBar, { scene: this, onClose: () => this.closeSettingsModal() }));
        this.settingsOpen = true;
    }
    closeSettingsModal() {
        if (this.setupRoot) {
            this.setupRoot.unmount();
            this.setupRoot = null;
        }
        const setupBar = document.getElementById("setup-bar");
        if (setupBar) {
            setupBar.remove();
        }
        this.settingsOpen = false;
    }
}
