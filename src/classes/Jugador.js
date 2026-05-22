import { TIPOS_CASILLA } from '../constants/tiposCasella.js'

// Recursos del jugador y operaciones que consumen sus contadores
export class Jugador {
  constructor(rails = 0, talesDisponibles = 0, destruccionsDisponibles = 0) {
    this.rails = rails
    this.talesDisponibles = talesDisponibles
    this.destruccionsDisponibles = destruccionsDisponibles
    this.inventari = []
  }

  // talar un bosque: convierte la casilla en plana, consume una tala y suma 1 rail
  talarArbre(casella) {
    if (!casella || casella.tipus !== TIPOS_CASILLA.BOSC || this.talesDisponibles <= 0) {
      return false
    }
    casella.canviarTipus(TIPOS_CASILLA.PLA)
    this.talesDisponibles -= 1
    this.rails += 1
    return true
  }

  // destruir obstáculo: convierte la casilla en plana pero no aporta rails
  destruirObstacle(casella) {
    if (!casella || casella.tipus !== TIPOS_CASILLA.OBSTACLE || this.destruccionsDisponibles <= 0) {
      return false
    }
    casella.canviarTipus(TIPOS_CASILLA.PLA)
    this.destruccionsDisponibles -= 1
    return true
  }

  // colocar rail: convierte la casilla plana en rail y consume 1 rail del inventario
  colocarRail(casella) {
    if (!casella || casella.tipus !== TIPOS_CASILLA.PLA || this.rails <= 0) {
      return false
    }
    casella.canviarTipus(TIPOS_CASILLA.RAIL)
    this.rails -= 1
    return true
  }
}
