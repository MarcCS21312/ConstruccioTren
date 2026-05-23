import Phaser from 'phaser';
import { Joc, Nivell, TIPOS_CASILLA, GeneradorProcedural, Button } from '../classes/index.js';
import { COLORS_CASELLA } from '../constants/colors.js';
import { CAMPANA } from '../config/campana.js';
import { UI_COLORS, UI_DEPTH, UI_STYLES } from '../constants/ui.js';
import { HUD } from '../ui/HUD.js';

// altura del panel HUD; debe coincidir con PANEL_ALT en HUD.js
const HUD_H    = 110
// margen mínimo entre el mapa y los bordes de pantalla
const MARGE    = 12
// tamaño máximo de celda; los mapas pequeños no crecen más
const MAX_MIDA = 80

// escena principal de juego: pinta el mapa, gestiona clics y muestra resultado
export class PlayScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PlayScene' });
  }

  init(data) {
    // índice del nivel en la campaña; por defecto el primero
    this.nivelIndex = data?.index ?? 0
  }

  preload() {}

  create() {
    this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x111111).setOrigin(0);

    // genera el nivel con la semilla y dificultad asignadas al índice actual
    const entrada = CAMPANA[this.nivelIndex]
    const config  = new GeneradorProcedural().generar(entrada.semilla, entrada.dificultad)
    this.nivell   = new Nivell(config)
    this.joc      = new Joc().iniciarJoc(this.nivell)

    // tamaño de celda dinámico: el mapa siempre cabe en pantalla independientemente del nivel
    const { files, columnes } = this.joc.mapa.mida
    const maxCeldaW = Math.floor((this.scale.width  - MARGE * 2) / columnes)
    const maxCeldaH = Math.floor((this.scale.height - HUD_H - MARGE * 2) / files)
    this.mida = Math.min(maxCeldaW, maxCeldaH, MAX_MIDA)

    // centra el mapa en el espacio disponible bajo el HUD
    this.offsetX = (this.scale.width  - columnes * this.mida) / 2
    this.offsetY = HUD_H + MARGE + (this.scale.height - HUD_H - MARGE * 2 - files * this.mida) / 2

    // render del mapa y HUD
    this.graphics = this.add.graphics()
    this.dibuixarMapa()
    this.hud = new HUD(this, this.offsetY, {
      onPausa:    () => this.activarPausa(),
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
    // pasa el índice para que PauseScene pueda reiniciar el nivel correcto
    this.scene.launch('PauseScene', { nivelIndex: this.nivelIndex })
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
        const color   = COLORS_CASELLA[casella.tipus] ?? 0xFFFFFF
        const x = this.offsetX + columna * this.mida
        const y = this.offsetY + fila    * this.mida

        this.graphics.fillStyle(color, 1)
        this.graphics.fillRect(x, y, this.mida - 2, this.mida - 2)
        this.graphics.lineStyle(2, 0x000000, 1)
        this.graphics.strokeRect(x, y, this.mida - 2, this.mida - 2)
      }
    }
  }

  onClic(pointer) {
    // ignora clics fuera de partida o que han caído sobre un botón del HUD
    if (this.joc.estat !== 'jugant') return
    if (this.hud.esClic(pointer)) return

    // convierte coordenadas de pantalla a fila/columna del mapa
    const { files, columnes } = this.joc.mapa.mida
    const columna = Math.floor((pointer.x - this.offsetX) / this.mida)
    const fila    = Math.floor((pointer.y - this.offsetY) / this.mida)

    if (fila < 0 || fila >= files || columna < 0 || columna >= columnes) return

    const casella = this.joc.mapa.obtenirCasella(fila, columna)
    if (!casella) return

    // según el terreno: talar, destruir o colocar rail (rail puede terminar la partida)
    switch (casella.tipus) {
      case TIPOS_CASILLA.BOSC:
        this.joc.jugador.talarArbre(casella)
        break
      case TIPOS_CASILLA.PIEDRA:
        this.joc.jugador.destruirObstacle(casella)
        break
      // Joc enruta internamente: NEU→via_nieve, AGUA→puente, PLA→rail
      case TIPOS_CASILLA.NEU:
      case TIPOS_CASILLA.AGUA:
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
    const { width, height } = this.scale
    const cx        = width / 2
    const cy        = height / 2
    const BTN_DEPTH = UI_DEPTH.TEXT + 1
    const esUltim   = this.nivelIndex >= CAMPANA.length - 1

    // overlay oscuro a pantalla completa para destacar el resultado
    this.add.rectangle(cx, cy, width, height, UI_COLORS.OVERLAY, UI_COLORS.OVERLAY_ALPHA)
      .setDepth(UI_DEPTH.OVERLAY)

    // pantalla especial al superar el último nivel de la campaña
    if (victoria && esUltim) {
      this.add.text(cx, cy - 90, '¡CAMPAÑA\nCOMPLETADA!', {
        ...UI_STYLES.TITOL_RESULTAT, color: UI_COLORS.VICTORIA, align: 'center'
      }).setOrigin(0.5).setDepth(UI_DEPTH.TEXT)
      this.add.text(cx, cy + 10, '★★★★★', UI_STYLES.ESTRELLES)
        .setOrigin(0.5).setDepth(UI_DEPTH.TEXT)
      const btn = new Button(this, cx, cy + 90, 'MENÚ PRINCIPAL', 0x6b7280, 0x9ca3af,
        () => this.scene.start('MenuScene'))
      btn.container.setDepth(BTN_DEPTH)
      return
    }

    // título de victoria o derrota con indicador de progreso en la campaña
    const titol = victoria ? '¡VICTORIA!' : '¡DERROTA!'
    const color = victoria ? UI_COLORS.VICTORIA : UI_COLORS.DERROTA
    this.add.text(cx, cy - 70, titol, { ...UI_STYLES.TITOL_RESULTAT, color })
      .setOrigin(0.5).setDepth(UI_DEPTH.TEXT)
    this.add.text(cx, cy - 20, `Nivel ${this.nivelIndex + 1} / ${CAMPANA.length}`, {
      fontSize: '18px', fontFamily: 'Arial, sans-serif', fill: '#aaaaaa'
    }).setOrigin(0.5).setDepth(UI_DEPTH.TEXT)

    if (victoria) {
      // estrellas obtenidas y botón para avanzar al siguiente nivel
      const estrellaTxt = '★'.repeat(estrelles) + '☆'.repeat(3 - estrelles)
      this.add.text(cx, cy + 20, estrellaTxt, UI_STYLES.ESTRELLES)
        .setOrigin(0.5).setDepth(UI_DEPTH.TEXT)
      const btn = new Button(this, cx, cy + 90, 'SIGUIENTE NIVEL', 0x3b82f6, 0x60a5fa,
        () => this.scene.start('PlayScene', { index: this.nivelIndex + 1 }))
      btn.container.setDepth(BTN_DEPTH)
    } else {
      // botón de reintentar el mismo nivel con la misma semilla (mapa idéntico)
      const btn = new Button(this, cx, cy + 50, 'REINTENTAR', 0xf59e0b, 0xfbbf24,
        () => this.scene.start('PlayScene', { index: this.nivelIndex }))
      btn.container.setDepth(BTN_DEPTH)
    }
  }

  update() {}
}
