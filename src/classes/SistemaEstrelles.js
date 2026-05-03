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

}