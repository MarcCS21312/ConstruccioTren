/**
 * Representa la configuració d'un nivell.
 * Conté el mapa inicial i els recursos/límits amb què comença el jugador.
 */
export class Nivell {
  /**
   * @param {Object} options
   * @param {Array<Array<string>>} options.mapaInicial - Matriu de tipus de casella
   * @param {number} [options.railsInicials=0]
   * @param {Object} [options.limitsAccions={}]
   * @param {string} [options.nom='Nivell']
   */
  constructor({ mapaInicial, railsInicials = 0, limitsAccions = {}, nom = 'Nivell' }) {
    this.nom = nom
    this.mapaInicial = mapaInicial
    this.railsInicials = railsInicials
    this.limitsAccions = {
      tales: limitsAccions.tales ?? 0,
      destruccions: limitsAccions.destruccions ?? 0,
      rails: limitsAccions.rails ?? railsInicials
    }
  }

  /**
   * Retorna l'estat inicial del nivell (clonat per evitar mutacions externes).
   * @returns {{mapaInicial:Array<Array<string>>, railsInicials:number, limitsAccions:Object}}
   */
  iniciarNivell() {
    return {
      mapaInicial: this.mapaInicial.map((fila) => [...fila]),
      railsInicials: this.railsInicials,
      limitsAccions: { ...this.limitsAccions }
    }
  }
}