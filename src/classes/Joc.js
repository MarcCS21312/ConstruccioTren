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

  // Coloca un rail; devuelve éxito, victoria o derrota según el resultado
  colocarRailEn(fila, columna) {
    // validaciones previas: mapa, posición y posibilidad de colocar
    if (!this.mapa) {
      return { success: false, error: 'no_mapa' }
    }

    const casella = this.mapa.obtenirCasella(fila, columna)
    if (!casella) {
      return { success: false, error: 'posicio_invalid' }
    }

    const placed = this.jugador.colocarRail(casella)
    if (!placed) {
      return { success: false, error: 'no_pot_colocar' }
    }

    this.accionsUsades++

    // comprueba victoria tras colocar el rail
    if (this.comprovarVictoria()) {
      const resultat = this.finalitzarPartida()
      return { success: true, victoria: true, estrelles: resultat.estrelles }
    }

    // sin rails restantes: comprueba si todavía es posible obtener más
    if (this.jugador.rails <= 0) {
      const boscsRestants = this.mapa.contarTipus(TIPOS_CASILLA.BOSC)
      const talesDisponibles = this.jugador.talesDisponibles

      // los obstáculos no generan rails al destruirse, solo los bosques talados
      if (talesDisponibles <= 0 || boscsRestants === 0) {
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
