import Phaser from 'phaser'
import { Button } from '../classes/Boto.js'
import { COLORS_CASELLA } from '../constants/colors.js'
import { TIPOS_CASILLA } from '../constants/tiposCasella.js'
import { UI_COLORS, UI_STYLES } from '../constants/ui.js'

const PANEL_W   = 750
const ROW_H     = 40
const ROW_GAP   = 5
const SQ        = 22    // tamaño del cuadrado de color
const PAD_TOP   = 64
const PAD_BOT   = 60
const COL_PAD   = 18    // margen horizontal interno por columna

const ROWS = 6  // entradas por columna

// color → nombre → descripción de cada tipo de casilla
const ENTRADAS = [
  { color: COLORS_CASELLA[TIPOS_CASILLA.INICI],       nom: 'Inicio',      desc: 'Punto de partida del tren.' },
  { color: COLORS_CASELLA[TIPOS_CASILLA.META],        nom: 'Meta',        desc: 'Destino final. Conéctalo para ganar.' },
  { color: COLORS_CASELLA[TIPOS_CASILLA.PLA],         nom: 'Llano',       desc: 'Vacío. Puedes colocar una vía normal.' },
  { color: COLORS_CASELLA[TIPOS_CASILLA.PARADA],      nom: 'Parada',      desc: 'Obligatoria. La vía debe pasar por una celda adyacente.' },
  { color: COLORS_CASELLA[TIPOS_CASILLA.BOSC],        nom: 'Bosque',      desc: 'Tala (🪓) → 2 🪵. Bloquea el paso.' },
  { color: COLORS_CASELLA[TIPOS_CASILLA.PIEDRA],      nom: 'Piedra',      desc: 'Destruye (⛏️) → 2 🪨. Bloquea el paso.' },
  { color: COLORS_CASELLA[TIPOS_CASILLA.AGUA],        nom: 'Agua',        desc: 'Coloca un puente (🌉 craft: 2 🪵).' },
  { color: COLORS_CASELLA[TIPOS_CASILLA.NEU],         nom: 'Nieve',       desc: 'Coloca vía de nieve (❄️ craft: 2 🪨).' },
  { color: COLORS_CASELLA[TIPOS_CASILLA.MONTANYA],    nom: 'Montaña',     desc: 'Infranqueable. No se puede atravesar.' },
  { color: COLORS_CASELLA[TIPOS_CASILLA.RAIL],        nom: 'Vía',         desc: 'Vía normal colocada.' },
  { color: COLORS_CASELLA[TIPOS_CASILLA.RAIL_PUENTE], nom: 'Puente',      desc: 'Vía sobre el agua.' },
  { color: COLORS_CASELLA[TIPOS_CASILLA.RAIL_NEU],    nom: 'Vía de nieve',desc: 'Vía sobre la nieve.' },
]

export class GuideScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GuideScene' })
  }

  create() {
    const { width, height } = this.scale
    const cx = width  / 2
    const cy = height / 2

    const contentH = ROWS * ROW_H + (ROWS - 1) * ROW_GAP
    const panelH   = PAD_TOP + contentH + PAD_BOT

    // fondo oscurecido y panel central
    this.add.rectangle(0, 0, width, height, 0x000000, 0.78).setOrigin(0)
    this.add.rectangle(cx, cy, PANEL_W, panelH, UI_COLORS.CRAFTING_BG, 0.96).setOrigin(0.5)

    const panelTop = cy - panelH / 2
    this.add.text(cx, panelTop + PAD_TOP / 2, 'GUÍA DE CASILLAS', UI_STYLES.CRAFTING_TITOL)
      .setOrigin(0.5).setResolution(window.devicePixelRatio || 2)

    const g          = this.add.graphics()
    const contentTop = panelTop + PAD_TOP
    const colX = [
      cx - PANEL_W / 2 + COL_PAD,   // columna izquierda
      cx + COL_PAD,                  // columna derecha
    ]

    ENTRADAS.forEach((e, i) => {
      const col  = i < ROWS ? 0 : 1
      const row  = i < ROWS ? i : i - ROWS
      const x    = colX[col]
      const rowY = contentTop + row * (ROW_H + ROW_GAP)

      // cuadrado de color igual al del mapa
      g.fillStyle(e.color, 1)
      g.fillRect(x, rowY + (ROW_H - SQ) / 2, SQ, SQ)
      g.lineStyle(1, 0x000000, 0.35)
      g.strokeRect(x, rowY + (ROW_H - SQ) / 2, SQ, SQ)

      const tx = x + SQ + 8
      this.add.text(tx, rowY + 4, e.nom, {
        fontSize: '14px', fontStyle: 'bold', fontFamily: 'Arial, sans-serif', fill: '#ffffff'
      }).setOrigin(0, 0).setResolution(window.devicePixelRatio || 2)

      this.add.text(tx, rowY + 22, e.desc, {
        fontSize: '12px', fontFamily: 'Arial, sans-serif', fill: '#94a3b8'
      }).setOrigin(0, 0).setResolution(window.devicePixelRatio || 2)
    })

    new Button(this, cx, panelTop + panelH - PAD_BOT / 2, 'CERRAR [G]',
      0x6b7280, 0x9ca3af, () => this.cerrar())

    this.input.keyboard.on('keyup-G',   () => this.cerrar())
    this.input.keyboard.on('keyup-ESC', () => this.cerrar())
  }

  cerrar() {
    this.scene.stop('GuideScene')
    this.scene.resume('PlayScene')
  }
}
