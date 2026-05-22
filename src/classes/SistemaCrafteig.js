/** Lógica de crafteo desacoplada de Phaser; opera sobre una instancia Jugador */
export class SistemaCrafteig {
  /** @param {import('./Jugador.js').Jugador} jugador @returns {boolean} */
  potCraftejar(jugador, recepta) {
    return Object.entries(recepta.ingredients).every(
      ([recurs, cost]) => jugador[recurs] >= cost
    )
  }

  /** @param {import('./Jugador.js').Jugador} jugador @returns {boolean} false si faltan ingredientes */
  aplicar(jugador, recepta) {
    if (!this.potCraftejar(jugador, recepta)) return false

    // resta los ingredientes, suma los efectos y guarda el ítem en el inventario
    Object.entries(recepta.ingredients).forEach(([r, c]) => { jugador[r] -= c })
    Object.entries(recepta.efecte).forEach(([r, v]) => { jugador[r] += v })
    jugador.inventari.push({ id: recepta.id, nom: recepta.nom, icona: recepta.icona })

    return true
  }
}
