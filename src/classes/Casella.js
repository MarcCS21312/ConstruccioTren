import { TIPOS_CASILLA } from '../constants/tiposCasella.js'
import { Piedra, Agua, Montanya } from './obstaculos.js'

// mapa tipo → clase obstáculo; null para terrenos que no son obstáculos
const OBSTACLE_PER_TIPUS = {
  [TIPOS_CASILLA.PIEDRA]:   Piedra,
  [TIPOS_CASILLA.AGUA]:     Agua,
  [TIPOS_CASILLA.MONTANYA]: Montanya,
}

// casilla del mapa con un tipo de terreno mutable y obstáculo interno opcional
export class Casella {
  constructor(tipus = TIPOS_CASILLA.PLA) {
    this.tipus = tipus
    this._actualitzarObstacle()
  }

  canviarTipus(nouTipus) {
    this.tipus = nouTipus
    // sincroniza el obstáculo interno cada vez que cambia el terreno
    this._actualitzarObstacle()
  }

  _actualitzarObstacle() {
    const Cls = OBSTACLE_PER_TIPUS[this.tipus]
    this.obstacle = Cls ? new Cls() : null
  }

  // PLA, NEU y PARADA admiten colocar una vía encima (cada uno con su tipo de vía)
  esConstruible() {
    return this.tipus === TIPOS_CASILLA.PLA
      || this.tipus === TIPOS_CASILLA.NEU
      || this.tipus === TIPOS_CASILLA.PARADA
  }

  // delega al obstáculo; false si la casilla no tiene obstáculo asociado
  esDestruible() {
    return this.obstacle?.destruible ?? false
  }

  // delega al obstáculo; true solo para AGUA (permite puente)
  esFranqueable() {
    return this.obstacle?.franqueable ?? false
  }
}
