import Phaser from 'phaser';
import { Button } from '../classes/Boto.js';

/** Pantalla de despedida tras pulsar SALIR en el menú; ofrece volver al menú */
export class ExitScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ExitScene' });
    }

    create() {
        const { width, height } = this.scale;

        // fondo claro para diferenciarse claramente del resto de escenas oscuras
        this.add.rectangle(0, 0, width, height, 0xffffff).setOrigin(0);

        this.add.text(width / 2, height / 2 - 70, '¡Gracias por jugar!\n¡Adiós!', {
            fontSize: '40px',
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            fill: '#1a1a1a',
            align: 'center'
        }).setOrigin(0.5);

        new Button(this, width / 2, height / 2 + 60, 'VOLVER AL MENÚ', 0x1a1a1a, 0x374151, () => {
            this.scene.start('MenuScene');
        });
    }
}
