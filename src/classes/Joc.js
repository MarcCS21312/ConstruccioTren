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
}