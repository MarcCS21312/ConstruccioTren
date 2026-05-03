import { TIPOS_CASILLA } from './tiposCasella.js'

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
   * Retorna true si la casella ya contiene un rail.
   * @returns {boolean}
   */
  teRail() {
    return this.tipus === TIPOS_CASILLA.RAIL
  }
}