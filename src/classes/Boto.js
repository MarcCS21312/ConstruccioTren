import Phaser from 'phaser';

export class Button {
    constructor(scene, x, y, textBoto, colorBase, colorHover, callback, ample = 200, alt = 60) {
        this.scene = scene;
        this.colorBase = colorBase;
        this.colorHover = colorHover;
        this.ample = ample;
        this.alt = alt;

        this.fons = scene.add.graphics();
        this.dibuixarBotó(colorBase);

        this.text = scene.add.text(0, 0, textBoto, {
            fontSize: '24px',
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.container = scene.add.container(x, y, [this.fons, this.text]);

        const hitArea = new Phaser.Geom.Rectangle(-ample / 2, -alt / 2, ample, alt);
        this.container.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

        if (this.container.input) {
            this.container.input.cursor = 'pointer';
        }

        this.container.on('pointerover', () => this.dibuixarBotó(this.colorHover));
        this.container.on('pointerout',  () => this.dibuixarBotó(this.colorBase));
        this.container.on('pointerup',   () => callback());
    }

    dibuixarBotó(color) {
        const { ample, alt } = this;
        this.fons.clear();
        this.fons.fillStyle(color, 1);
        this.fons.fillRoundedRect(-ample / 2, -alt / 2, ample, alt, 12);
        this.fons.lineStyle(3, 0x000000, 0.3);
        this.fons.strokeRoundedRect(-ample / 2, -alt / 2, ample, alt, 12);
    }
}