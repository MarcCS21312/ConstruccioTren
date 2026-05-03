import { Casella } from './Casella.js'
import { TIPOS_CASILLA } from './tiposCasella.js'

const DIRECCIONS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1]
]

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

  /**
   * Retorna la casella a la posició indicada o `null` si no existeix.
   * @param {number} fila
   * @param {number} columna
   * @returns {Casella|null}
   */
  obtenirCasella(fila, columna) {
    return this.caselles[fila]?.[columna] ?? null
  }

  /**
   * Troba la primera posició d'una casella d'un tipus concret.
   * @param {string} tipusBuscat
   * @returns {{fila:number, columna:number}|null}
   */
  trobarPosicio(tipusBuscat) {
    for (let fila = 0; fila < this.caselles.length; fila += 1) {
      for (let columna = 0; columna < this.caselles[fila].length; columna += 1) {
        if (this.caselles[fila][columna].tipus === tipusBuscat) {
          return { fila, columna }
        }
      }
    }

    return null
  }

  /**
   * Conta quantes caselles hi ha d'un tipus determinat.
   * Útil per comprovar si encara hi ha `BOSC` disponibles per talar.
   * @param {string} tipus
   * @returns {number}
   */
  contarTipus(tipus) {
    let comptador = 0
    for (let fila = 0; fila < this.caselles.length; fila += 1) {
      for (let columna = 0; columna < this.caselles[fila].length; columna += 1) {
        if (this.caselles[fila][columna].tipus === tipus) {
          comptador += 1
        }
      }
    }

    return comptador
  }

  /**
   * Comprova si existeix un camí de rails que connecti `INICI` amb `META`.
   * Utilitza cerca per amplitud (BFS) sobre caselles amb `RAIL`, `INICI` o `META`.
   * @returns {boolean}
   */
  comprovarCami() {
    const inici = this.trobarPosicio(TIPOS_CASILLA.INICI)
    const meta = this.trobarPosicio(TIPOS_CASILLA.META)

    if (!inici || !meta) {
      return false
    }

    const visitades = new Set()
    const cua = [inici]

    while (cua.length > 0) {
      const actual = cua.shift()
      const clau = `${actual.fila},${actual.columna}`

      if (visitades.has(clau)) {
        continue
      }

      visitades.add(clau)

      if (actual.fila === meta.fila && actual.columna === meta.columna) {
        return true
      }

      for (const [deltaFila, deltaColumna] of DIRECCIONS) {
        const novaFila = actual.fila + deltaFila
        const novaColumna = actual.columna + deltaColumna
        const casella = this.obtenirCasella(novaFila, novaColumna)

        if (!casella) {
          continue
        }

        const esConnex = casella.tipus === TIPOS_CASILLA.RAIL || casella.tipus === TIPOS_CASILLA.META || casella.tipus === TIPOS_CASILLA.INICI

        if (esConnex) {
          cua.push({ fila: novaFila, columna: novaColumna })
        }
      }
    }

    return false
  }
}