/**
 * Sistema de càlcul d'estrelles basat en llindars d'accions predefinits per nivell.
 * llindars[0] = màxim d'accions per obtenir 3★
 * llindars[1] = màxim d'accions per obtenir 2★
 * Qualsevol victòria per sobre dels llindars dona 1★.
 */
export class SistemaEstrelles {
  /**
   * @param {[number, number]} llindars - [max accions 3★, max accions 2★]
   */
  constructor(llindars = [3, 5]) {
    this.llindars = llindars
    this.estrellesObtingudes = 0
  }

  /**
   * Calcula el nombre d'estrelles obtingudes.
   * @param {Object} params
   * @param {boolean} params.victoria
   * @param {number} [params.accionsUsades=0]
   * @returns {number} 0..3 estrelles
   */
  calcularEstrelles({ victoria, accionsUsades = 0 }) {
    if (!victoria) {
      this.estrellesObtingudes = 0
      return 0
    }

    if (accionsUsades <= this.llindars[0]) {
      this.estrellesObtingudes = 3
      return 3
    }

    if (accionsUsades <= this.llindars[1]) {
      this.estrellesObtingudes = 2
      return 2
    }

    this.estrellesObtingudes = 1
    return 1
  }
}
