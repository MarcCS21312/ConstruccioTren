import Phaser from 'phaser';

export class ExitScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ExitScene' });
    }

    create() {
        // 1. Pintem tota la pantalla de color blanc (0xffffff)
        this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0xffffff).setOrigin(0);

        // 2. Afegim el text de comiat en color fosc (#000) per veure's a sobre del blanc
        this.add.text(this.scale.width / 2, this.scale.height / 2, 'Gràcies per jugar!\n¡Adéu!', {
            fontSize: '40px',
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            fill: '#1a1a1a',
            align: 'center'
        }).setOrigin(0.5);
    }
}