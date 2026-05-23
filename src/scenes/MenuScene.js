import Phaser from 'phaser';
import { Button } from '../classes/Boto.js';
import { UI_STYLES } from '../constants/ui.js';

const BTN_H_EST = 44
const BTN_GAP   = 24

// Menú principal: punto de entrada con botones para jugar o salir
export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  preload() {}

  create() {
    const { width, height } = this.scale;
    const cx = width  / 2;
    const cy = height / 2;

    this.add.rectangle(0, 0, width, height, 0x1a1a1a).setOrigin(0);

    // título principal y subtítulo
    this.add.text(cx, cy - 130, 'CONSTRUCCIÓN DEL TREN', UI_STYLES.TITOL_ESCENA)
      .setOrigin(0.5)
      .setResolution(window.devicePixelRatio || 2);

    this.add.text(cx, cy - 82, '— Construye el camino —', {
      fontSize: '18px',
      fontFamily: 'Arial, sans-serif',
      fill: '#64748b',
    }).setOrigin(0.5).setResolution(window.devicePixelRatio || 2);

    const botoConfigs = [
      { label: 'JUGAR',  color: 0x3b82f6, hover: 0x60a5fa, cb: () => this.scene.start('LevelSelectScene') },
      { label: 'SALIR',  color: 0xef4444, hover: 0xf87171, cb: () => this.scene.start('ExitScene')  },
    ];

    // textos fuera de pantalla para medir el ancho real y uniformar todos los botones
    const tmpTxts = botoConfigs.map(cfg => this.add.text(-9999, -9999, cfg.label, UI_STYLES.BOTO_TEXT));
    const maxW    = Math.max(...tmpTxts.map(t => t.width)) + 40;
    tmpTxts.forEach(t => t.destroy());

    // distribuye los botones verticalmente con un pequeño offset hacia abajo
    const totalH = botoConfigs.length * BTN_H_EST + (botoConfigs.length - 1) * BTN_GAP;
    const startY = cy - totalH / 2 + BTN_H_EST / 2 + 20;

    botoConfigs.forEach((cfg, i) => {
      new Button(this, cx, startY + i * (BTN_H_EST + BTN_GAP), cfg.label, cfg.color, cfg.hover, cfg.cb, maxW);
    });
  }
}
