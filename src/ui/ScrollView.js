import Phaser from 'phaser'

const BAR_W = 8

/*
  Vista de scroll genérica para listas de elementos Phaser.
  Mueve y muestra/oculta ítems según la posición de scroll,
  y dibuja una barra lateral fija con thumb proporcional.

  Uso:
    const sv = new ScrollView(scene, { top, bottom, itemHeight, barX, contentHeight })
    sv.setItems([{ yInicial, elements }])
    sv.enable()
*/
export class ScrollView {
  constructor(scene, { top, bottom, itemHeight, barX, contentHeight, scrollSpeed = 0.4 }) {
    this.scene       = scene
    this.top         = top
    this.bottom      = bottom
    this.itemHeight  = itemHeight
    this.barX        = barX
    this.scrollSpeed = scrollSpeed
    this.items       = []

    const alturaVentana = bottom - top

    this.scrollMax      = Math.max(0, contentHeight - alturaVentana + 20)
    this.scrollAcumulat = 0

    this.trackH = alturaVentana
    this.thumbH = Math.max(32, (alturaVentana / Math.max(contentHeight, 1)) * this.trackH)
    this.barGfx = scene.add.graphics().setDepth(11)
  }

  setItems(items) {
    this.items = items
  }

  enable() {
    this._actualizarVisibilidad()
    this._dibuixarScrollbar()

    this.scene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
      const prev = this.scrollAcumulat
      this.scrollAcumulat = Phaser.Math.Clamp(
        this.scrollAcumulat + deltaY * this.scrollSpeed,
        0,
        this.scrollMax
      )
      const delta = prev - this.scrollAcumulat

      this.items.forEach(({ elements }) => {
        elements.forEach(el => { el.y += delta })
      })

      this._actualizarVisibilidad()
      this._dibuixarScrollbar()
    })
  }

  _actualizarVisibilidad() {
    const halfH = this.itemHeight / 2
    this.items.forEach(({ yInicial, elements }) => {
      const y = yInicial - this.scrollAcumulat
      const visible = y + halfH > this.top && y - halfH < this.bottom
      elements.forEach(el => el.setVisible(visible))
    })
  }

  _dibuixarScrollbar() {
    const { barGfx, barX, top, trackH, thumbH, scrollMax, scrollAcumulat } = this
    barGfx.clear()

    barGfx.fillStyle(0x374151, 0.7)
    barGfx.fillRoundedRect(barX, top, BAR_W, trackH, 4)

    const ratio  = scrollMax > 0 ? scrollAcumulat / scrollMax : 0
    const thumbY = top + ratio * (trackH - thumbH)
    barGfx.fillStyle(0x60a5fa, 0.9)
    barGfx.fillRoundedRect(barX, thumbY, BAR_W, thumbH, 4)
  }
}
