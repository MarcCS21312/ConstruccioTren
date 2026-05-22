import Phaser from 'phaser';
import { Button } from '../classes/Boto.js';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {}

    create() {
        const { width, height } = this.scale;
        const cx = width / 2;
        const cy = height / 2;

        this.add.rectangle(0, 0, width, height, 0x1a1a1a).setOrigin(0);

        this.add.text(cx, cy - 130, 'CONSTRUCCIÓ DEL TREN', {
            fontSize: '36px',
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(cx, cy - 80, '— Construeix el camí —', {
            fontSize: '18px',
            fontFamily: 'Arial, sans-serif',
            fill: '#888888'
        }).setOrigin(0.5);

        new Button(this, cx, cy, 'JUGAR', 0x3b82f6, 0x60a5fa, () => {
            this.scene.start('PlayScene');
        });

        new Button(this, cx, cy + 80, 'SORTIR', 0xef4444, 0xf87171, () => {
            this.scene.start('ExitScene');
        });
    }
}
