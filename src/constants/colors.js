import { TIPOS_CASILLA } from './tiposCasella.js'

// cada variante de RAIL tiene su propio color para que el jugador identifique de un vistazo el origen
export const COLORS_CASELLA = {
  [TIPOS_CASILLA.PLA]:         0x90EE90,
  [TIPOS_CASILLA.BOSC]:        0x228B22,
  [TIPOS_CASILLA.PIEDRA]:      0x808080,
  [TIPOS_CASILLA.AGUA]:        0x4169E1,
  [TIPOS_CASILLA.NEU]:         0xE0FFFF,
  [TIPOS_CASILLA.MONTANYA]:    0x7D6B50,
  [TIPOS_CASILLA.PARADA]:      0xFFB347,
  [TIPOS_CASILLA.RAIL]:        0x8B4513,
  [TIPOS_CASILLA.RAIL_PUENTE]: 0x5B7A99,
  [TIPOS_CASILLA.RAIL_NEU]:    0x9BD1E3,
  [TIPOS_CASILLA.RAIL_PARADA]: 0xB45A1F,
  [TIPOS_CASILLA.INICI]:       0xFFD700,
  [TIPOS_CASILLA.META]:        0xFF4500,
}
