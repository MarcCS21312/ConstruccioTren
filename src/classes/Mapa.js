import { Casella } from './Casella.js'
import { TIPOS_CASILLA } from './tiposCasella.js'

/**
 * Representa el mapa del nivell com una matriu de `Casella`.
 * Provee metodes de consulta i validació de camí.
 */
export class Mapa {
  /**
   * @param {Array<Array<string|Casella>>} caselles - Matriu inicial (tipus o instancies de Casella)
   */
  constructor(caselles = []) {
    this.caselles = this.normalitzarCaselles(caselles)
    this.mida = {
      files: this.caselles.length,
      columnes: this.caselles[0]?.length ?? 0
    }
  }

  /**
   * Normalitza l'entrada a instancies de `Casella`.
   * @private
   */
  normalitzarCaselles(caselles) {
    return caselles.map((fila) => fila.map((casella) => casella instanceof Casella ? casella : new Casella(casella)))
  }

}