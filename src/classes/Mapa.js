import { Casella } from './Casella.js'
import { TIPOS_CASILLA } from '../constants/tiposCasella.js'

// vecinos ortogonales (sin diagonales) usados en la búsqueda de camino
const DIRECCIONS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1]
]

// Matriz de Casella con consultas, búsqueda de posición y validación de camino
export class Mapa {
  constructor(caselles = []) {
    this.caselles = this.normalitzarCaselles(caselles)
    this.mida = {
      files: this.caselles.length,
      columnes: this.caselles[0]?.length ?? 0
    }
  }

  // acepta tanto strings de tipo como instancias Casella ya creadas
  normalitzarCaselles(caselles) {
    return caselles.map((fila) => fila.map((casella) => casella instanceof Casella ? casella : new Casella(casella)))
  }

  // @returns {Casella|null}
  obtenirCasella(fila, columna) {
    return this.caselles[fila]?.[columna] ?? null
  }

  reiniciar(mapaInicial) {
    this.caselles = mapaInicial.map((fila) => fila.map((tipus) => new Casella(tipus)))
    this.mida = {
      files: this.caselles.length,
      columnes: this.caselles[0]?.length ?? 0
    }
  }

  // @returns {{fila:number, columna:number}|null}
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

  // BFS sobre casillas conectadas (RAIL, INICIO, META) buscando la meta desde el inicio
  comprovarCami() {
    const inici = this.trobarPosicio(TIPOS_CASILLA.INICI)
    const meta = this.trobarPosicio(TIPOS_CASILLA.META)

    if (!inici || !meta) {
      return false
    }

    // estructuras de la búsqueda en anchura
    const visitades = new Set()
    const cua = [inici]

    while (cua.length > 0) {
      const actual = cua.shift()
      const clau = `${actual.fila},${actual.columna}`

      if (visitades.has(clau)) {
        continue
      }

      visitades.add(clau)

      // condición de éxito: hemos llegado a la meta
      if (actual.fila === meta.fila && actual.columna === meta.columna) {
        return true
      }

      // explora los 4 vecinos ortogonales y encola los conectables
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
