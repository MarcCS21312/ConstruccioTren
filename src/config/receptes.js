import { TIPOS_CASILLA } from '../constants/tiposCasella.js'

// las claves de ingredients y efecte coinciden con propiedades de Jugador
export const RECEPTES = [
  {
    id: 'destral_afilada',
    nom: 'Hacha Afilada',
    icona: '🪓',
    descripcio: '+1 tala disponible',
    ingredients: { rails: 2 },
    efecte: { talesDisponibles: 1 }
  },
  {
    id: 'pic_reforcat',
    nom: 'Pico Reforzado',
    icona: '⛏️',
    descripcio: '+1 destrucción disponible',
    ingredients: { rails: 2 },
    efecte: { destruccionsDisponibles: 1 }
  },
  {
    id: 'paquet_rails',
    nom: 'Paquete de Vías',
    icona: '🛤️',
    descripcio: '+2 vías',
    ingredients: { talesDisponibles: 1, destruccionsDisponibles: 1 },
    efecte: { rails: 2 }
  }
]
