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
}

export const UI_DEPTH = {
  HUD: 5,
  OVERLAY: 10,
  TEXT: 11,
}

export const UI_STYLES = {
  TITOL_RESULTAT: {
    fontSize: '64px',
    fontStyle: 'bold',
    stroke: UI_COLORS.STROKE,
    strokeThickness: 6,
  },
  ESTRELLES: {
    fontSize: '48px',
    color: UI_COLORS.VICTORIA,
    stroke: UI_COLORS.STROKE,
    strokeThickness: 4,
  },
  HUD_LABEL: {
    fontSize: '20px',
    fontStyle: 'bold',
    stroke: UI_COLORS.STROKE,
    strokeThickness: 3,
  },
}
