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
    // 1. Piquem un fons sòlid fosc per netejar la pantalla del Menú vell
    this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x111111).setOrigin(0);

    this.nivell = new Nivell(NIVELL_PROVA)
    this.joc = new Joc().iniciarJoc(this.nivell)

    const { files, columnes } = this.joc.mapa.mida
    this.offsetX = (this.scale.width - columnes * MIDA_CASELLA) / 2
    this.offsetY = (this.scale.height - files * MIDA_CASELLA) / 2

    this.graphics = this.add.graphics()
    this.dibuixarMapa()

    // Clics al mapa (canviat a 'pointerup' per seguretat amb les transicions)
    this.input.on('pointerup', this.onClic, this)

    // ==========================================
    // SISTEMA DE PAUSA
    // ==========================================

    // A. Escuchar la tecla ESCAPE
    this.input.keyboard.on('keydown-ESC', () => {
        this.activarPausa();
    });

    // B. Crear el botó petit de pausa (emoticona ⏸) a la cantonada superior dreta
    this.botoPausaPetit = this.add.text(this.scale.width - 40, 40, '⏸', {
        fontSize: '28px',
        fontFamily: 'Arial, sans-serif',
        fill: '#ffffff',
        backgroundColor: '#222222',
        padding: { x: 12, y: 8 }
    }).setOrigin(0.5);

    // Activen interactivitat amb la maneta de selecció
    this.botoPausaPetit.setInteractive({ useHandCursor: true });
    
    // Canvi de color estil hover (opcional, li dona un toc maco)
    this.botoPausaPetit.on('pointerover', () => this.botoPausaPetit.setStyle({ fill: '#60a5fa' }));
    this.botoPausaPetit.on('pointerout', () => this.botoPausaPetit.setStyle({ fill: '#ffffff' }));

    // Executar la pausa en fer clic al botó
    this.botoPausaPetit.on('pointerup', () => {
        this.activarPausa();
    });
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

    // Evitem que el clic s'accioni si l'usuari ha clicat exactament a sobre del botó de pausa
    // Calculant la distància entre el ratolí i el botó petit
    const distanciaAlBotoPausa = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.botoPausaPetit.x, this.botoPausaPetit.y);
    if (distanciaAlBotoPausa < 30) return;

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