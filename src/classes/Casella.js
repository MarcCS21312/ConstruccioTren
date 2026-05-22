import { TIPOS_CASILLA } from '../constants/tiposCasella.js'

// Casilla del mapa con un tipo de terreno mutable
export class Casella {
  constructor(tipus = TIPOS_CASILLA.PLA) {
    this.tipus = tipus
  }

  canviarTipus(nouTipus) {
    this.tipus = nouTipus
  }

  // solo el terreno plano admite colocar rail encima
  esConstruible() {
    return this.tipus === TIPOS_CASILLA.PLA
  }
}
