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
    const casellaPla = this.joc.mapa.obtenirCasella(0, 1)
    const casellaPla1 = this.joc.mapa.obtenirCasella(0, 2)
    const casellaPla2 = this.joc.mapa.obtenirCasella(0, 3)

    this.joc.jugador.talarArbre(casellaBosc)
    this.joc.jugador.destruirObstacle(casellaObstacle)
    this.joc.jugador.colocarRail(casellaPla)
    this.joc.jugador.colocarRail(casellaPla1)
    this.joc.jugador.colocarRail(casellaPla2)

    this.estadoPartida = this.joc.finalitzarPartida(3)
    console.log('Estado de partida:', this.estadoPartida)
  }

  update() {
    // Update the game objects for this scene
  }
}
