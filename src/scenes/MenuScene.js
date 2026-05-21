import Phaser from 'phaser';
import {Button} from '../classes/Boto.js';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {}
    
    create() {
        // Fons del menú
        this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x1a1a1a).setOrigin(0);

        const centreX = this.cameras.main.centerX;
        const centreY = this.cameras.main.centerY;

        // ➔ BOTÓ 1: PLAY (Text, Color Normal, Color Hover, Acció)
        this.playButton = new Button(this, centreX, centreY - 40, 'PLAY', 0x3b82f6, 0x60a5fa, () => {
            this.scene.start('PlayScene');
        });

        // ➔ BOTÓ 2: EXIT (Text, Color Normal, Color Hover, Acció)
        // El baixem 80 píxels (centreY + 40) perquè no es solapin
        this.exitButton = new Button(this, centreX, centreY + 40, 'EXIT', 0xef4444, 0xf87171, () => {
            console.log("Has clicat sortir!");
            this.scene.start('ExitScene'); // ➔ CANVIA AIXÒ AQUÍ!
        });
    }
}