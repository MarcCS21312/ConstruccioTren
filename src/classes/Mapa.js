import { Casella } from './Casella.js'
import { TIPOS_CASILLA } from '../constants/tiposCasella.js'

// vecinos ortogonales (sin diagonales) usados en la búsqueda de camino
const DIRECCIONS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1]
]

// todas las variantes de RAIL son atravesables por el camino
const TIPUS_CONNEXOS = new Set([
  TIPOS_CASILLA.RAIL,
  TIPOS_CASILLA.RAIL_PUENTE,
  TIPOS_CASILLA.RAIL_NEU,
  TIPOS_CASILLA.RAIL_PARADA,
  TIPOS_CASILLA.INICI,
  TIPOS_CASILLA.META,
])

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

  // BFS desde INICI; la victoria exige llegar a META y tener todas las PARADAs visitadas
  comprovarCami() {
    const inici = this.trobarPosicio(TIPOS_CASILLA.INICI)
    const meta  = this.trobarPosicio(TIPOS_CASILLA.META)
    if (!inici || !meta) return false

    // PARADAs sin convertir en RAIL_PARADA significa que aún faltan visitar
    if (this.contarTipus(TIPOS_CASILLA.PARADA) > 0) return false

    const visitades = new Set()
    const cua = [inici]

    while (cua.length > 0) {
      const actual = cua.shift()
      const clau = `${actual.fila},${actual.columna}`
      if (visitades.has(clau)) continue
      visitades.add(clau)

      for (const [df, dc] of DIRECCIONS) {
        const nf = actual.fila + df
        const nc = actual.columna + dc
        const casella = this.obtenirCasella(nf, nc)
        if (casella && TIPUS_CONNEXOS.has(casella.tipus)) {
          cua.push({ fila: nf, columna: nc })
        }
      }
    }

    // META alcanzable desde INICI
    if (!visitades.has(`${meta.fila},${meta.columna}`)) return false

    // todas las RAIL_PARADA deben estar conectadas al camino principal
    for (let f = 0; f < this.mida.files; f++) {
      for (let c = 0; c < this.mida.columnes; c++) {
        if (this.caselles[f][c].tipus === TIPOS_CASILLA.RAIL_PARADA) {
          if (!visitades.has(`${f},${c}`)) return false
        }
      }
    }
    return true
  }
}
