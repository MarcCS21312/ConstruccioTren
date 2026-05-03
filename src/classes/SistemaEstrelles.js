/**
 * Sistema simple de càlcul d'estrelles segons eficiència.
 */
export class SistemaEstrelles {
  /**
   * @param {number} [criteriBase=3] - valor base d'accions ideals per 3 estrelles
   */
  constructor(criteriBase = 3) {
    this.criteriBase = criteriBase
    this.estrellesObtingudes = 0
  }

  /**
   * Calcula el nombre d'estrelles obtingudes.
   * @param {Object} params
   * @param {boolean} params.victoria
   * @param {number} [params.accionsUsades=0]
   * @param {number} [params.accionsIdeals=this.criteriBase]
   * @param {number} [params.recursosRestants=0]
   * @returns {number} 0..3 estrelles
   */
  calcularEstrelles({ victoria, accionsUsades = 0, accionsIdeals = this.criteriBase, recursosRestants = 0 }) {
    if (!victoria) {
      this.estrellesObtingudes = 0
      return 0
    }

    if (accionsUsades <= accionsIdeals && recursosRestants > 0) {
      this.estrellesObtingudes = 3
      return 3
    }

    if (accionsUsades <= accionsIdeals + 2) {
      this.estrellesObtingudes = 2
      return 2
    }

    this.estrellesObtingudes = 1
    return 1
  }
}