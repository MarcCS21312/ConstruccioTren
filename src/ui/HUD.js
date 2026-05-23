import { UI_COLORS, UI_DEPTH, UI_STYLES } from '../constants/ui.js'
import { Button } from '../classes/Boto.js'

// exported so PlayScene can derive map layout from these values
export const PANEL_ALT = 68   // top bar height
export const SIDE_W    = 112  // width of left/right side panels

const MARGIN  = 14
const BTN_W   = 46
const BTN_H   = 36
const BTN_GAP = 8
const LINE_H  = 28   // vertical spacing between lines in side panels
const VPAD    = 6    // top/bottom inner padding for side panels
const HPAD    = 10   // left inner padding for side panel text

// three-zone HUD: top bar (tools + buttons), left panel (via counts), right panel (materials)
export class HUD {
  constructor(scene, { onPausa, onCrafteig } = {}) {
    this.scene   = scene
    this._botons = []
    this._crear(onPausa, onCrafteig)
  }

  _crear(onPausa, onCrafteig) {
    const { width } = this.scene.scale
    const topCY = PANEL_ALT / 2

    // === TOP BAR ===
    this.scene.add
      .rectangle(width / 2, topCY, width, PANEL_ALT, UI_COLORS.HUD_BG, 0.92)
      .setDepth(UI_DEPTH.HUD)

    const bPausaX = width - MARGIN - BTN_W / 2
    const bCraftX = bPausaX - BTN_W - BTN_GAP

    // tool labels centered in the space to the left of the buttons
    const labelRight = bCraftX - BTN_W / 2 - MARGIN
    const lCenter    = (MARGIN + labelRight) / 2
    const lSpacing   = Math.min((labelRight - MARGIN) / 3, 110)

    this.txtPico = this.scene.add
      .text(lCenter - lSpacing / 2, topCY, '', { ...UI_STYLES.HUD_LABEL, color: UI_COLORS.HUD_PICO })
      .setOrigin(0.5).setDepth(UI_DEPTH.HUD)

    this.txtDestral = this.scene.add
      .text(lCenter + lSpacing / 2, topCY, '', { ...UI_STYLES.HUD_LABEL, color: UI_COLORS.HUD_TALES })
      .setOrigin(0.5).setDepth(UI_DEPTH.HUD)

    if (onCrafteig) {
      const bCraft = new Button(this.scene, bCraftX, topCY, '⚒', 0x7c3aed, 0x8b5cf6, onCrafteig, BTN_W, BTN_H)
      bCraft.container.setDepth(UI_DEPTH.HUD + 1)
      this._botons.push(bCraft)
      this._badge(bCraftX, topCY, BTN_H, '[C]')
    }
    if (onPausa) {
      const bPausa = new Button(this.scene, bPausaX, topCY, '⏸', 0x374151, 0x4b5563, onPausa, BTN_W, BTN_H)
      bPausa.container.setDepth(UI_DEPTH.HUD + 1)
      this._botons.push(bPausa)
      this._badge(bPausaX, topCY, BTN_H, '[ESC]')
    }

    // === LEFT PANEL — via types ===
    const leftH   = LINE_H * 3 + VPAD * 2
    const leftTop = PANEL_ALT + 6
    const leftCY  = leftTop + leftH / 2

    this.scene.add
      .rectangle(SIDE_W / 2, leftCY, SIDE_W, leftH, UI_COLORS.HUD_BG, 0.82)
      .setDepth(UI_DEPTH.HUD)

    this.txtRails = this.scene.add
      .text(HPAD, leftCY - LINE_H, '', { ...UI_STYLES.HUD_LABEL, color: UI_COLORS.HUD_RAILS, fontSize: '15px' })
      .setOrigin(0, 0.5).setDepth(UI_DEPTH.HUD)
    this.txtPuente = this.scene.add
      .text(HPAD, leftCY, '', { ...UI_STYLES.HUD_LABEL, color: UI_COLORS.HUD_PUENTE, fontSize: '15px' })
      .setOrigin(0, 0.5).setDepth(UI_DEPTH.HUD)
    this.txtNeu = this.scene.add
      .text(HPAD, leftCY + LINE_H, '', { ...UI_STYLES.HUD_LABEL, color: UI_COLORS.HUD_NIEVE, fontSize: '15px' })
      .setOrigin(0, 0.5).setDepth(UI_DEPTH.HUD)

    // === RIGHT PANEL — materials ===
    const rightH   = LINE_H * 2 + VPAD * 2
    const rightTop = PANEL_ALT + 6
    const rightCY  = rightTop + rightH / 2

    this.scene.add
      .rectangle(width - SIDE_W / 2, rightCY, SIDE_W, rightH, UI_COLORS.HUD_BG, 0.82)
      .setDepth(UI_DEPTH.HUD)

    const rightTextX = width - SIDE_W + HPAD
    this.txtMadera = this.scene.add
      .text(rightTextX, rightCY - LINE_H / 2, '', { ...UI_STYLES.HUD_LABEL, color: UI_COLORS.HUD_MADERA, fontSize: '15px' })
      .setOrigin(0, 0.5).setDepth(UI_DEPTH.HUD)
    this.txtPiedra = this.scene.add
      .text(rightTextX, rightCY + LINE_H / 2, '', { ...UI_STYLES.HUD_LABEL, color: UI_COLORS.HUD_PIEDRA, fontSize: '15px' })
      .setOrigin(0, 0.5).setDepth(UI_DEPTH.HUD)
  }

  _badge(bx, by, btnH, label) {
    this.scene.add
      .text(bx, by + btnH / 2 + 4, label, UI_STYLES.KEY_BADGE)
      .setOrigin(0.5, 0).setDepth(UI_DEPTH.HUD + 2)
  }

  // @param {import('../classes/Jugador.js').Jugador} jugador
  actualitzar(jugador) {
    this.txtPico.setText(`⛏️ Pico: ${jugador.destruccionsDisponibles}`)
    this.txtDestral.setText(`🪓 Hacha: ${jugador.talesDisponibles}`)
    this.txtRails.setText(`🛤️ Vía: ${jugador.rails}`)
    this.txtPuente.setText(`🌉 Puente: ${jugador.puentes}`)
    this.txtNeu.setText(`❄️ Nieve: ${jugador.vias_nieve}`)
    this.txtMadera.setText(`🪵 Madera: ${jugador.madera}`)
    this.txtPiedra.setText(`🪨 Piedra: ${jugador.piedra}`)
  }

  // @param {Phaser.Input.Pointer} pointer @returns {boolean}
  esClic(pointer) {
    return this._botons.some(b => {
      const dx = Math.abs(pointer.x - b.container.x)
      const dy = Math.abs(pointer.y - b.container.y)
      return dx < b.ample / 2 && dy < b.alt / 2
    })
  }
}
