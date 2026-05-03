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
}