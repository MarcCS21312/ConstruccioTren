/**
 * Configuración inmutable de un nivel: mapa inicial, recursos y límites de acciones.
 * `llindarsEstrelles` es [maxAcciones3★, maxAcciones2★]; por encima del 2º da 1★.
 */
export class Nivell {
  constructor({ mapaInicial, railsInicials = 0, limitsAccions = {}, llindarsEstrelles = [3, 5], nom = 'Nivell' }) {
    this.nom = nom
    this.mapaInicial = mapaInicial
    this.railsInicials = railsInicials
    this.llindarsEstrelles = llindarsEstrelles
    this.limitsAccions = {
      tales: limitsAccions.tales ?? 0,
      destruccions: limitsAccions.destruccions ?? 0,
      rails: limitsAccions.rails ?? railsInicials
    }
  }

  // devuelve copia para que el caller no mute el estado interno del nivel
  iniciarNivell() {
    return {
      mapaInicial: this.mapaInicial.map((fila) => [...fila]),
      railsInicials: this.railsInicials,
      llindarsEstrelles: [...this.llindarsEstrelles],
      limitsAccions: { ...this.limitsAccions }
    }
  }
}
