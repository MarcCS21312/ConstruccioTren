/*
  Calcula estrellas (0-3) tras una partida según las acciones consumidas.
  `llindars[0]` = max acciones para 3★, `llindars[1]` = max para 2★, resto 1★.
*/
export class SistemaEstrelles {
  constructor(llindars = [3, 5]) {
    this.llindars = llindars
    this.estrellesObtingudes = 0
  }

  calcularEstrelles({ victoria, accionsUsades = 0 }) {
    // derrota: ninguna estrella
    if (!victoria) {
      this.estrellesObtingudes = 0
      return 0
    }

    // dentro del primer umbral: tres estrellas
    if (accionsUsades <= this.llindars[0]) {
      this.estrellesObtingudes = 3
      return 3
    }

    // dentro del segundo umbral: dos estrellas
    if (accionsUsades <= this.llindars[1]) {
      this.estrellesObtingudes = 2
      return 2
    }

    // victoria por encima de ambos umbrales: una estrella mínimo
    this.estrellesObtingudes = 1
    return 1
  }
}
