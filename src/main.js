import './styles/main.css'
import Phaser from 'phaser'
import {MenuScene} from './scenes/MenuScene.js'
import {PlayScene} from './scenes/PlayScene.js'
import {ExitScene} from './scenes/ExitScene.js'
import {PauseScene} from './scenes/PauseScene.js'

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'gameCanvas',
  scene: [MenuScene, PlayScene, ExitScene, PauseScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  }
}

const game = new Phaser.Game(config)
