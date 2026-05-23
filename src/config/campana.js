import { TIPOS_CASILLA } from '../constants/tiposCasella.js'

// abreviaturas para que los mapas sean legibles a simple vista
const o = TIPOS_CASILLA.PLA       // celda vacía
const I = TIPOS_CASILLA.INICI
const M = TIPOS_CASILLA.META
const B = TIPOS_CASILLA.BOSC
const R = TIPOS_CASILLA.PIEDRA
const A = TIPOS_CASILLA.AGUA
const N = TIPOS_CASILLA.NEU
const T = TIPOS_CASILLA.MONTANYA
const S = TIPOS_CASILLA.PARADA

/*
  Cinco niveles diseñados manualmente con dificultad progresiva.
  Cada nivel introduce un concepto nuevo y obliga a planificar antes de colocar la primera vía.

  llindarsEstrelles: [maxAcciones para 3★, maxAcciones para 2★].
  Las "acciones" cuentan solo colocaciones de vía/puente/vía de nieve (no talas, destrucciones ni crafteos).
*/
export const CAMPANA = [

  // ─────────────────────────────────────────────────────────────
  // Nivel 1 — "Primer trayecto" (5×7)
  // Tutorial: aprende a colocar vías. Sin obstáculos en el camino directo.
  // Hay un bosque y una piedra como "decoración" para experimentar.
  {
    nom: 'Primer trayecto',
    mapaInicial: [
      [o, o, o, o, o, o, o],
      [I, o, B, o, o, o, o],
      [o, o, o, o, R, o, o],
      [o, o, o, o, o, o, M],
      [o, o, o, o, o, o, o],
    ],
    railsInicials: 10,
    limitsAccions: { tales: 1, destruccions: 1 },
    llindarsEstrelles: [8, 11],
  },

  // ─────────────────────────────────────────────────────────────
  // Nivel 2 — "Escasez" (6×7)
  // Pocos rails iniciales: obliga a talar y destruir para craftear más.
  // Hay obstáculos en el camino corto que fuerzan a desviarse o talar.
  {
    nom: 'Escasez',
    mapaInicial: [
      [o, o, o, B, o, o, o],
      [I, o, o, o, o, o, o],
      [o, o, R, o, o, o, o],
      [o, B, o, o, o, o, M],
      [o, o, o, o, R, o, o],
      [o, o, o, o, o, B, o],
    ],
    railsInicials: 5,
    limitsAccions: { tales: 2, destruccions: 2 },
    llindarsEstrelles: [9, 13],
  },

  // ─────────────────────────────────────────────────────────────
  // Nivel 3 — "El río" (7×8)
  // Introduce el puente: hay un río vertical con un único hueco al sur.
  // El hueco es la opción larga; craftear un puente es más eficiente.
  {
    nom: 'El río',
    mapaInicial: [
      [o, o, o, o, A, o, o, o],
      [I, o, o, o, A, o, o, o],
      [o, B, o, o, A, o, o, o],
      [o, o, o, o, A, o, o, M],
      [o, o, o, o, o, o, o, o],
      [o, o, o, o, A, R, o, o],
      [o, o, R, o, A, o, B, o],
    ],
    railsInicials: 8,
    limitsAccions: { tales: 2, destruccions: 1 },
    llindarsEstrelles: [10, 14],
  },

  // ─────────────────────────────────────────────────────────────
  // Nivel 4 — "La estación" (7×8)
  // Introduce la parada: la vía debe pasar por una celda adyacente.
  // La parada está en el centro y se puede tocar desde arriba o desde abajo.
  {
    nom: 'La estación',
    mapaInicial: [
      [o, o, o, o, o, o, o, o],
      [I, o, o, B, o, o, o, o],
      [o, o, o, o, o, o, o, o],
      [o, R, o, o, S, o, o, M],
      [o, o, o, o, o, o, o, o],
      [o, o, o, B, o, R, o, o],
      [o, o, o, o, o, o, o, o],
    ],
    railsInicials: 9,
    limitsAccions: { tales: 2, destruccions: 2 },
    llindarsEstrelles: [10, 14],
  },

  // ─────────────────────────────────────────────────────────────
  // Nivel 5 — "Travesía épica" (8×9)
  // Combina todo: dos paradas, río con puente obligatorio, montaña,
  // nieve opcional y una piedra que bloquea el acceso directo a la meta.
  // Múltiples soluciones: destruir la piedra (corto) o craftear vía de nieve (largo).
  {
    nom: 'Travesía épica',
    mapaInicial: [
      [o, o, o, T, o, o, o, o, o],
      [I, o, o, T, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o],
      [o, o, S, o, A, o, o, o, N],
      [o, B, o, o, A, o, S, R, M],
      [o, o, o, o, A, o, o, o, N],
      [o, o, R, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o],
    ],
    railsInicials: 9,
    limitsAccions: { tales: 2, destruccions: 2 },
    llindarsEstrelles: [13, 17],
  },
]
