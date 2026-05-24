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

// 5 niveles con dificultad progresiva
// niveles 1-2: el reto está en elegir bien qué destruir y qué construir
// niveles 3-5: múltiples rutas falsas con costes distintos (estrellas o derrota)
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
      [T, o, T, A, A, A, o, T],
      [T, o, T, A, A, A, o, T],
      [T, o, T, T, T, T, o, T],
      [T, B, o, R, B, R, o, M],
    ],
    railsInicials: 8,
    limitsAccions: { tales: 2, destruccions: 3 },
    llindarsEstrelles: [14, 17],
  },

  // Nivel 4 (7x8): zona central de nieve con piedras dentro, sin bosques
  // los rails normales son los que arrancas, el resto son vías de nieve
  // crafteadas con piedra. picar la piedra equivocada te deja sin material
  {
    nom: 'Glaciar',
    mapaInicial: [
      [T, T, T, T, T, T, T, T],
      [I, o, o, T, T, T, T, T],
      [T, T, N, N, N, N, T, T],
      [T, N, N, R, R, N, T, T],
      [T, N, R, N, N, R, N, T],
      [T, T, N, N, N, N, o, T],
      [T, T, T, T, T, o, o, M],
    ],
    railsInicials: 5,
    limitsAccions: { tales: 0, destruccions: 4 },
    llindarsEstrelles: [13, 16],
  },

  {
    nom: 'Testeo',
    mapaInicial: [
      [T, T, I, A, T, T, T, T, T],
      [T, T, N, A, T, T, T, T, T],
      [T, T, N, A, T, T, T, T, T],
      [T, T, N, B, S, R, T, T, T],
      [T, T, T, B, R, R, T, T, T],
      [T, T, T, B, B, R, T, T, T],
      [T, T, T, B, S, R, A, T, T],
      [T, T, T, T, T, N, A, T, T],
      [T, T, T, T, T, N, A, T, T],
      [T, T, T, T, T, N, M, T, T],
    ],
    railsInicials: 2,
    limitsAccions: { tales: 5, destruccions: 5 },
    llindarsEstrelles: [20, 25],
  },

  
  // Nivel 5 (8x9): dos paradas opuestas, lago grande y zona de nieve
  // hay tres caminos aparentes; sólo uno toca ambas paradas con los recursos justos
  // los otros dos llegan a la meta pero sin parada (no es victoria)
  {
    nom: 'El infierno',
    mapaInicial: [
      [T, T, T, T, T, T, T, T, T],
      [I, o, o, o, o, T, B, R, T],
      [T, o, T, T, o, T, T, T, T],
      [T, S, o, T, o, A, A, o, T],
      [T, T, o, T, o, A, A, o, T],
      [T, o, o, o, o, T, T, o, T],
      [T, o, T, T, T, T, N, S, T],
      [T, o, o, o, o, o, N, o, M],
    ],
    railsInicials: 8,
    limitsAccions: { tales: 2, destruccions: 5 },
    llindarsEstrelles: [18, 22],
  },

  
]
