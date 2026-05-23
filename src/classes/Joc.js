import { Jugador } from './Jugador.js'
import { Mapa } from './Mapa.js'
import { SistemaEstrelles } from './SistemaEstrelles.js'
import { Nivell } from './Nivell.js'
import { TIPOS_CASILLA } from '../constants/tiposCasella.js'

/*
  Orquesta el estado de la partida: mapa, jugador, estrellas y resultado.
  `estat` puede ser 'inactiu', 'jugant', 'victoria' o 'derrota'.
*/
export class Joc {
  constructor(nivellActual = null) {
    this.nivellActual = nivellActual
    this.jugador = null
    this.mapa = null
    this.sistemaEstrelles = new SistemaEstrelles()
    this.accionsUsades = 0
    this.estat = 'inactiu'
  }

  // coloca una vía en (fila, columna) enrutando al método correcto según el terreno
  colocarRailEn(fila, columna) {
    if (!this.mapa) {
      return { success: false, error: 'no_mapa' }
    }

    const casella = this.mapa.obtenirCasella(fila, columna)
    if (!casella) {
      return { success: false, error: 'posicio_invalid' }
    }

    // NEU → via_nieve; AGUA (franqueable) → puente; PLA → rail normal
    let placed
    if (casella.tipus === TIPOS_CASILLA.NEU) {
      placed = this.jugador.colocarViaNeu(casella)
    } else if (casella.esFranqueable()) {
      placed = this.jugador.colocarPuente(casella)
    } else {
      placed = this.jugador.colocarRail(casella)
    }

    if (!placed) {
      return { success: false, error: 'no_pot_colocar' }
    }

    this.accionsUsades++

    // comprueba victoria tras colocar el rail
    if (this.comprovarVictoria()) {
      const resultat = this.finalitzarPartida()
      return { success: true, victoria: true, estrelles: resultat.estrelles }
    }

    // derrota si no quedan recursos de colocación ni forma de conseguir más
    const sinColoctació = this.jugador.rails <= 0
      && this.jugador.puentes <= 0
      && this.jugador.vias_nieve <= 0

    if (sinColoctació) {
      const potCraftarRail = this.jugador.madera >= 1 && this.jugador.piedra >= 1
      const potCraftarPont = this.jugador.madera >= 2
      const potCraftarNeu  = this.jugador.piedra >= 2
      const boscsRestants  = this.mapa.contarTipus(TIPOS_CASILLA.BOSC)
      const pedresRestants = this.mapa.contarTipus(TIPOS_CASILLA.PIEDRA)
      const potRecollir    = (this.jugador.talesDisponibles > 0 && boscsRestants > 0)
        || (this.jugador.destruccionsDisponibles > 0 && pedresRestants > 0)

      if (!potCraftarRail && !potCraftarPont && !potCraftarNeu && !potRecollir) {
        const resultat = this.finalitzarPartida()
        return { success: true, derrota: true, estrelles: resultat.estrelles }
      }
    }

    return { success: true, victoria: false, derrota: false }
  }

  // @param {Nivell} nivell @returns {Joc} this para encadenar
  iniciarJoc(nivell) {
    if (!(nivell instanceof Nivell)) {
      throw new Error('Cal passar una instancia valida de Nivell')
    }

    // arranca un nuevo mapa, jugador y sistema de estrellas a partir del nivel
    const estatNivell = nivell.iniciarNivell()
    this.nivellActual = nivell
    this.mapa = new Mapa(estatNivell.mapaInicial)
    this.jugador = new Jugador(
      estatNivell.railsInicials,
      estatNivell.limitsAccions.tales,
      estatNivell.limitsAccions.destruccions
    )
    this.sistemaEstrelles = new SistemaEstrelles(estatNivell.llindarsEstrelles)
    this.accionsUsades = 0
    this.estat = 'jugant'

    return this
  }

  comprovarVictoria() {
    if (!this.mapa) {
      return false
    }
    return this.mapa.comprovarCami()
  }

  // cambia el estado a victoria/derrota y calcula las estrellas obtenidas
  finalitzarPartida() {
    const victoria = this.comprovarVictoria()
    this.estat = victoria ? 'victoria' : 'derrota'
    return {
      victoria,
      estrelles: this.sistemaEstrelles.calcularEstrelles({
        victoria,
        accionsUsades: this.accionsUsades
      })
    }
  }
}
