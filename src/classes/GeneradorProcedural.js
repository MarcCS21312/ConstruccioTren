import { TIPOS_CASILLA } from '../constants/tiposCasella.js'

// tamaño de cuadrícula por dificultad (índice 0 = dif 1)
const MIDES = [5, 7, 8, 9, 10]

// probabilidad base de BOSC y PIEDRA; dif 3-5 escala la zona izquierda x2
const PROPORCIONS = [
  { bosc: 0.18, obstacle: 0.12 },
  { bosc: 0.20, obstacle: 0.14 },
  { bosc: 0.22, obstacle: 0.15 },
  { bosc: 0.22, obstacle: 0.17 },
  { bosc: 0.24, obstacle: 0.18 },
]

// número de PARADAs intermedias obligatorias por dificultad
const PARADES_PER_DIF = [0, 0, 1, 0, 2]

/*
  Recursos iniciales por dificultad:
  - hacha/pico siempre escasos: cada uso otorga 2 unidades de material
  - railsBase es el suelo mínimo; en mapas grandes escala con distMin
*/
const RECURSOS_PER_DIF = [
  { railsBase: 6,  tales: 1, destruccions: 1 },
  { railsBase: 8,  tales: 2, destruccions: 2 },
  { railsBase: 10, tales: 3, destruccions: 2 },
  { railsBase: 11, tales: 2, destruccions: 3 },
  { railsBase: 14, tales: 3, destruccions: 4 },
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

// coloca una PARADA en una celda PLA accesible; evita filas de INICI/META y casillas especiales
function _colocarParada(mapa, files, columnes, rand, colMin, colMax, iniciRow, metaRow) {
  for (let intent = 0; intent < 60; intent++) {
    const f = Math.floor(rand() * files)
    const c = colMin + Math.floor(rand() * (colMax - colMin))
    if (f === iniciRow || f === metaRow) continue
    if (mapa[f][c] === TIPOS_CASILLA.PLA) {
      mapa[f][c] = TIPOS_CASILLA.PARADA
      return true
    }
  }
  // fallback: primera PLA disponible fuera de filas inicio/meta
  for (let f = 0; f < files; f++) {
    if (f === iniciRow || f === metaRow) continue
    for (let c = colMin; c < colMax; c++) {
      if (mapa[f][c] === TIPOS_CASILLA.PLA) {
        mapa[f][c] = TIPOS_CASILLA.PARADA
        return true
      }
    }
  }
  return false
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
    const recursos = RECURSOS_PER_DIF[dif - 1]

    // INICI en el borde izquierdo, META en el borde derecho; filas elegidas al azar
    const iniciRow = Math.floor(rand() * files)
    const metaRow  = Math.floor(rand() * files)

    // barrera vertical en la columna central (solo dif >= 3)
    const usaBarrera  = dif >= 3
    const colBarrera  = Math.floor(columnes / 2)
    // dif3=agua (puente), dif4=montaña (sólo pasable por agujeros), dif5=montaña + tramos NEU
    const tipusBase   = dif === 3 ? TIPOS_CASILLA.AGUA : TIPOS_CASILLA.MONTANYA

    // filas con agujero (PLA o PIEDRA) en la barrera; cuello de botella obligatorio
    const numAgujeros = dif >= 4 ? 2 : 1
    const filesAgujero = new Set()
    let intentos = 0
    while (filesAgujero.size < numAgujeros && intentos < files * 10) {
      const f = Math.floor(rand() * files)
      if (f !== iniciRow && f !== metaRow) filesAgujero.add(f)
      intentos++
    }
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
        if (c === 0 && f === iniciRow)           { fila.push(TIPOS_CASILLA.INICI); continue }
        if (c === columnes - 1 && f === metaRow) { fila.push(TIPOS_CASILLA.META);  continue }

        const esVeinaInici = c === 1 && f === iniciRow
        const esVeinaMeta  = c === columnes - 2 && f === metaRow
        if (esVeinaInici || esVeinaMeta) { fila.push(TIPOS_CASILLA.PLA); continue }

        if (usaBarrera && c === colBarrera) {
          if (filesAgujero.has(f)) {
            // agujero: PLA o PIEDRA (alterna por fila) para evitar bloqueo total
            fila.push(f % 2 === 0 ? TIPOS_CASILLA.PLA : TIPOS_CASILLA.PIEDRA)
          } else if (dif === 5 && rand() < 0.45) {
            // dif5: parte de la barrera es NEU, cruzable con via_nieve
            fila.push(TIPOS_CASILLA.NEU)
          } else {
            fila.push(tipusBase)
          }
          continue
        }

        if (usaBarrera && c > colBarrera) {
          // lado derecho despejado: el reto está en la barrera y las PARADAs, no en llegar a META
          fila.push(TIPOS_CASILLA.PLA)
          continue
        }

        // lado izquierdo (o mapa completo dif 1-2): distribución probabilística de recursos
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

    // PARADAs: nodos intermedios obligatorios; fuerzan rutas no lineales
    const numParades = PARADES_PER_DIF[dif - 1]
    if (numParades >= 1) {
      // primera PARADA: lado izquierdo si hay barrera, mapa completo si no
      const colMax1 = usaBarrera ? colBarrera : columnes - 1
      _colocarParada(mapaInicial, files, columnes, rand, 2, colMax1, iniciRow, metaRow)
    }
    if (numParades >= 2) {
      // segunda PARADA: lado derecho de la barrera
      const colMin2 = usaBarrera ? colBarrera + 1 : 2
      const colMax2 = columnes - 1
      _colocarParada(mapaInicial, files, columnes, rand, colMin2, colMax2, iniciRow, metaRow)
    }

    // distancia mínima de celdas intermedias entre INICI y META (sin contar PARADAs)
    const distMin = (columnes - 2) + Math.abs(iniciRow - metaRow)

    // madera y piedra requeridas para el camino mínimo + barreras especiales
    const maderaMin = dif === 3 ? distMin + 1
                    : dif === 5 ? Math.max(1, distMin - 1)
                    : distMin
    const piedraMin = dif === 5 ? distMin + 1
                    : dif === 3 ? Math.max(1, distMin - 1)
                    : distMin

    // recursos visibles del jugador: la mitad de la madera/piedra mínima se obtiene del mapa
    // (cada hacha/pico devuelve 2 unidades, así que el mapa necesita menos BOSC/PIEDRA)
    const colFiRecursos = usaBarrera ? colBarrera : columnes - 1
    const boscMin   = Math.max(recursos.tales, Math.ceil(maderaMin / 4))
    const piedraMap = Math.max(recursos.destruccions, Math.ceil(piedraMin / 4))
    _completarRecursos(mapaInicial, files, colFiRecursos, TIPOS_CASILLA.BOSC,   boscMin)
    _completarRecursos(mapaInicial, files, colFiRecursos, TIPOS_CASILLA.PIEDRA, piedraMap)

    // railsInicials escala con distMin para que el jugador siempre tenga base suficiente
    const detourParades = numParades * 3
    const detourBarrera = usaBarrera ? 1 : 0
    const distAjustada  = distMin + detourParades + detourBarrera
    const railsInicials = Math.max(recursos.railsBase, Math.floor(distAjustada * 0.75))

    // umbrales de estrellas; llindar2 al menos 2 acciones por encima de llindar3
    const llindar3 = distAjustada + 2
    const llindar2 = Math.max(llindar3 + 2, distAjustada + Math.ceil(distAjustada * 0.5))

    return {
      nom:              `Nivel S${seed}-D${dif}`,
      mapaInicial,
      railsInicials,
      llindarsEstrelles: [llindar3, llindar2],
      limitsAccions: {
        tales:        recursos.tales,
        destruccions: recursos.destruccions,
      }
    }
  }
}
