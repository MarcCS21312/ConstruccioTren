import { UI_COLORS, UI_DEPTH, UI_STYLES } from '../constants/ui.js'
import { Button } from '../classes/Boto.js'

const MARGIN_EDGE = 24
const BTN_SPACING = 8
const BTN_W       = 52   // explícito: el ícono no tiene texto medible para auto-sizing
const BTN_H       = 38
const PANEL_ALT   = 110  // dos filas de recursos + inventario
const LABEL_GAP   = 16
const INNER_PAD   = 16

// HUD superior con recursos del jugador, botones de acción e inventario
export class HUD {
  constructor(scene, offsetY, { onPausa, onCrafteig } = {}) {
    this.scene   = scene
    this._botons = []
    this._crear(offsetY, onPausa, onCrafteig)
  }

  _crear(offsetY, onPausa, onCrafteig) {
    const { width } = this.scene.scale
    const panelY   = offsetY / 2

    // layout: botones anclados a la derecha, etiquetas repartidas en el espacio restante
    const bPausaX = width - MARGIN_EDGE - BTN_W / 2 - 16
    const bCraftX = bPausaX - BTN_W - BTN_SPACING

    const labelAreaLeft  = MARGIN_EDGE + INNER_PAD
    const labelAreaRight = bCraftX - BTN_W / 2 - LABEL_GAP
    const labelCx        = (labelAreaLeft + labelAreaRight) / 2
    // fila 1: 4 etiquetas a posiciones ±0.5·s1 y ±1.5·s1 desde el centro
    const spacing1       = Math.min((labelAreaRight - labelAreaLeft) / 3, 110)
    // fila 2: 3 etiquetas a posiciones 0 y ±s2 desde el centro
    const spacing2       = Math.min((labelAreaRight - labelAreaLeft) / 2, 130)

    // fondo del panel
    this.scene.add
      .rectangle(width / 2, panelY, width - 2 * MARGIN_EDGE, PANEL_ALT, UI_COLORS.HUD_BG, 0.88)
      .setDepth(UI_DEPTH.HUD)

    const row1Y      = panelY - 16
    const row2Y      = panelY + 10
    const inventariY = panelY + 30

    // fila 1: herramientas y materiales recolectables
    this.txtPico = this.scene.add
      .text(labelCx - spacing1 * 1.5, row1Y, '', { ...UI_STYLES.HUD_LABEL, color: UI_COLORS.HUD_PICO })
      .setOrigin(0.5).setDepth(UI_DEPTH.HUD)

    this.txtDestral = this.scene.add
      .text(labelCx - spacing1 * 0.5, row1Y, '', { ...UI_STYLES.HUD_LABEL, color: UI_COLORS.HUD_TALES })
      .setOrigin(0.5).setDepth(UI_DEPTH.HUD)

    this.txtMadera = this.scene.add
      .text(labelCx + spacing1 * 0.5, row1Y, '', { ...UI_STYLES.HUD_LABEL, color: UI_COLORS.HUD_MADERA })
      .setOrigin(0.5).setDepth(UI_DEPTH.HUD)

    this.txtPiedra = this.scene.add
      .text(labelCx + spacing1 * 1.5, row1Y, '', { ...UI_STYLES.HUD_LABEL, color: UI_COLORS.HUD_PIEDRA })
      .setOrigin(0.5).setDepth(UI_DEPTH.HUD)

    // fila 2: recursos de colocación crafteados
    this.txtRails = this.scene.add
      .text(labelCx - spacing2, row2Y, '', { ...UI_STYLES.HUD_LABEL, color: UI_COLORS.HUD_RAILS })
      .setOrigin(0.5).setDepth(UI_DEPTH.HUD)

    this.txtPuente = this.scene.add
      .text(labelCx, row2Y, '', { ...UI_STYLES.HUD_LABEL, color: UI_COLORS.HUD_PUENTE })
      .setOrigin(0.5).setDepth(UI_DEPTH.HUD)

    this.txtNeu = this.scene.add
      .text(labelCx + spacing2, row2Y, '', { ...UI_STYLES.HUD_LABEL, color: UI_COLORS.HUD_NIEVE })
      .setOrigin(0.5).setDepth(UI_DEPTH.HUD)

    // línea bajo los recursos con los ítems crafteados
    this.txtInventari = this.scene.add
      .text(labelCx, inventariY, '', UI_STYLES.HUD_INVENTARI)
      .setOrigin(0.5).setDepth(UI_DEPTH.HUD)

    // botones de acción (solo si la escena los proporciona)
    if (onCrafteig) {
      const bCraft = new Button(
        this.scene, bCraftX, panelY, '⚒',
        0x7c3aed, 0x8b5cf6, onCrafteig, BTN_W, BTN_H
      )
      bCraft.container.setDepth(UI_DEPTH.HUD + 1)
      this._botons.push(bCraft)
      this._afegirBadge(bCraftX, panelY, BTN_W, BTN_H, '[C]')
    }

    if (onPausa) {
      const bPausa = new Button(
        this.scene, bPausaX, panelY, '⏸',
        0x374151, 0x4b5563, onPausa, BTN_W, BTN_H
      )
      bPausa.container.setDepth(UI_DEPTH.HUD + 1)
      this._botons.push(bPausa)
      this._afegirBadge(bPausaX, panelY, BTN_W, BTN_H, '[ESC]')
    }
  }

  _afegirBadge(bx, by, ample, alt, tecla) {
    this.scene.add
      .text(bx, by + alt / 2 + 8, tecla, UI_STYLES.KEY_BADGE)
      .setOrigin(0.5, 0)
      .setDepth(UI_DEPTH.HUD + 2)
  }

  // @param {import('../classes/Jugador.js').Jugador} jugador
  actualitzar(jugador) {
    this.txtPico.setText(`⛏️ Pico: ${jugador.destruccionsDisponibles}`)
    this.txtDestral.setText(`🪓 Hacha: ${jugador.talesDisponibles}`)
    this.txtMadera.setText(`🪵 Madera: ${jugador.madera}`)
    this.txtPiedra.setText(`🪨 Piedra: ${jugador.piedra}`)
    this.txtRails.setText(`🛤️ Vía: ${jugador.rails}`)
    this.txtPuente.setText(`🌉 Puente: ${jugador.puentes}`)
    this.txtNeu.setText(`❄️ V.Nieve: ${jugador.vias_nieve}`)

    const itemsText = jugador.inventari.map(i => i.icona).join(' ')
    this.txtInventari.setText(itemsText ? `Crafteado: ${itemsText}` : '')
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
