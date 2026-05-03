import { Jugador } from './Jugador.js'
import { Mapa } from './Mapa.js'
import { SistemaEstrelles } from './SistemaEstrelles.js'
import { Nivell } from './Nivell.js'

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
    this.estat = 'inactiu'
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
    this.estat = 'jugant'

    return this
  }

}