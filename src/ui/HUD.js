import { UI_COLORS, UI_DEPTH, UI_STYLES } from '../constants/ui.js'

/**
 * Panel HUD que mostra els recursos disponibles del jugador.
 * Es posiciona centrat a l'espai entre la vora superior i el mapa.
 */
export class HUD {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} offsetY - distància des de la vora fins al mapa (px)
   */
  constructor(scene, offsetY) {
    this.scene = scene
    this._crear(offsetY)
  }

  _crear(offsetY) {
    const { width } = this.scene.scale
    const cx = width / 2
    const panelY = offsetY / 2
    const spacing = Math.min(180, (width - 40) / 4)

    this.scene.add.rectangle(cx, panelY, width - 40, 44, UI_COLORS.HUD_BG, 0.85)
      .setDepth(UI_DEPTH.HUD)

    this.txtPico = this.scene.add
      .text(cx - spacing, panelY, '', { ...UI_STYLES.HUD_LABEL, color: UI_COLORS.HUD_PICO })
      .setOrigin(0.5).setDepth(UI_DEPTH.HUD)

    this.txtDestral = this.scene.add
      .text(cx, panelY, '', { ...UI_STYLES.HUD_LABEL, color: UI_COLORS.HUD_TALES })
      .setOrigin(0.5).setDepth(UI_DEPTH.HUD)

    this.txtRails = this.scene.add
      .text(cx + spacing, panelY, '', { ...UI_STYLES.HUD_LABEL, color: UI_COLORS.HUD_RAILS })
      .setOrigin(0.5).setDepth(UI_DEPTH.HUD)
  }

  /**
   * Actualitza els comptadors amb l'estat actual del jugador.
   * @param {import('../classes/Jugador.js').Jugador} jugador
   */
  actualitzar(jugador) {
    this.txtPico.setText(`⛏️ Pico: ${jugador.destruccionsDisponibles}`)
    this.txtDestral.setText(`🪓 Hacha: ${jugador.talesDisponibles}`)
    this.txtRails.setText(`🛤️ Rail: ${jugador.rails}`)
  }
}
