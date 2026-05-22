import { UI_COLORS, UI_DEPTH, UI_STYLES } from '../constants/ui.js'
import { Button } from '../classes/Boto.js'

const MARGIN_EDGE    = 24
const BTN_SPACING    = 8
const BTN_W          = 52   // explícito, no auto-sized: el ícono no tiene texto medible
const BTN_H          = 38
const PANEL_ALT      = 82   // 13px de margen simétrico entre bordes del panel y conjunto botón+badge
const LABEL_GAP      = 16
const INNER_PAD      = 16
const CONTENT_OFFSET = 9    // eleva el contenido para centrar visualmente botón+badge dentro del panel

/** HUD superior con recursos del jugador, botones de acción e inventario */
export class HUD {
  constructor(scene, offsetY, { onPausa, onCrafteig } = {}) {
    this.scene   = scene
    this._botons = []
    this._crear(offsetY, onPausa, onCrafteig)
  }

  _crear(offsetY, onPausa, onCrafteig) {
    const { width } = this.scene.scale
    const panelY   = offsetY / 2
    const contentY = panelY - CONTENT_OFFSET

    // layout: botones anclados a la derecha, recursos repartidos en el resto del ancho
    const bPausaX = width - MARGIN_EDGE - BTN_W / 2 - 16
    const bCraftX = bPausaX - BTN_W - BTN_SPACING

    const labelAreaLeft  = MARGIN_EDGE + INNER_PAD
    const labelAreaRight = bCraftX - BTN_W / 2 - LABEL_GAP
    const labelCx        = (labelAreaLeft + labelAreaRight) / 2
    const spacing        = Math.min((labelAreaRight - labelAreaLeft) / 3.5, 140)

    // fondo del panel
    this.scene.add
      .rectangle(width / 2, panelY, width - 2 * MARGIN_EDGE, PANEL_ALT, UI_COLORS.HUD_BG, 0.88)
      .setDepth(UI_DEPTH.HUD)

    const resourceY  = contentY
    const inventariY = contentY + 20

    // contadores de recursos (pico, hacha, vía)
    this.txtPico = this.scene.add
      .text(labelCx - spacing, resourceY, '', { ...UI_STYLES.HUD_LABEL, color: UI_COLORS.HUD_PICO })
      .setOrigin(0.5).setDepth(UI_DEPTH.HUD)

    this.txtDestral = this.scene.add
      .text(labelCx, resourceY, '', { ...UI_STYLES.HUD_LABEL, color: UI_COLORS.HUD_TALES })
      .setOrigin(0.5).setDepth(UI_DEPTH.HUD)

    this.txtRails = this.scene.add
      .text(labelCx + spacing, resourceY, '', { ...UI_STYLES.HUD_LABEL, color: UI_COLORS.HUD_RAILS })
      .setOrigin(0.5).setDepth(UI_DEPTH.HUD)

    // línea bajo los recursos con los ítems crafteados
    this.txtInventari = this.scene.add
      .text(labelCx, inventariY, '', UI_STYLES.HUD_INVENTARI)
      .setOrigin(0.5).setDepth(UI_DEPTH.HUD)

    // botones de acción (solo si la escena los proporciona)
    if (onCrafteig) {
      const bCraft = new Button(
        this.scene, bCraftX, contentY, '⚒',
        0x7c3aed, 0x8b5cf6, onCrafteig, BTN_W, BTN_H
      )
      bCraft.container.setDepth(UI_DEPTH.HUD + 1)
      this._botons.push(bCraft)
      this._afegirBadge(bCraftX, contentY, BTN_W, BTN_H, '[C]')
    }

    if (onPausa) {
      const bPausa = new Button(
        this.scene, bPausaX, contentY, '⏸',
        0x374151, 0x4b5563, onPausa, BTN_W, BTN_H
      )
      bPausa.container.setDepth(UI_DEPTH.HUD + 1)
      this._botons.push(bPausa)
      this._afegirBadge(bPausaX, contentY, BTN_W, BTN_H, '[ESC]')
    }
  }

  _afegirBadge(bx, by, ample, alt, tecla) {
    this.scene.add
      .text(bx, by + alt / 2 + 8, tecla, UI_STYLES.KEY_BADGE)
      .setOrigin(0.5, 0)
      .setDepth(UI_DEPTH.HUD + 2)
  }

  /** @param {import('../classes/Jugador.js').Jugador} jugador */
  actualitzar(jugador) {
    this.txtPico.setText(`⛏️ Pico: ${jugador.destruccionsDisponibles}`)
    this.txtDestral.setText(`🪓 Hacha: ${jugador.talesDisponibles}`)
    this.txtRails.setText(`🛤️ Vía: ${jugador.rails}`)

    const itemsText = jugador.inventari.map(i => i.icona).join(' ')
    this.txtInventari.setText(itemsText ? `Crafteado: ${itemsText}` : '')
  }

  /** @param {Phaser.Input.Pointer} pointer @returns {boolean} */
  esClic(pointer) {
    return this._botons.some(b => {
      const dx = Math.abs(pointer.x - b.container.x)
      const dy = Math.abs(pointer.y - b.container.y)
      return dx < b.ample / 2 && dy < b.alt / 2
    })
  }
}
