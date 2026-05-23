import { TIPOS_CASILLA } from '../constants/tiposCasella.js'

// cada uso de hacha o pico devuelve 2 unidades; herramientas escasas pero impactantes
const MATERIA_PER_US = 2

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

  // talar un bosque: convierte la casilla en plana y otorga 2 unidades de madera
  talarArbre(casella) {
    if (!casella || casella.tipus !== TIPOS_CASILLA.BOSC || this.talesDisponibles <= 0) {
      return false
    }
    casella.canviarTipus(TIPOS_CASILLA.PLA)
    this.talesDisponibles -= 1
    this.madera += MATERIA_PER_US
    return true
  }

  // destruye un obstáculo destruible y otorga 2 unidades de piedra
  destruirObstacle(casella) {
    if (!casella || !casella.esDestruible() || this.destruccionsDisponibles <= 0) {
      return false
    }
    casella.canviarTipus(TIPOS_CASILLA.PLA)
    this.destruccionsDisponibles -= 1
    this.piedra += MATERIA_PER_US
    return true
  }

  // colocar vía normal sobre PLA o PARADA; PARADA conserva un color distinto al confirmar la visita
  colocarRail(casella) {
    if (!casella || this.rails <= 0) return false
    if (casella.tipus !== TIPOS_CASILLA.PLA && casella.tipus !== TIPOS_CASILLA.PARADA) {
      return false
    }
    const nouTipus = casella.tipus === TIPOS_CASILLA.PARADA
      ? TIPOS_CASILLA.RAIL_PARADA
      : TIPOS_CASILLA.RAIL
    casella.canviarTipus(nouTipus)
    this.rails -= 1
    return true
  }

  // puente: convierte agua en RAIL_PUENTE sin gastar vías, consume 1 puente crafteado
  colocarPuente(casella) {
    if (!casella || !casella.esFranqueable() || this.puentes <= 0) {
      return false
    }
    casella.canviarTipus(TIPOS_CASILLA.RAIL_PUENTE)
    this.puentes -= 1
    return true
  }

  // vía de nieve: convierte NEU en RAIL_NEU, consume 1 via_nieve crafteada
  colocarViaNeu(casella) {
    if (!casella || casella.tipus !== TIPOS_CASILLA.NEU || this.vias_nieve <= 0) {
      return false
    }
    casella.canviarTipus(TIPOS_CASILLA.RAIL_NEU)
    this.vias_nieve -= 1
    return true
  }
}
