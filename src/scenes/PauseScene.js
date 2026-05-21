import Phaser from 'phaser';
import {Button} from '../classes/Boto.js'; // La teva classe de botó universal

export class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseScene' });
    }

    create() {
        const ample = this.scale.width;
        const alt = this.scale.height;

        // 1. Fons fosc semitransparent (l'últim paràmetre 0.6 és l'opacitat)
        this.add.rectangle(0, 0, ample, alt, 0x000000, 0.6).setOrigin(0);

        // 2. Text de Pausa
        this.add.text(ample / 2, alt / 2 - 60, 'JOC EN PAUSA', {
            fontSize: '40px',
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // 3. Botó universal per RESUMIR la partida
        this.resumeButton = new Button(this, ample / 2, alt / 2 + 40, 'RESUME', 0x3b82f6, 0x60a5fa, () => {
            this.treurePausa();
        });

        // 4. També escoltem la tecla ESC dins de la pausa per poder sortir-ne
        this.input.keyboard.on('keydown-ESC', () => {
            this.treurePausa();
        });
    }

    treurePausa() {
        // Reprenem l'activitat de la PlayScene
        this.scene.resume('PlayScene');
        // Tanquem aquesta pantalla de pausa
        this.scene.stop();
    }
}