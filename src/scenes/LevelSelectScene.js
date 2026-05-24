import Phaser from 'phaser'
import { Button } from '../classes/Boto.js'
import { CAMPANA } from '../config/campana.js'
import { getMaxDesbloqueado } from '../config/progreso.js'
import { UI_STYLES } from '../constants/ui.js'

const CARD_W   = 600
const CARD_H   = 64
const CARD_GAP = 14
const PAD_TOP  = 110

export class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LevelSelectScene' })
  }

  create() {
    const { width, height } = this.scale
    const cx = width / 2

    // ==========================================================
    // 1. CAPA INFERIOR: FONS DE LA PANTALLA (Depth: 0)
    // ==========================================================
    const fons = this.add.rectangle(0, 0, width, height, 0x1a1a1a).setOrigin(0)
    fons.setDepth(0)

    // ==========================================================
    // 2. FINESTRA VISIBLE I MÀSCARA PER A L'SCROLL
    // ==========================================================
    const altFinestraScroll = height - PAD_TOP - 100 
    
    const formaMascara = this.add.graphics()
    formaMascara.fillStyle(0xffffff, 1)
    formaMascara.fillRect(cx - CARD_W / 2 - 10, PAD_TOP, CARD_W + 20, altFinestraScroll)
    const mascaraDeRetall = formaMascara.createGeometryMask()
    formaMascara.setVisible(false)

    // ==========================================================
    // 3. CAPA MITJANA: GENERACIÓ DE LES TARGETES (Depth: 1)
    // ==========================================================
    const indexAbansTargetes = this.children.list.length

    const maxDesbloqueado = getMaxDesbloqueado()
    CAMPANA.forEach((nivel, i) => {
      const cy = PAD_TOP + i * (CARD_H + CARD_GAP) + CARD_H / 2
      const desbloqueado = i <= maxDesbloqueado
      this._dibuixarTargeta(nivel, i, cx, cy, desbloqueado)
    })

    // Sillem els elements de les targetes, els apliquem la màscara i els posem a Depth 1
    this.elementsDeLaLlista = this.children.list.slice(indexAbansTargetes)
    this.elementsDeLaLlista.forEach(element => {
      element.setMask(mascaraDeRetall)
      element.setDepth(1) // Capa del mig (per sota de la interfície fixa)
    })

    // ==========================================================
    // 4. CAPA SUPERIOR: INTERFÍCIE FIXA (Depth: 10)
    // ==========================================================
    
    // El títol es crea ara a sobre de tot
    const textTitol = this.add.text(cx, 50, 'SELECCIONA NIVEL', UI_STYLES.TITOL_ESCENA)
      .setOrigin(0.5).setResolution(window.devicePixelRatio || 2)
    textTitol.setDepth(10) // Forcem que estigui a la capa superior

    // El botó de VOLVER també es crea a la capa superior
    const indexAbansVolver = this.children.list.length
    new Button(this, cx, height - 50, 'VOLVER', 0x6b7280, 0x9ca3af, () => this.scene.start('MenuScene'))
    
    // Ens assegurem que qualsevol element que hagi llançat el constructor del Botó pugi a Depth 10
    const elementsVolver = this.children.list.slice(indexAbansVolver)
    elementsVolver.forEach(el => {
      if (el.setDepth) el.setDepth(10)
    })

    this.input.keyboard.on('keyup-ESC', () => this.scene.start('MenuScene'))

    // ==========================================================
    // 5. CONTROL DEL DESPLAÇAMENT (SCROLL)
    // ==========================================================
    const alçadaTotalLlista = CAMPANA.length * (CARD_H + CARD_GAP)
    const scrollMaxim = Math.max(0, alçadaTotalLlista - altFinestraScroll + 20)
    this.scrollAcumulat = 0

    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
      const oldScroll = this.scrollAcumulat
      
      this.scrollAcumulat += deltaY * 0.4
      if (this.scrollAcumulat < 0) this.scrollAcumulat = 0
      if (this.scrollAcumulat > scrollMaxim) this.scrollAcumulat = scrollMaxim

      const diferènciaScroll = oldScroll - this.scrollAcumulat

      // Només es mouen els elements que hem definit a la capa del mig (Depth 1)
      this.elementsDeLaLlista.forEach(element => {
        element.y += diferènciaScroll
      })
    })
  }

  _dibuixarTargeta(nivel, index, cx, cy, desbloqueado) {
    const colorFons = desbloqueado ? 0x1e3a5f : 0x2d2d2d
    this.add.rectangle(cx, cy, CARD_W, CARD_H, colorFons, 0.95)
      .setOrigin(0.5)
      .setStrokeStyle(2, desbloqueado ? 0x60a5fa : 0x4b5563)

    // número de nivel a la izquierda
    this.add.text(cx - CARD_W / 2 + 28, cy, `${index + 1}`, {
      fontSize: '32px', fontStyle: 'bold', fontFamily: 'Arial, sans-serif',
      fill: desbloqueado ? '#ffffff' : '#6b7280',
    }).setOrigin(0.5).setResolution(window.devicePixelRatio || 2)

    // nombre del nivel centrado
    this.add.text(cx - 40, cy, nivel.nom, {
      fontSize: '20px', fontStyle: 'bold', fontFamily: 'Arial, sans-serif',
      fill: desbloqueado ? '#e2e8f0' : '#6b7280',
    }).setOrigin(0.5).setResolution(window.devicePixelRatio || 2)

    // botón jugar a la derecha; o candado si está bloqueado
    if (desbloqueado) {
      new Button(this, cx + CARD_W / 2 - 70, cy, 'JUGAR',
        0x3b82f6, 0x60a5fa,
        () => this.scene.start('PlayScene', { index }),
        110, CARD_H - 18)
    } else {
      this.add.text(cx + CARD_W / 2 - 70, cy, '🔒', {
        fontSize: '28px', fontFamily: 'Arial, sans-serif',
      }).setOrigin(0.5).setResolution(window.devicePixelRatio || 2)
    }
  }
}