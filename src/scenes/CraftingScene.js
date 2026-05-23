import Phaser from 'phaser'
import { Button } from '../classes/Boto.js'
import { SistemaCrafteig } from '../classes/SistemaCrafteig.js'
import { RECEPTES } from '../config/receptes.js'
import { UI_COLORS, UI_STYLES } from '../constants/ui.js'

const CARD_PAD      = 22
const CARD_H        = 118
const CARD_GAP      = 24
const PANEL_PAD_TOP = 72
const PANEL_PAD_BOT = 64
const BTN_W_LAYOUT  = 130  // estimación para calcular el espacio de texto disponible en la tarjeta
const ICON_W        = 32
const ICON_TEXT_GAP = 10

// mapa de claves de Jugador a etiqueta visible (icono + nombre)
const ETIQUETES = {
  rails:    '🛤️ Vía',
  puentes:  '🌉 Puente',
  vias_nieve: '❄️ V.Nieve',
  madera:   '🪵 Madera',
  piedra:   '🪨 Piedra',
  talesDisponibles:     '🪓 Hacha',
  destruccionsDisponibles: '⛏️ Pico',
}

// Escena overlay del taller: pinta una tarjeta por receta y permite craftear
export class CraftingScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CraftingScene' })
  }

  create() {
    const { width, height } = this.scale
    const cx = width  / 2
    const cy = height / 2

    // referencia a PlayScene para leer/mutar el jugador en curso
    this._playScene = this.scene.get('PlayScene')
    this._sistCraft = new SistemaCrafteig()

    // dimensiona el panel según cuántas recetas hay
    const cardW   = Math.min(680, width - 60)
    const n       = RECEPTES.length
    const panellW = cardW + 40
    const panellH = n * CARD_H + (n - 1) * CARD_GAP + PANEL_PAD_TOP + PANEL_PAD_BOT

    // fondo oscurecido + panel del taller
    this.add.rectangle(0, 0, width, height, 0x000000, 0.72).setOrigin(0)
    this.add.rectangle(cx, cy, panellW, panellH, UI_COLORS.CRAFTING_BG, 0.96).setOrigin(0.5)

    this.add.text(cx, cy - panellH / 2 + PANEL_PAD_TOP / 2, 'TALLER DE CRAFTEO', UI_STYLES.CRAFTING_TITOL)
      .setOrigin(0.5)
      .setResolution(window.devicePixelRatio || 2)

    // pinta una tarjeta por receta apiladas verticalmente
    const cardsTop = cy - panellH / 2 + PANEL_PAD_TOP
    RECEPTES.forEach((recepta, i) => {
      const cardY = cardsTop + CARD_H / 2 + i * (CARD_H + CARD_GAP)
      this._crearTargeta(recepta, cx, cardY, cardW)
    })

    // botón de cierre y atajos de teclado (keyup, ver PlayScene)
    new Button(this, cx, cy + panellH / 2 - PANEL_PAD_BOT / 2, 'CERRAR [C]',
      0x6b7280, 0x9ca3af, () => this.tancar())

    this.input.keyboard.on('keyup-C',   () => this.tancar())
    this.input.keyboard.on('keyup-ESC', () => this.tancarIPausar())
  }

  _crearTargeta(recepta, cx, cardY, cardW) {
    const jugador = this._playScene.joc.jugador
    const pot     = this._sistCraft.potCraftejar(jugador, recepta)

    // color de fondo distinto según si se puede craftear o no
    this.add.rectangle(cx, cardY, cardW, CARD_H,
      pot ? UI_COLORS.CRAFTING_CARD_OK : UI_COLORS.CRAFTING_CARD_KO, 0.92
    ).setOrigin(0.5)

    // layout horizontal: icono | texto (con wrap) | botón craftear a la derecha
    const leftX    = cx - cardW / 2 + CARD_PAD
    const textX    = leftX + ICON_W + ICON_TEXT_GAP
    const btnCx    = cx + cardW / 2 - CARD_PAD - BTN_W_LAYOUT / 2
    const textMaxX = btnCx - BTN_W_LAYOUT / 2 - CARD_PAD
    const textW    = textMaxX - textX

    // tres filas de texto: nombre, descripción e ingredientes
    const innerTop = cardY - CARD_H / 2 + CARD_PAD
    const row1Y    = innerTop + 10
    const row2Y    = row1Y   + 22
    const row3Y    = row2Y   + 20

    this.add.text(leftX, row1Y, recepta.icona, {
      fontSize: '22px', fontFamily: 'Arial, sans-serif'
    }).setOrigin(0, 0).setResolution(window.devicePixelRatio || 2)

    this.add.text(textX, row1Y, recepta.nom, UI_STYLES.CRAFTING_NOM)
      .setOrigin(0, 0).setResolution(window.devicePixelRatio || 2)

    this.add.text(textX, row2Y, recepta.descripcio, {
      ...UI_STYLES.CRAFTING_DESC,
      wordWrap: { width: textW, useAdvancedWrap: true }
    }).setOrigin(0, 0).setResolution(window.devicePixelRatio || 2)

    // un texto por ingrediente con marca ✓/✗ según si el jugador tiene suficiente
    let ingredX = textX
    Object.entries(recepta.ingredients).forEach(([recurs, cost]) => {
      const te    = jugador[recurs] >= cost
      const color = te ? UI_COLORS.CRAFTING_OK : UI_COLORS.CRAFTING_KO
      const label = `${te ? '✓' : '✗'} ${ETIQUETES[recurs]}: ${jugador[recurs]}/${cost}`
      this.add.text(ingredX, row3Y, label, {
        ...UI_STYLES.CRAFTING_INGREDIENT, fill: color
      }).setOrigin(0, 0).setResolution(window.devicePixelRatio || 2)
      ingredX += 185
    })

    // botón craftear solo si hay recursos; si no, texto informativo
    if (pot) {
      new Button(this, btnCx, cardY, 'CRAFTEAR', 0x059669, 0x10b981,
        () => this._craftejar(recepta), BTN_W_LAYOUT, CARD_H - 2 * CARD_PAD)
    } else {
      this.add.text(btnCx, cardY, 'Faltan\nrecursos', {
        ...UI_STYLES.CRAFTING_DESC, fill: UI_COLORS.CRAFTING_KO, align: 'center'
      }).setOrigin(0.5).setResolution(window.devicePixelRatio || 2)
    }
  }

  _craftejar(recepta) {
    const jugador = this._playScene.joc.jugador
    const ok      = this._sistCraft.aplicar(jugador, recepta)

    // tras craftear se reinicia la escena para repintar tarjetas con los nuevos recursos
    if (ok) {
      this._playScene.hud.actualitzar(jugador)
      this._mostrarAvis(`✅ ¡${recepta.nom} crafteado!`, '#4ade80', () => this.scene.restart())
    } else {
      this._mostrarAvis('❌ ¡Faltan recursos!', '#f87171')
    }
  }

  _mostrarAvis(missatge, color, onComplete = null) {
    const { width, height } = this.scale
    const txt = this.add.text(width / 2, height * 0.82, missatge, {
      ...UI_STYLES.CRAFTING_AVIS, fill: color
    }).setOrigin(0.5).setDepth(20).setResolution(window.devicePixelRatio || 2)

    // tween: el texto sube y se desvanece; opcional ejecutar callback al terminar
    this.tweens.add({
      targets: txt,
      alpha: 0,
      y: height * 0.72,
      duration: 1200,
      ease: 'Quad.easeIn',
      onComplete: () => {
        txt.destroy()
        if (onComplete) onComplete()
      }
    })
  }

  tancar() {
    this.scene.stop('CraftingScene')
    this.scene.resume('PlayScene')
  }

  // cierra el taller y abre la pausa (ESC desde el taller hace ambas cosas)
  tancarIPausar() {
    this.scene.stop('CraftingScene')
    this.scene.launch('PauseScene')
  }
}
