define("exit_scene", ["config"], Config => {

  "use strict"

  // Exit scene
  class ExitScene {

    update(delta) {
      // nothing to do here
    }

    render(delta, context, canvas) {
      // clear the canvas
      context.clearRect(0, 0, canvas.width, canvas.height)

      // display "game over" text
      let gameOverText = "Game Over"
      context.textBaseline = "top"
      context.font = "100px " + Config.MAIN_FONT
      context.fillStyle = "#ee4024"
      context.fillText(
        gameOverText,
        (canvas.width - context.measureText(gameOverText).width) / 2,
        canvas.height / 2 - 50
      )
    }

    destroy() {
      // nothing to do here
    }

  }

  return ExitScene

})