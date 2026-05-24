import Phaser from 'phaser'
import { Button } from '../classes/Boto.js'
import { CAMPANA } from '../config/campana.js'
import { getMaxDesbloqueado } from '../config/progreso.js'
import { UI_STYLES } from '../constants/ui.js'
import { ScrollView } from '../ui/ScrollView.js'

const CARD_W   = 600
const CARD_H   = 64
const CARD_GAP = 14
const PAD_TOP  = 110

export class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LevelSelectScene' })
  }

  create() {
    const { width, height } = this.scale
    const cx = width / 2

    this.add.rectangle(0, 0, width, height, 0x1a1a1a).setOrigin(0)

    const SCROLL_TOP = PAD_TOP
    const SCROLL_BOT = height - 100

    // tarjetas de nivel
    const maxDesbloqueado = getMaxDesbloqueado()
    const targetes = CAMPANA.map((nivel, i) => {
      const cy = SCROLL_TOP + i * (CARD_H + CARD_GAP) + CARD_H / 2
      const desbloqueado = i <= maxDesbloqueado
      const antes = this.children.list.length
      this._dibuixarTargeta(nivel, i, cx, cy, desbloqueado)
      return { yInicial: cy, elements: this.children.list.slice(antes) }
    })

    // UI fija: título arriba y botón volver abajo
    this.add.text(cx, 50, 'SELECCIONA NIVEL', UI_STYLES.TITOL_ESCENA)
      .setOrigin(0.5).setResolution(window.devicePixelRatio || 2).setDepth(10)

    const btnVolver = new Button(this, cx, height - 50, 'VOLVER',
      0x6b7280, 0x9ca3af, () => this.scene.start('MenuScene'))
    btnVolver.container.setDepth(10)

    // franjas opacas que tapan tarjetas que sobresalgan de la zona de scroll
    this.add.rectangle(0, 0,          width, SCROLL_TOP,          0x1a1a1a).setOrigin(0).setDepth(9)
    this.add.rectangle(0, SCROLL_BOT, width, height - SCROLL_BOT, 0x1a1a1a).setOrigin(0).setDepth(9)

    this.input.keyboard.on('keyup-ESC', () => this.scene.start('MenuScene'))

    // scroll con barra lateral
    const scroll = new ScrollView(this, {
      top:           SCROLL_TOP,
      bottom:        SCROLL_BOT,
      itemHeight:    CARD_H,
      barX:          cx + CARD_W / 2 + 20,
      contentHeight: CAMPANA.length * (CARD_H + CARD_GAP),
    })
    scroll.setItems(targetes)
    scroll.enable()
  }

  _dibuixarTargeta(nivel, index, cx, cy, desbloqueado) {
    const colorFons = desbloqueado ? 0x1e3a5f : 0x2d2d2d
    this.add.rectangle(cx, cy, CARD_W, CARD_H, colorFons, 0.95)
      .setOrigin(0.5)
      .setStrokeStyle(2, desbloqueado ? 0x60a5fa : 0x4b5563)

    this.add.text(cx - CARD_W / 2 + 28, cy, `${index + 1}`, {
      fontSize: '32px', fontStyle: 'bold', fontFamily: 'Arial, sans-serif',
      fill: desbloqueado ? '#ffffff' : '#6b7280',
    }).setOrigin(0.5).setResolution(window.devicePixelRatio || 2)

    this.add.text(cx - 40, cy, nivel.nom, {
      fontSize: '20px', fontStyle: 'bold', fontFamily: 'Arial, sans-serif',
      fill: desbloqueado ? '#e2e8f0' : '#6b7280',
    }).setOrigin(0.5).setResolution(window.devicePixelRatio || 2)

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
