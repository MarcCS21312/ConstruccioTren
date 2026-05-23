// jerarquía de obstáculos; cada subclase declara exactamente qué herramienta la supera

class Obstaculo {
  constructor(destruible, franqueable) {
    this.destruible  = destruible
    this.franqueable = franqueable
  }
}

// piedra: se elimina con pico y deja el terreno transitable
export class Piedra extends Obstaculo {
  constructor() { super(true, false) }
}

// agua: no se puede destruir con pico, solo cruzar colocando un puente
export class Agua extends Obstaculo {
  constructor() { super(false, true) }
}

// montaña: ninguna herramienta del juego puede superarla
export class Montanya extends Obstaculo {
  constructor() { super(false, false) }
}
