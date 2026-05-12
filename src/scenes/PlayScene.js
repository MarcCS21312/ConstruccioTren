import Phaser from 'phaser';
import { Joc, Nivell, TIPOS_CASILLA } from '../classes/index.js';
import { COLORS_CASELLA } from '../constants/colors.js';
import { NIVELL_PROVA } from '../config/nivells.js';

const MIDA_CASELLA = 80

export class PlayScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PlayScene' });
  }

  preload() {}

  create() {
    this.nivell = new Nivell(NIVELL_PROVA)

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
