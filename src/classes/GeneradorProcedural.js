import { TIPOS_CASILLA } from '../constants/tiposCasella.js'

// tamaño de cuadrícula por dificultad (índice 0 = dif 1)
const MIDES = [5, 7, 9, 12, 16]

// probabilidad de BOSC y OBSTACLE por dificultad; el resto del espacio es PLA
const PROPORCIONS = [
  { bosc: 0.08, obstacle: 0.05 },
  { bosc: 0.12, obstacle: 0.08 },
  { bosc: 0.16, obstacle: 0.11 },
  { bosc: 0.20, obstacle: 0.14 },
  { bosc: 0.25, obstacle: 0.18 },
]

// convierte string o número en entero de 32 bits para inicializar el PRNG
function hashSeed(seed) {
  if (typeof seed === 'number') return seed | 0
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0
  }
  return h
}

/*
  mulberry32: PRNG de 32 bits rápido y determinista.
  La misma semilla siempre produce la misma secuencia de floats en [0, 1).
*/
function crearPRNG(seed) {
  let s = hashSeed(seed)
  return function () {
    s = s + 0x6D2B79F5 | 0
    let t = Math.imul(s ^ s >>> 15, 1 | s)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

/*
  Generador procedural de niveles por semilla.
  La misma combinación (seed, dificultad) siempre produce el mismo mapa y recursos.
*/
export class GeneradorProcedural {

  /*
    Devuelve un objeto de configuración listo para pasarlo a new Nivell({ ... }).
    seed: string o número. dificultad: entero 1-5.
  */
  generar(seed, dificultad) {
    const dif  = Math.max(1, Math.min(5, Math.round(dificultad)))
    const rand = crearPRNG(seed)

    const mida     = MIDES[dif - 1]
    const files    = mida
    const columnes = mida
    const prop     = PROPORCIONS[dif - 1]

    // INICI en el borde izquierdo, META en el borde derecho; filas elegidas al azar
    const iniciRow = Math.floor(rand() * files)
    const metaRow  = Math.floor(rand() * files)

    // construye la cuadrícula celda a celda
    const mapaInicial = []
    for (let f = 0; f < files; f++) {
      const fila = []
      for (let c = 0; c < columnes; c++) {
        // posiciones fijas de inicio y meta
        if (c === 0 && f === iniciRow)          { fila.push(TIPOS_CASILLA.INICI); continue }
        if (c === columnes - 1 && f === metaRow) { fila.push(TIPOS_CASILLA.META);  continue }

        // vecinos inmediatos de INICI y META siempre PLA para evitar bloqueo en el primer paso
        const esVeinaInici = c === 1 && f === iniciRow
        const esVeinaMeta  = c === columnes - 2 && f === metaRow
        if (esVeinaInici || esVeinaMeta) { fila.push(TIPOS_CASILLA.PLA); continue }

        // resto: distribución probabilística según la dificultad
        const r = rand()
        if (r < prop.bosc) {
          fila.push(TIPOS_CASILLA.BOSC)
        } else if (r < prop.bosc + prop.obstacle) {
          fila.push(TIPOS_CASILLA.OBSTACLE)
        } else {
          fila.push(TIPOS_CASILLA.PLA)
        }
      }
      mapaInicial.push(fila)
    }

    // cuenta terrenos reales para dimensionar recursos tras la generación
    const celdas        = mapaInicial.flat()
    const boscCount     = celdas.filter(t => t === TIPOS_CASILLA.BOSC).length
    const obstacleCount = celdas.filter(t => t === TIPOS_CASILLA.OBSTACLE).length

    // distancia mínima en celdas PLA que necesitan rail para conectar INICI con META
    // (columnas intermedias + desplazamiento vertical)
    const distMin = (columnes - 2) + Math.abs(iniciRow - metaRow)

    // margen del 40% sobre el mínimo para asegurar que el nivel es pasable
    const railsInicials           = Math.ceil(distMin * 1.4)
    const talesDisponibles        = Math.max(1, Math.ceil(boscCount * 0.4))
    const destruccionsDisponibles = Math.max(1, Math.ceil(obstacleCount * 0.4))

    // umbrales de estrellas; llindar2 siempre al menos 2 acciones por encima de llindar3
    const llindar3 = distMin + 2
    const llindar2 = Math.max(llindar3 + 2, distMin + Math.ceil(distMin * 0.5))

    return {
      nom: `Nivel S${seed}-D${dif}`,
      mapaInicial,
      railsInicials,
      llindarsEstrelles: [llindar3, llindar2],
      limitsAccions: {
        tales:        talesDisponibles,
        destruccions: destruccionsDisponibles,
      }
    }
  }
}
