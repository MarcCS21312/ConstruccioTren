import { TIPOS_CASILLA } from '../constants/tiposCasella.js'

// abreviaturas para mapas legibles
const o = TIPOS_CASILLA.PLA
const I = TIPOS_CASILLA.INICI
const M = TIPOS_CASILLA.META
const B = TIPOS_CASILLA.BOSC
const R = TIPOS_CASILLA.PIEDRA
const A = TIPOS_CASILLA.AGUA
const N = TIPOS_CASILLA.NEU
const T = TIPOS_CASILLA.MONTANYA
const S = TIPOS_CASILLA.PARADA

export const CAMPANA = [

  // Nivel 1 (5x7): dos rutas posibles. la corta requiere romper obstáculos exactos
  // la larga pasa por bosques que parecen un atajo pero gastan más rails
  {
    nom: 'Decisiones',
    mapaInicial: [
      [T, T, T, T, T, T, T],
      [I, o, B, o, R, o, T],
      [T, o, T, T, T, o, T],
      [T, B, R, B, R, o, M],
      [T, T, T, T, T, T, T],
    ],
    railsInicials: 6,
    limitsAccions: { tales: 2, destruccions: 2 },
    llindarsEstrelles: [6, 8],
  },

  // Nivel 2 (6x7): bosques y piedras superan a las herramientas disponibles
  // hay que elegir qué 3 talar y qué 3 picar para que cuadre el material
  {
    nom: 'Elige sabiamente',
    mapaInicial: [
      [T, T, T, T, T, T, T],
      [I, o, B, o, o, B, T],
      [T, o, T, R, T, o, T],
      [T, R, T, o, T, R, T],
      [T, o, T, B, T, o, T],
      [T, o, o, o, o, o, M],
    ],
    railsInicials: 6,
    limitsAccions: { tales: 3, destruccions: 3 },
    llindarsEstrelles: [9, 11],
  },

  // Nivel 3 (7x8): lago grande de 2x3 que parece cruzable con puentes
  // pero la madera no llega; la única solución es rodearlo por el sur
  {
    nom: 'Lago profundo',
    mapaInicial: [
      [T, T, T, T, T, T, T, T],
      [I, o, o, o, o, o, o, T],
      [T, o, T, T, T, T, o, T],
      [T, A, A, A, A, A, o, T],
      [T, A, A, A, A, A, o, T],
      [T, o, T, T, T, T, o, T],
      [T, B, o, R, B, R, o, M],
    ],
    railsInicials: 8,
    limitsAccions: { tales: 2, destruccions: 3 },
    llindarsEstrelles: [14, 17],
  },

  // Nivel 4 (7x8): Puzzle de economía exacta. Sin bosques → sin madera → sin vías ni puentes extra.
  // Camino único forzado: 5 PLA (vías iniciales) + 6 NEU (vías de nieve fabricadas).
  // Economía justa: 6 piedras visibles × 2 = 12 unidades de piedra = 6 vías de nieve. Sin margen.
  // Cualquier vía normal o de nieve mal colocada → derrota irreversible.
  {
    nom: 'Glaciar',
    mapaInicial: [
      [T, T, T, T, T, T, T, T],
      [I, N, N, N, N, N, N, T], 
      [T, o, R, N, N, N, N, T], 
      [T, o, N, N, N, R, N, T], 
      [T, o, R, o, R, N, N, T], 
      [T, o, o, o, o, N, M, T], 
      [T, T, T, T, T, T, T, T],
    ],
    railsInicials: 5,
    limitsAccions: { tales: 0, destruccions: 4 },
    llindarsEstrelles: [13, 15], 
  },

  // Nivel 5 (8x9): Dos paradas opuestas, lago grande y zona de nieve.
  // Hay tres caminos aparentes; solo uno toca ambas paradas con los recursos justos.
  // Los otros dos llegan a la meta, pero sin tocar las paradas (no es victoria).
  {
    nom: 'Espejismo',
    mapaInicial: [
      [T, T, T, T, T, T, T, T],
      [T, I, o, A, N, o, o, T],
      [T, B, N, o, A, R, N, T],
      [T, A, N, R, o, N, A, T],
      [T, R, N, o, N, o, o, T],
      [T, o, B, A, N, A, M, T],
      [T, T, T, T, T, T, T, T],
    ],
    railsInicials: 3,
    limitsAccions: { tales: 2, destruccions: 3 },
    llindarsEstrelles: [13, 16],
  },

  // Nivel 6 — "El Archipiélago Helado" (8x8)
  // Introduce una falsa sensación de mundo abierto. Múltiples lagos y 
  // zonas nevadas que actúan como sumideros de recursos. Obliga a
  // encontrar el único camino serpenteante que cuadra la economía a cero.
  {
    nom: 'El Archipiélago',
    mapaInicial: [
      [T, T, T, T, T, T, T, T],
      [T, I, N, N, N, N, B, B],
      [T, o, A, T, S, N, T, B], 
      [T, o, o, A, o, T, T, T],
      [T, A, A, T, o, T, M, T],
      [T, A, R, T, N, T, o, T], 
      [T, R, R, T, o, N, A, T], 
      [T, T, T, T, T, T, T, T],
    ],
    railsInicials: 5,
    limitsAccions: { tales: 3, destruccions: 3 },
    llindarsEstrelles: [17, 20],
  }
]
