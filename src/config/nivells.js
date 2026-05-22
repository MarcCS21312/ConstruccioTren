import { TIPOS_CASILLA } from '../constants/tiposCasella.js'

// nivel de pruebas; sirve de plantilla para futuros niveles definidos en datos
export const NIVELL_PROVA = {
  nom: 'Nivell de prova',
  mapaInicial: [
    [TIPOS_CASILLA.INICI, TIPOS_CASILLA.PLA, TIPOS_CASILLA.BOSC, TIPOS_CASILLA.PLA, TIPOS_CASILLA.META],
    [TIPOS_CASILLA.PLA, TIPOS_CASILLA.OBSTACLE, TIPOS_CASILLA.PLA, TIPOS_CASILLA.BOSC, TIPOS_CASILLA.PLA],
    [TIPOS_CASILLA.PLA, TIPOS_CASILLA.PLA, TIPOS_CASILLA.PLA, TIPOS_CASILLA.PLA, TIPOS_CASILLA.PLA]
  ],
  railsInicials: 2,
  llindarsEstrelles: [3, 5],
  limitsAccions: {
    tales: 1,
    destruccions: 1,
    rails: 2
  }
}
