/**
 * Constantes con los tipos de casilla del mapa.
 * - `PLA`: terreno plano, construible
 * - `BOSC`: casella de bosc, tala posible
 * - `OBSTACLE`: obstacle, destruible
 * - `AIGUA`: aigua, inmutable i inaccessble
 * - `RAIL`: rail ja col·locat
 * - `INICI`: punt d'inici
 * - `META`: punt de meta
 */
export const TIPOS_CASILLA = {
  PLA: 'pla',
  BOSC: 'bosc',
  OBSTACLE: 'obstacle',
  AIGUA: 'aigua',
  RAIL: 'rail',
  INICI: 'inici',
  META: 'meta'
}
