import Phaser from 'phaser';
import { Button } from '../classes/Boto.js';

export class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseScene' });
    }

    create() {
        const { width, height } = this.scale;
        const cx = width / 2;
        const cy = height / 2;

        this.add.rectangle(0, 0, width, height, 0x000000, 0.65).setOrigin(0);

        this.add.text(cx, cy - 90, 'JOC EN PAUSA', {
            fontSize: '40px',
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            fill: '#ffffff'
        }).setOrigin(0.5);

        new Button(this, cx, cy + 10, 'REPRENDRE', 0x3b82f6, 0x60a5fa, () => {
            this.treurePausa();
        });

        new Button(this, cx, cy + 90, 'MENÚ PRINCIPAL', 0x6b7280, 0x9ca3af, () => {
            this.anarAlMenu();
        });

        this.input.keyboard.on('keydown-ESC', () => this.treurePausa());
    }

    treurePausa() {
        this.scene.resume('PlayScene');
        this.scene.stop('PauseScene');
    }

    anarAlMenu() {
        this.scene.stop('PlayScene');
        this.scene.start('MenuScene');
    }
}
