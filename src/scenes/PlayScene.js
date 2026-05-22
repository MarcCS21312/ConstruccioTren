import Phaser from 'phaser';
import { Joc, Nivell, TIPOS_CASILLA, Button } from '../classes/index.js';
import { COLORS_CASELLA } from '../constants/colors.js';
import { NIVELL_PROVA } from '../config/nivells.js';
import { UI_COLORS, UI_DEPTH, UI_STYLES } from '../constants/ui.js';
import { HUD } from '../ui/HUD.js';

const MIDA_CASELLA = 80

export class PlayScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PlayScene' });
  }

  preload() {}

  create() {
    // 1. Piquem un fons sòlid fosc per netejar la pantalla del Menú vell
    this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x111111).setOrigin(0);

    this.nivell = new Nivell(NIVELL_PROVA)
    this.joc = new Joc().iniciarJoc(this.nivell)

    const { files, columnes } = this.joc.mapa.mida
    this.offsetX = (this.scale.width - columnes * MIDA_CASELLA) / 2
    this.offsetY = (this.scale.height - files * MIDA_CASELLA) / 2

    this.graphics = this.add.graphics()
    this.dibuixarMapa()
    this.hud = new HUD(this, this.offsetY)
    this.hud.actualitzar(this.joc.jugador)

    // Clics al mapa (canviat a 'pointerup' per seguretat amb les transicions)
    this.input.on('pointerup', this.onClic, this)

    this.input.keyboard.on('keydown-ESC', () => this.activarPausa());

    this.botoPausa = new Button(
      this,
      this.scale.width - 50, 38,
      '⏸',
      0x374151, 0x4b5563,
      () => this.activarPausa(),
      70, 44
    );
  }

  /**
   * Atura l'escena actual de joc i llança la capa de pausa a sobre.
   */
  activarPausa() {
      this.scene.pause();
      this.scene.launch('PauseScene'); // 'launch' manté la PlayScene visible al fons
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
   */
  onClic(pointer) {
    if (this.joc.estat !== 'jugant') return

    const { x, y } = this.botoPausa.container;
    const { ample, alt } = this.botoPausa;
    if (Math.abs(pointer.x - x) < ample / 2 && Math.abs(pointer.y - y) < alt / 2) return;

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
      case TIPOS_CASILLA.PLA: {
        const resultat = this.joc.colocarRailEn(fila, columna)
        this.dibuixarMapa()
        this.hud.actualitzar(this.joc.jugador)
        if (resultat.victoria) {
          this.mostrarResultat(true, resultat.estrelles)
        } else if (resultat.derrota) {
          this.mostrarResultat(false)
        }
        return
      }
    }

    this.dibuixarMapa()
    this.hud.actualitzar(this.joc.jugador)
  }

  mostrarResultat(victoria, estrelles = 0) {
    const cx = this.scale.width / 2
    const cy = this.scale.height / 2

    this.add.rectangle(cx, cy, this.scale.width, this.scale.height, UI_COLORS.OVERLAY, UI_COLORS.OVERLAY_ALPHA)
      .setDepth(UI_DEPTH.OVERLAY)

    const titol = victoria ? 'VICTÒRIA!' : 'DERROTA!'
    const color = victoria ? UI_COLORS.VICTORIA : UI_COLORS.DERROTA

    this.add.text(cx, cy - 50, titol, { ...UI_STYLES.TITOL_RESULTAT, color })
      .setOrigin(0.5).setDepth(UI_DEPTH.TEXT)

    if (victoria) {
      const estrellaTxt = '★'.repeat(estrelles) + '☆'.repeat(3 - estrelles)
      this.add.text(cx, cy + 30, estrellaTxt, UI_STYLES.ESTRELLES)
        .setOrigin(0.5).setDepth(UI_DEPTH.TEXT)
    }
  }

  update() {}
}