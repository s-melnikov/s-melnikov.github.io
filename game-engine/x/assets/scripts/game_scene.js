define("game_scene", ["config"], Config => {
  "use strict"

  // Main game scene
  class GameScene {

    constructor(game) {
      this.game = game
      this.angle = 0
      this.x = game.canvas.width / 2
      this.y = game.canvas.height / 2
    }

    update(delta) {
      if (this.game.keys[Config.KEYS.UP]) this.y--
      if (this.game.keys[Config.KEYS.DOWN]) this.y++
      if (this.game.keys[Config.KEYS.LEFT]) this.x--
      if (this.game.keys[Config.KEYS.RIGHT]) this.x++
      if (this.game.keys[Config.KEYS.R]) this.angle++
      if (this.game.keys[Config.KEYS.ESC]) this.game.setScene("MenuScene")
    }

    render(delta, context, canvas) {
      let rectSize = 150
      context.clearRect(0, 0, canvas.width, canvas.height)

      context.translate(this.x, this.y)
      context.rotate(this.angle * Math.PI / 180)
      context.translate(-rectSize / 2, -rectSize / 2)
      context.fillStyle = "#00dd00"
      context.fillRect(0, 0, rectSize, rectSize)
    }

    destroy() {
      // nothing to do here
    }

  }

  return GameScene
})