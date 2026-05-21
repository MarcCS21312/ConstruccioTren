import Phaser from 'phaser';

export class Button {
    constructor(scene, x, y, textBoto, colorBase, colorHover, callback) {
        this.scene = scene;
        this.colorBase = colorBase;
        this.colorHover = colorHover;

        const ample = 200;
        const alt = 60;
        
        // Fons del botó (Fem servir el colorBase que ens han passat)
        this.fons = scene.add.graphics();
        this.dibuixarBotó(this.colorBase); 
        
        // Text del botó (Fem servir la variable textBoto)
        this.text = scene.add.text(0, 0, textBoto, { 
            fontSize: '24px', // Una mica més petit per si la paraula és llarga
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            fill: '#ffffff' 
        }).setOrigin(0.5);

        // Creem el contenidor
        this.container = scene.add.container(x, y, [this.fons, this.text]);

        // Interactivitat
        const hitArea = new Phaser.Geom.Rectangle(-ample / 2, -alt / 2, ample, alt);
        this.container.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
        
        if (this.container.input) {
            this.container.input.cursor = 'pointer';
        }

        // Efectes de color utilitzant les variables del constructor
        this.container.on('pointerover', () => {
            this.dibuixarBotó(this.colorHover); 
        });

        this.container.on('pointerout', () => {
            this.dibuixarBotó(this.colorBase); 
        });

        this.container.on('pointerup', () => {
            callback();
        });
    }

    // Modifiquem la funció perquè es quedi amb el contorn del mateix color fosquet de fons
    dibuixarBotó(color) {
        const ample = 200;
        const alt = 60;
        this.fons.clear();
        this.fons.fillStyle(color, 1);
        this.fons.fillRoundedRect(-ample / 2, -alt / 2, ample, alt, 12);
        
        // Fem una línia de contorn negra transparent per ressaltar qualsevol color
        this.fons.lineStyle(3, 0x000000, 0.3);
        this.fons.strokeRoundedRect(-ample / 2, -alt / 2, ample, alt, 12);
    }
}