// tipos de terreno del mapa; los valores son strings para depurar mejor en consola
export const TIPOS_CASILLA = {
  PLA:          'pla',
  BOSC:         'bosc',
  PIEDRA:       'piedra',
  AGUA:         'agua',
  NEU:          'neu',
  MONTANYA:     'montanya',
  PARADA:       'parada',         // nodo intermedio obligatorio para victoria
  RAIL:         'rail',           // via sobre PLA
  RAIL_PUENTE:  'rail_puente',    // via sobre AGUA (puente)
  RAIL_NEU:     'rail_neu',       // via sobre NEU
  RAIL_PARADA:  'rail_parada',    // via sobre PARADA (visible para confirmar visita)
  INICI:        'inici',
  META:         'meta',
}
