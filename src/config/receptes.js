// las claves de ingredients y efecte coinciden con propiedades de Jugador
export const RECEPTES = [
  {
    id: 'via_normal',
    nom: 'Vía Normal',
    icona: '🛤️',
    descripcio: 'construye 1 vía de tren',
    ingredients: { madera: 1, piedra: 1 },
    efecte: { rails: 1 }
  },
  {
    id: 'puente',
    nom: 'Puente de Madera',
    icona: '🌉',
    descripcio: 'permite construir sobre agua',
    ingredients: { madera: 2 },
    efecte: { puentes: 1 }
  },
  {
    id: 'via_nieve',
    nom: 'Vía de Nieve',
    icona: '❄️',
    descripcio: 'construye 1 vía sobre nieve',
    ingredients: { piedra: 2 },
    efecte: { vias_nieve: 1 }
  },
]
