import Phaser from 'phaser'
import { Button } from '../classes/Boto.js'
import { CAMPANA } from '../config/campana.js'
import { getMaxDesbloqueado } from '../config/progreso.js'
import { UI_STYLES } from '../constants/ui.js'

const CARD_W   = 600
const CARD_H   = 64
const CARD_GAP = 14
const PAD_TOP  = 110

// pantalla intermedia: muestra los 5 niveles y bloquea los que aún no se han desbloqueado
export class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LevelSelectScene' })
  }

  create() {
    const { width, height } = this.scale
    const cx = width / 2

    this.add.rectangle(0, 0, width, height, 0x1a1a1a).setOrigin(0)

    // título principal
    this.add.text(cx, 50, 'SELECCIONA NIVEL', UI_STYLES.TITOL_ESCENA)
      .setOrigin(0.5).setResolution(window.devicePixelRatio || 2)

    const maxDesbloqueado = getMaxDesbloqueado()

    // una tarjeta por nivel, apiladas verticalmente
    CAMPANA.forEach((nivel, i) => {
      const cy = PAD_TOP + i * (CARD_H + CARD_GAP) + CARD_H / 2
      const desbloqueado = i <= maxDesbloqueado
      this._dibuixarTargeta(nivel, i, cx, cy, desbloqueado)
    })

    // botón volver al menú al final
    const btnY = PAD_TOP + CAMPANA.length * (CARD_H + CARD_GAP) + 30
    new Button(this, cx, Math.min(btnY, height - 40), 'VOLVER',
      0x6b7280, 0x9ca3af, () => this.scene.start('MenuScene'))

    this.input.keyboard.on('keyup-ESC', () => this.scene.start('MenuScene'))
  }

  _dibuixarTargeta(nivel, index, cx, cy, desbloqueado) {
    const colorFons = desbloqueado ? 0x1e3a5f : 0x2d2d2d
    this.add.rectangle(cx, cy, CARD_W, CARD_H, colorFons, 0.95)
      .setOrigin(0.5)
      .setStrokeStyle(2, desbloqueado ? 0x60a5fa : 0x4b5563)

    // número de nivel a la izquierda
    this.add.text(cx - CARD_W / 2 + 28, cy, `${index + 1}`, {
      fontSize: '32px', fontStyle: 'bold', fontFamily: 'Arial, sans-serif',
      fill: desbloqueado ? '#ffffff' : '#6b7280',
    }).setOrigin(0.5).setResolution(window.devicePixelRatio || 2)

    // nombre del nivel centrado
    this.add.text(cx - 40, cy, nivel.nom, {
      fontSize: '20px', fontStyle: 'bold', fontFamily: 'Arial, sans-serif',
      fill: desbloqueado ? '#e2e8f0' : '#6b7280',
    }).setOrigin(0.5).setResolution(window.devicePixelRatio || 2)

    // botón jugar a la derecha; o candado si está bloqueado
    if (desbloqueado) {
      new Button(this, cx + CARD_W / 2 - 70, cy, 'JUGAR',
        0x3b82f6, 0x60a5fa,
        () => this.scene.start('PlayScene', { index }),
        110, CARD_H - 18)
    } else {
      this.add.text(cx + CARD_W / 2 - 70, cy, '🔒', {
        fontSize: '28px', fontFamily: 'Arial, sans-serif',
      }).setOrigin(0.5).setResolution(window.devicePixelRatio || 2)
    }
  }
}
