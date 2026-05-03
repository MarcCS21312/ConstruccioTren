import Phaser from 'phaser';
import { Joc, Nivell, TIPOS_CASILLA } from '../classes/index.js';
export class PlayScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PlayScene' });
  }

  preload() {
    // Preload any assets needed for this scene
  }

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
    console.log('Joc iniciat:', this.joc)
    const casellaBosc = this.joc.mapa.obtenirCasella(0, 2)
    const casellaObstacle = this.joc.mapa.obtenirCasella(1, 1)

    this.joc.jugador.talarArbre(casellaBosc)
    this.joc.jugador.destruirObstacle(casellaObstacle)
    this.joc.colocarRailEn(0, 1)
    this.joc.colocarRailEn(0, 2)
    this.joc.colocarRailEn(0, 3)

  }

  update() {
    // Update the game objects for this scene
  }
}
