import Phaser from 'phaser';
import { UI_STYLES } from '../constants/ui.js';

// padding interno: 20px por lado horizontal, 10px arriba y abajo
const PAD_H = 40
const PAD_V = 20

/*
  Botón reutilizable con fondo redondeado y efecto hover.
  Si se pasa ample/alt y el texto no cabe, las dimensiones se expanden para contenerlo.
*/
export class Button {
  constructor(scene, x, y, textBoto, colorBase, colorHover, callback, ample = null, alt = null) {
    this.scene      = scene;
    this.colorBase  = colorBase;
    this.colorHover = colorHover;

    // crear el texto primero para medir dimensiones reales antes de dibujar el fondo
    this.text = scene.add.text(0, 0, textBoto, UI_STYLES.BOTO_TEXT).setOrigin(0.5);
    this.text.setResolution(window.devicePixelRatio || 2);
    this.text.setShadow(1, 1, 'rgba(0,0,0,0.5)', 2);

    // si se pasa tamaño explícito pero el texto no cabe, se expande
    this.ample = ample !== null ? Math.max(ample, this.text.width  + PAD_H) : this.text.width  + PAD_H;
    this.alt   = alt   !== null ? Math.max(alt,   this.text.height + PAD_V) : this.text.height + PAD_V;

    // fondo gráfico separado para poder redibujar en hover sin recrear el container
    this.fons = scene.add.graphics();
    this.dibuixarBotó(colorBase);

    this.container = scene.add.container(x, y, [this.fons, this.text]);

    // hitbox manual: container no la deduce automáticamente
    const hitArea = new Phaser.Geom.Rectangle(-this.ample / 2, -this.alt / 2, this.ample, this.alt);
    this.container.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

    if (this.container.input) {
      this.container.input.cursor = 'pointer';
    }

    // eventos de ratón: hover cambia color, pointerup dispara el callback
    this.container.on('pointerover', () => this.dibuixarBotó(this.colorHover));
    this.container.on('pointerout',  () => this.dibuixarBotó(this.colorBase));
    this.container.on('pointerup',   () => callback());
  }

  dibuixarBotó(color) {
    const { ample, alt } = this;
    this.fons.clear();
    this.fons.fillStyle(color, 1);
    this.fons.fillRoundedRect(-ample / 2, -alt / 2, ample, alt, 8);
    this.fons.lineStyle(2, 0x000000, 0.18);
    this.fons.strokeRoundedRect(-ample / 2, -alt / 2, ample, alt, 8);
  }
}
