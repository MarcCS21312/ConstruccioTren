import { Jugador } from './Jugador.js'
import { Mapa } from './Mapa.js'
import { SistemaEstrelles } from './SistemaEstrelles.js'
import { Nivell } from './Nivell.js'
import { TIPOS_CASILLA } from '../constants/tiposCasella.js'

/**
 * Classe principal que organitza l'estat del joc per nivell.
 * estat pot ser 'inactiu', 'jugant', 'victoria' o 'derrota'.
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

  /**
   * Coloca un rail en la posición indicada si el jugador tiene rails.
   * Después de colocar, comprueba victoria. Si no hay rails y no hay
   * posibilidad de obtener más (no quedan `BOSC` o no quedan tales disponibles),
   * marca derrota.
   * @param {number} fila
   * @param {number} columna
   * @returns {{success:boolean, victoria?:boolean, derrota?:boolean, estrelles?:number}}
   */
  colocarRailEn(fila, columna) {
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

    // Comprovar si amb aquest rail s'ha aconseguit la victòria
    if (this.comprovarVictoria()) {
      const resultat = this.finalitzarPartida()
      return { success: true, victoria: true, estrelles: resultat.estrelles }
    }

    // Si no queden rails, comprovar si hi ha manera d'obtenir-ne més
    if (this.jugador.rails <= 0) {
      const boscsRestants = this.mapa.contarTipus(TIPOS_CASILLA.BOSC)
      const talesDisponibles = this.jugador.talesDisponibles

      // Els obstacles no donen rails, així que només els boscs poden generar-ne
      if (talesDisponibles <= 0 || boscsRestants === 0) {
        const resultat = this.finalitzarPartida()
        return { success: true, derrota: true, estrelles: resultat.estrelles }
      }
    }

    return { success: true, victoria: false, derrota: false }
  }

  /**
   * Inicia el joc amb una instancia de `Nivell`.
   * Crea `Mapa` i `Jugador` segons la configuració del nivell.
   * @param {Nivell} nivell
   * @returns {Joc} retorna `this` per encadenar
   */
  iniciarJoc(nivell) {
    if (!(nivell instanceof Nivell)) {
      throw new Error('Cal passar una instancia valida de Nivell')
    }

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

  /**
   * Comprova si s'ha arribat a la condició de victòria (camí complet).
   * @returns {boolean}
   */
  comprovarVictoria() {
    if (!this.mapa) {
      return false
    }

    return this.mapa.comprovarCami()
  }

  /**
   * Finalitza la partida i calcula les estrelles obtingudes.
   * @returns {{victoria:boolean, estrelles:number}}
   */
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