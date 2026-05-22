import Phaser from 'phaser';
import { Button } from '../classes/Boto.js';
import { UI_STYLES } from '../constants/ui.js';

const BTN_H_EST = 44
const BTN_GAP   = 24

// Escena overlay que pausa PlayScene y ofrece continuar, reiniciar o salir al menú
export class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PauseScene' });
  }

  init(data) {
    // recibe el índice desde PlayScene para poder reiniciar el nivel correcto
    this.nivelIndex = data?.nivelIndex ?? 0
  }

  create() {
    const { width, height } = this.scale;
    const cx = width  / 2;
    const cy = height / 2;

    // fondo semitransparente que oscurece la PlayScene pausada de fondo
    this.add.rectangle(0, 0, width, height, 0x000000, 0.88).setOrigin(0);

    this.add.text(cx, height * 0.28, 'JUEGO EN PAUSA', UI_STYLES.TITOL_ESCENA)
      .setOrigin(0.5)
      .setResolution(window.devicePixelRatio || 2);

    const botoConfigs = [
      { label: 'CONTINUAR',        color: 0x3b82f6, hover: 0x60a5fa, cb: () => this.treurePausa()     },
      { label: 'REINICIAR NIVEL',  color: 0xf59e0b, hover: 0xfbbf24, cb: () => this.reiniciarNivell() },
      { label: 'MENÚ PRINCIPAL',   color: 0x6b7280, hover: 0x9ca3af, cb: () => this.anarAlMenu()      },
    ];

    // textos fuera de pantalla para medir el ancho real y uniformar todos los botones
    const tmpTxts = botoConfigs.map(cfg => this.add.text(-9999, -9999, cfg.label, UI_STYLES.BOTO_TEXT));
    const maxW    = Math.max(...tmpTxts.map(t => t.width)) + 40;
    tmpTxts.forEach(t => t.destroy());

    // distribuye los botones verticalmente centrados en pantalla
    const totalH = botoConfigs.length * BTN_H_EST + (botoConfigs.length - 1) * BTN_GAP;
    const startY = cy - totalH / 2 + BTN_H_EST / 2;

    botoConfigs.forEach((cfg, i) => {
      new Button(this, cx, startY + i * (BTN_H_EST + BTN_GAP), cfg.label, cfg.color, cfg.hover, cfg.cb, maxW);
    });

    // keyup (no keydown) para no capturar el mismo ESC que abrió la escena
    this.input.keyboard.on('keyup-ESC', () => this.treurePausa());
  }

  reiniciarNivell() {
    this.scene.stop('PauseScene');
    this.scene.start('PlayScene', { index: this.nivelIndex });
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
