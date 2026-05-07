import Phaser from 'phaser';
import { Joc, Nivell, TIPOS_CASILLA } from '../classes/index.js';

const MIDA_CASELLA = 80

const COLORS_CASELLA = {
  [TIPOS_CASILLA.PLA]:      0x90EE90,
  [TIPOS_CASILLA.BOSC]:     0x228B22,
  [TIPOS_CASILLA.OBSTACLE]: 0x808080,
  [TIPOS_CASILLA.AIGUA]:    0x4169E1,
  [TIPOS_CASILLA.RAIL]:     0x8B4513,
  [TIPOS_CASILLA.INICI]:    0xFFD700,
  [TIPOS_CASILLA.META]:     0xFF4500,
}

export class PlayScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PlayScene' });
  }

  preload() {}

  create() {
    const mapaInicial = [
      [TIPOS_CASILLA.INICI, TIPOS_CASILLA.PLA, TIPOS_CASILLA.BOSC, TIPOS_CASILLA.PLA, TIPOS_CASILLA.META],
      [TIPOS_CASILLA.PLA, TIPOS_CASILLA.OBSTACLE, TIPOS_CASILLA.PLA, TIPOS_CASILLA.BOSC, TIPOS_CASILLA.PLA],
      [TIPOS_CASILLA.PLA, TIPOS_CASILLA.PLA, TIPOS_CASILLA.PLA, TIPOS_CASILLA.PLA, TIPOS_CASILLA.PLA]
    ]

    this.nivell = new Nivell({
      nom: 'Nivell de prova',
      mapaInicial,
      railsInicials: 2,
      limitsAccions: {
        tales: 1,
        destruccions: 1,
        rails: 2
      }
    })

    this.joc = new Joc().iniciarJoc(this.nivell)

    const { files, columnes } = this.joc.mapa.mida
    this.offsetX = (this.scale.width - columnes * MIDA_CASELLA) / 2
    this.offsetY = (this.scale.height - files * MIDA_CASELLA) / 2

    this.graphics = this.add.graphics()
    this.dibuixarMapa()

    this.input.on('pointerdown', this.onClic, this)
  }

  /**
   * Dibuixa totes les caselles del mapa sobre el canvas.
   */
  dibuixarMapa() {
    this.graphics.clear()
    const { files, columnes } = this.joc.mapa.mida

    for (let fila = 0; fila < files; fila += 1) {
      for (let columna = 0; columna < columnes; columna += 1) {
        const casella = this.joc.mapa.obtenirCasella(fila, columna)
        const color = COLORS_CASELLA[casella.tipus] ?? 0xFFFFFF
        const x = this.offsetX + columna * MIDA_CASELLA
        const y = this.offsetY + fila * MIDA_CASELLA

        this.graphics.fillStyle(color, 1)
        this.graphics.fillRect(x, y, MIDA_CASELLA - 2, MIDA_CASELLA - 2)
        this.graphics.lineStyle(2, 0x000000, 1)
        this.graphics.strokeRect(x, y, MIDA_CASELLA - 2, MIDA_CASELLA - 2)
      }
    }
  }

  /**
   * Detecta el clic del ratolí, identifica la fila/columna i executa l'acció corresponent.
   * - BOSC → jugador.talarArbre
   * - OBSTACLE → jugador.destruirObstacle
   * - PLA → joc.colocarRailEn
   * @param {Phaser.Input.Pointer} pointer
   */
  onClic(pointer) {
    if (this.joc.estat !== 'jugant') return

    const { files, columnes } = this.joc.mapa.mida
    const columna = Math.floor((pointer.x - this.offsetX) / MIDA_CASELLA)
    const fila = Math.floor((pointer.y - this.offsetY) / MIDA_CASELLA)

    if (fila < 0 || fila >= files || columna < 0 || columna >= columnes) return

    const casella = this.joc.mapa.obtenirCasella(fila, columna)
    if (!casella) return

    switch (casella.tipus) {
      case TIPOS_CASILLA.BOSC:
        this.joc.jugador.talarArbre(casella)
        break
      case TIPOS_CASILLA.OBSTACLE:
        this.joc.jugador.destruirObstacle(casella)
        break
      case TIPOS_CASILLA.PLA:
        this.joc.colocarRailEn(fila, columna)
        break
    }

    this.dibuixarMapa()
  }

  update() {}
}
