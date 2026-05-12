import { TIPOS_CASILLA } from '../constants/tiposCasella.js'

/**
 * Representa una casella del mapa.
 * @class Casella
 * @param {string} tipus - Tipo inicial de la casella (usar `TIPOS_CASILLA`).
 */
export class Casella {
  constructor(tipus = TIPOS_CASILLA.PLA) {
    this.tipus = tipus
  }

  /**
   * Cambia el tipo de la casella.
   * @param {string} nouTipus
   */
  canviarTipus(nouTipus) {
    this.tipus = nouTipus
  }

  /**
   * Indica si la casella es construible (terreno plano).
   * @returns {boolean}
   */
  esConstruible() {
    return this.tipus === TIPOS_CASILLA.PLA
  }


}