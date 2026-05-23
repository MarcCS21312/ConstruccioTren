import { TIPOS_CASILLA } from '../constants/tiposCasella.js'

// recursos del jugador y operaciones que consumen sus contadores
export class Jugador {
  constructor(rails = 0, talesDisponibles = 0, destruccionsDisponibles = 0) {
    this.rails                   = rails
    this.talesDisponibles        = talesDisponibles
    this.destruccionsDisponibles = destruccionsDisponibles
    this.puentes                 = 0
    this.madera                  = 0
    this.piedra                  = 0
    this.vias_nieve              = 0
    this.inventari               = []
  }

  // talar un bosque: convierte la casilla en plana y suma 1 unidad de madera
  talarArbre(casella) {
    if (!casella || casella.tipus !== TIPOS_CASILLA.BOSC || this.talesDisponibles <= 0) {
      return false
    }
    casella.canviarTipus(TIPOS_CASILLA.PLA)
    this.talesDisponibles -= 1
    this.madera += 1
    return true
  }

  // usa esDestruible() para no hardcodear tipos; cualquier obstáculo destruible acepta el pico
  destruirObstacle(casella) {
    if (!casella || !casella.esDestruible() || this.destruccionsDisponibles <= 0) {
      return false
    }
    casella.canviarTipus(TIPOS_CASILLA.PLA)
    this.destruccionsDisponibles -= 1
    this.piedra += 1
    return true
  }

  // colocar rail sobre PLA: consume 1 via (crafteada con madera+piedra)
  colocarRail(casella) {
    if (!casella || casella.tipus !== TIPOS_CASILLA.PLA || this.rails <= 0) {
      return false
    }
    casella.canviarTipus(TIPOS_CASILLA.RAIL)
    this.rails -= 1
    return true
  }

  // puente: convierte agua en rail sin gastar vías, consume 1 puente crafteado
  colocarPuente(casella) {
    if (!casella || !casella.esFranqueable() || this.puentes <= 0) {
      return false
    }
    casella.canviarTipus(TIPOS_CASILLA.RAIL)
    this.puentes -= 1
    return true
  }

  // vía de nieve: coloca rail sobre NEU, consume 1 via_nieve crafteada
  colocarViaNeu(casella) {
    if (!casella || casella.tipus !== TIPOS_CASILLA.NEU || this.vias_nieve <= 0) {
      return false
    }
    casella.canviarTipus(TIPOS_CASILLA.RAIL)
    this.vias_nieve -= 1
    return true
  }
}
