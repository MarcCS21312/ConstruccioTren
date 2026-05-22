import Phaser from 'phaser';
import { Joc, Nivell, TIPOS_CASILLA } from '../classes/index.js';
import { COLORS_CASELLA } from '../constants/colors.js';
import { NIVELL_PROVA } from '../config/nivells.js';
import { UI_COLORS, UI_DEPTH, UI_STYLES } from '../constants/ui.js';
import { HUD } from '../ui/HUD.js';

const MIDA_CASELLA = 80

/** Escena principal de juego: pinta el mapa, gestiona clics y muestra resultado */
export class PlayScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PlayScene' });
  }

  preload() {}

  create() {
    this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x111111).setOrigin(0);

    // estado del juego: el nivel define el mapa, Joc orquesta jugador/estrellas
    this.nivell = new Nivell(NIVELL_PROVA)
    this.joc = new Joc().iniciarJoc(this.nivell)

    // centra el mapa en pantalla; offsetY también sirve de altura para el HUD
    const { files, columnes } = this.joc.mapa.mida
    this.offsetX = (this.scale.width - columnes * MIDA_CASELLA) / 2
    this.offsetY = (this.scale.height - files * MIDA_CASELLA) / 2

    // render del mapa y HUD
    this.graphics = this.add.graphics()
    this.dibuixarMapa()
    this.hud = new HUD(this, this.offsetY, {
      onPausa:   () => this.activarPausa(),
      onCrafteig: () => this.activarCrafteig(),
    })
    this.hud.actualitzar(this.joc.jugador)

    // entrada: pointerup evita capturar el clic que cerró la escena anterior
    this.input.on('pointerup', this.onClic, this)

    // teclado: keyup (no keydown) para no encadenar el mismo evento entre escenas
    this.input.keyboard.on('keyup-ESC', () => this.activarPausa())
    this.input.keyboard.on('keyup-C',   () => this.activarCrafteig())
  }

  activarPausa() {
    // evita relanzar PauseScene si ya está activa (doble pulsación de ESC)
    if (this.scene.isActive('PauseScene')) return
    this.scene.launch('PauseScene')
    this.scene.pause()
  }

  activarCrafteig() {
    // solo abre el taller mientras se está jugando; bloqueado en victoria/derrota
    if (this.joc.estat !== 'jugant') return
    this.scene.pause()
    this.scene.launch('CraftingScene')
  }

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

  onClic(pointer) {
    // ignora clics fuera de partida o que han caído sobre un botón del HUD
    if (this.joc.estat !== 'jugant') return
    if (this.hud.esClic(pointer)) return

    // convierte coordenadas de pantalla a fila/columna del mapa
    const { files, columnes } = this.joc.mapa.mida
    const columna = Math.floor((pointer.x - this.offsetX) / MIDA_CASELLA)
    const fila = Math.floor((pointer.y - this.offsetY) / MIDA_CASELLA)

    if (fila < 0 || fila >= files || columna < 0 || columna >= columnes) return

    const casella = this.joc.mapa.obtenirCasella(fila, columna)
    if (!casella) return

    // según el terreno: talar, destruir o colocar rail (rail puede terminar la partida)
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

    // overlay oscuro a pantalla completa para destacar el resultado
    this.add.rectangle(cx, cy, this.scale.width, this.scale.height, UI_COLORS.OVERLAY, UI_COLORS.OVERLAY_ALPHA)
      .setDepth(UI_DEPTH.OVERLAY)

    const titol = victoria ? '¡VICTORIA!' : '¡DERROTA!'
    const color = victoria ? UI_COLORS.VICTORIA : UI_COLORS.DERROTA

    this.add.text(cx, cy - 50, titol, { ...UI_STYLES.TITOL_RESULTAT, color })
      .setOrigin(0.5).setDepth(UI_DEPTH.TEXT)

    // en victoria muestra estrellas llenas + vacías hasta completar 3
    if (victoria) {
      const estrellaTxt = '★'.repeat(estrelles) + '☆'.repeat(3 - estrelles)
      this.add.text(cx, cy + 30, estrellaTxt, UI_STYLES.ESTRELLES)
        .setOrigin(0.5).setDepth(UI_DEPTH.TEXT)
    }
  }

  update() {}
}