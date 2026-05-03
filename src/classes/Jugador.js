import { TIPOS_CASILLA } from './tiposCasella.js'

/**
 * Representa l'estat del jugador: recursos i operacions disponibles.
 */
export class Jugador {
  /**
   * @param {number} rails
   * @param {number} talesDisponibles
   * @param {number} destruccionsDisponibles
   */
  constructor(rails = 0, talesDisponibles = 0, destruccionsDisponibles = 0) {
    this.rails = rails
    this.talesDisponibles = talesDisponibles
    this.destruccionsDisponibles = destruccionsDisponibles
  }

  /**
   * Coloca un rail en una casella plana consumiendo 1 rail del inventario.
   * @param {Casella} casella
   * @returns {boolean}
   */
  colocarRail(casella) {
    if (!casella || casella.tipus !== TIPOS_CASILLA.PLA || this.rails <= 0) {
      return false
    }

    casella.canviarTipus(TIPOS_CASILLA.RAIL)
    this.rails -= 1
    return true
  }
}