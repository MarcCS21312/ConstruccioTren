// persiste en localStorage el índice máximo de nivel desbloqueado
const KEY = 'construccio_tren_max_nivel'

// devuelve el índice del nivel más alto que el jugador puede jugar (0 si nunca ha jugado)
export function getMaxDesbloqueado() {
  try {
    const val = localStorage.getItem(KEY)
    return val !== null ? parseInt(val, 10) : 0
  } catch {
    return 0
  }
}

// marca como desbloqueado el nivel `index` si todavía no lo estaba
export function desbloquearNivel(index) {
  try {
    const actual = getMaxDesbloqueado()
    if (index > actual) localStorage.setItem(KEY, String(index))
  } catch {
    // ignora errores de localStorage (modo privado, etc.)
  }
}
