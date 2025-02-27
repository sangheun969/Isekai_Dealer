import Phaser from "phaser";
export default class SelectMain extends Phaser.Scene {
    selectedCharacter = null;
    constructor() {
        super({ key: "SelectMain" });
    }
    preload() {
        this.load.image("character1", "/images/main/mainCharAsian3.png");
        this.load.image("character2", "/images/main/womanCharAsian2.png");
    }
    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const characters = [
            { id: 1, name: "Asian Man", image: "character1" },
            { id: 2, name: "Asian Woman", image: "character2" },
        ];
        characters.forEach((char, index) => {
            const x = width / 2 + index * 500;
            const y = height / 2;
            const characterButton = this.add
                .image(x, y, char.image)
                .setInteractive()
                .on("pointerdown", () => {
                this.handleCharacterSelect(char.image);
            });
            const characterText = this.add
                .text(x, y + 150, char.name, {
                fontSize: "24px",
            })
                .setOrigin(0.5);
        });
    }
    handleCharacterSelect(character) {
        this.selectedCharacter = character;
        console.log("Selected Character:", this.selectedCharacter);
        this.scene.start("StoryScene");
    }
}
