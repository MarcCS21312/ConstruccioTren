import { TIPOS_CASILLA } from '../constants/tiposCasella.js'

// tamaño de cuadrícula por dificultad (índice 0 = dif 1)
const MIDES = [5, 7, 9, 10, 12]

// probabilidad base de BOSC y PIEDRA; dif 3-5 escala la zona izquierda x2
const PROPORCIONS = [
  { bosc: 0.12, obstacle: 0.08 },
  { bosc: 0.16, obstacle: 0.11 },
  { bosc: 0.20, obstacle: 0.14 },
  { bosc: 0.22, obstacle: 0.15 },
  { bosc: 0.24, obstacle: 0.17 },
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

// convierte celdas PLA del área [col 2, colFi) a `tipus` hasta alcanzar el mínimo requerido
function _completarRecursos(mapa, files, colFi, tipus, minim) {
  let count = mapa.flat().filter(t => t === tipus).length
  for (let f = 0; f < files && count < minim; f++) {
    for (let c = 2; c < colFi && count < minim; c++) {
      if (mapa[f][c] === TIPOS_CASILLA.PLA) {
        mapa[f][c] = tipus
        count++
      }
    }
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
    const dif      = Math.max(1, Math.min(5, Math.round(dificultad)))
    const rand     = crearPRNG(seed)
    const mida     = MIDES[dif - 1]
    const files    = mida
    const columnes = mida
    const prop     = PROPORCIONS[dif - 1]

    // INICI en el borde izquierdo, META en el borde derecho; filas elegidas al azar
    const iniciRow = Math.floor(rand() * files)
    const metaRow  = Math.floor(rand() * files)

    // barrera vertical en la columna central (solo dif >= 3)
    const usaBarrera  = dif >= 3
    const colBarrera  = Math.floor(columnes / 2)
    // dif3=agua, dif4=montanya, dif5=montanya con tramos de neu
    const tipusBase   = dif === 3 ? TIPOS_CASILLA.AGUA : TIPOS_CASILLA.MONTANYA

    // elige filas donde la barrera tiene un agujero (paso alternativo sin material especial)
    const numAgujeros = dif >= 4 ? 2 : 1
    const filesAgujero = new Set()
    let intentos = 0
    while (filesAgujero.size < numAgujeros && intentos < files * 10) {
      const f = Math.floor(rand() * files)
      if (f !== iniciRow && f !== metaRow) filesAgujero.add(f)
      intentos++
    }
    // fallback: toma la primera fila disponible si el PRNG no encontró candidatas
    if (filesAgujero.size === 0) {
      for (let f = 0; f < files; f++) {
        if (f !== iniciRow && f !== metaRow) { filesAgujero.add(f); break }
      }
    }

    // construye la cuadrícula celda a celda
    const mapaInicial = []
    for (let f = 0; f < files; f++) {
      const fila = []
      for (let c = 0; c < columnes; c++) {
        // posiciones fijas de inicio y meta
        if (c === 0 && f === iniciRow)           { fila.push(TIPOS_CASILLA.INICI); continue }
        if (c === columnes - 1 && f === metaRow) { fila.push(TIPOS_CASILLA.META);  continue }

        // vecinos inmediatos de INICI y META siempre PLA para evitar bloqueo en el primer paso
        const esVeinaInici = c === 1 && f === iniciRow
        const esVeinaMeta  = c === columnes - 2 && f === metaRow
        if (esVeinaInici || esVeinaMeta) { fila.push(TIPOS_CASILLA.PLA); continue }

        if (usaBarrera && c === colBarrera) {
          if (filesAgujero.has(f)) {
            // agujero: PLA para paso libre o PIEDRA para paso con pico (alterna por fila)
            fila.push(f % 2 === 0 ? TIPOS_CASILLA.PLA : TIPOS_CASILLA.PIEDRA)
          } else if (dif === 5 && rand() < 0.45) {
            // dif5: parte de la barrera es NEU, cruzable crafteando una via_nieve
            fila.push(TIPOS_CASILLA.NEU)
          } else {
            fila.push(tipusBase)
          }
          continue
        }

        if (usaBarrera && c > colBarrera) {
          // lado derecho despejado: el reto está en cruzar la barrera, no en llegar a META
          fila.push(TIPOS_CASILLA.PLA)
          continue
        }

        // lado izquierdo (o mapa completo para dif 1-2): distribución probabilística
        const escala = usaBarrera ? 2.0 : 1.0
        const r = rand()
        if (r < prop.bosc * escala) {
          fila.push(TIPOS_CASILLA.BOSC)
        } else if (r < (prop.bosc + prop.obstacle) * escala) {
          fila.push(TIPOS_CASILLA.PIEDRA)
        } else {
          fila.push(TIPOS_CASILLA.PLA)
        }
      }
      mapaInicial.push(fila)
    }

    // distancia mínima de celdas intermedias entre INICI y META
    const distMin = (columnes - 2) + Math.abs(iniciRow - metaRow)

    // madera mínima: via_normal cuesta madera:1, puente cuesta madera:2 adicional
    const maderaMin = dif === 3 ? distMin + 1         // (distMin-1) via_normal + 1 puente
                    : dif === 5 ? Math.max(1, distMin - 1)  // (distMin-1) via_normal + 1 neu (sin madera)
                    : distMin                          // solo via_normal en dif 1, 2 y 4

    // piedra mínima: via_normal cuesta piedra:1, via_nieve cuesta piedra:2 adicional
    const piedraMin = dif === 5 ? distMin + 1         // (distMin-1) via_normal + 1 via_nieve
                    : dif === 3 ? Math.max(1, distMin - 1)  // puente no consume piedra
                    : distMin                          // solo via_normal en dif 1, 2 y 4

    // garantiza los recursos mínimos en la zona accesible antes de la barrera
    const colFiRecursos = usaBarrera ? colBarrera : columnes - 1
    _completarRecursos(mapaInicial, files, colFiRecursos, TIPOS_CASILLA.BOSC, maderaMin)
    _completarRecursos(mapaInicial, files, colFiRecursos, TIPOS_CASILLA.PIEDRA, piedraMin)

    // herramientas exactas para superar el camino mínimo más 1 de margen
    const talesDisponibles        = maderaMin + 1
    const destruccionsDisponibles = Math.max(1, piedraMin + 1)

    // umbrales de estrellas; llindar2 siempre al menos 2 acciones por encima de llindar3
    const llindar3 = distMin + 2
    const llindar2 = Math.max(llindar3 + 2, distMin + Math.ceil(distMin * 0.5))

    return {
      nom:              `Nivel S${seed}-D${dif}`,
      mapaInicial,
      railsInicials:    0,
      llindarsEstrelles: [llindar3, llindar2],
      limitsAccions: {
        tales:        talesDisponibles,
        destruccions: destruccionsDisponibles,
      }
    }
  }
}
