// estilos, colores y profundidades de UI compartidos por todas las escenas
// stroke solo por encima de 30px; por debajo usar shadow (evita desenfoque en texto pequeño)
const FF = 'Arial, sans-serif'

const SHADOW_SM = { offsetX: 1, offsetY: 1, color: '#000000', blur: 3, fill: true }

// paleta: colores generales, HUD y escena de crafteo
export const UI_COLORS = {
  OVERLAY: 0x000000,
  OVERLAY_ALPHA: 0.6,
  VICTORIA: '#f5c518',
  DERROTA: '#e74c3c',
  STROKE: '#000000',
  HUD_BG: 0x1a1a2e,
  HUD_RAILS: '#c8a84b',
  HUD_TALES: '#5dbb63',
  HUD_PICO: '#e07b54',
  HUD_PUENTE: '#60a5fa',
  HUD_MADERA: '#d97706',
  HUD_PIEDRA: '#9ca3af',
  HUD_NIEVE: '#bae6fd',
  CRAFTING_BG: 0x1e1b4b,
  CRAFTING_CARD_OK: 0x1e3a5f,
  CRAFTING_CARD_KO: 0x3b1f1f,
  CRAFTING_OK: '#4ade80',
  CRAFTING_KO: '#f87171',
}

// orden de capas: HUD siempre debajo del overlay de resultado
export const UI_DEPTH = {
  HUD: 5,
  OVERLAY: 10,
  TEXT: 11,
}

// estilos de texto agrupados por contexto (botón, títulos, HUD, crafteo)
export const UI_STYLES = {
  // sombra aplicada en Boto.js, no aquí
  BOTO_TEXT: {
    fontSize: '20px',
    fontFamily: FF,
    fontStyle: 'bold',
    fill: '#ffffff',
  },

  TITOL_RESULTAT: {
    fontSize: '52px',
    fontStyle: 'bold',
    fontFamily: FF,
    stroke: '#000000',
    strokeThickness: 6,
  },
  TITOL_ESCENA: {
    fontSize: '36px',
    fontStyle: 'bold',
    fontFamily: FF,
    fill: '#ffffff',
    stroke: '#000000',
    strokeThickness: 4,
  },

  ESTRELLES: {
    fontSize: '44px',
    fontFamily: FF,
    color: '#f5c518',
    stroke: '#000000',
    strokeThickness: 4,
  },

  HUD_LABEL: {
    fontSize: '22px',
    fontStyle: 'bold',
    fontFamily: FF,
    shadow: SHADOW_SM,
  },
  HUD_INVENTARI: {
    fontSize: '12px',
    fontFamily: FF,
    fill: '#a78bfa',
  },
  KEY_BADGE: {
    fontSize: '10px',
    fontFamily: FF,
    fill: '#9ca3af',
  },

  CRAFTING_TITOL: {
    fontSize: '36px',
    fontStyle: 'bold',
    fontFamily: FF,
    fill: '#ffffff',
    stroke: '#000000',
    strokeThickness: 4,
  },
  CRAFTING_NOM: {
    fontSize: '16px',
    fontStyle: 'bold',
    fontFamily: FF,
    fill: '#ffffff',
    shadow: SHADOW_SM,
  },
  CRAFTING_DESC: {
    fontSize: '13px',
    fontFamily: FF,
    fill: '#cbd5e1',
    shadow: SHADOW_SM,
  },
  CRAFTING_INGREDIENT: {
    fontSize: '13px',
    fontFamily: FF,
  },
  CRAFTING_AVIS: {
    fontSize: '20px',
    fontStyle: 'bold',
    fontFamily: FF,
  },
}
