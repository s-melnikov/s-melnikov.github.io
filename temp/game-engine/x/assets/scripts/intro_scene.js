define("intro_scene",
  ["config", "menu_scene", "loader", "sounds"],
  (Config, MenuScene, Loader, Sounds) => {
  "use strict"

  // Intro scene
  class IntroScene {

    constructor(game) {
      this.logoRevealTime = 4
      this.textTypingTime = 6
      this.sceneDisplayTime = 12

      this.elapsedTime = 0
      this.bigText = "Intro"
      this.infoText = "Lorem ipsum dolor sit amet, consectetur adipisicing elit..."
      this.game = game
    }

    update(delta) {
      this.elapsedTime += delta

      // switch to next scene (by timer or if user want to skip it)
      if (this.elapsedTime >= this.sceneDisplayTime ||
        this.game.checkKeyPress(Config.KEYS.ENTER)) {
          this.game.setScene("MenuScene");
        }
    }

    render(delta, context, canvas) {
      // fill background
      context.fillStyle = "#222"
      context.fillRect(0, 0, canvas.width, canvas.height)

      // draw big logo text
      context.globalAlpha = Math.min(1, this.elapsedTime / this.logoRevealTime)
      context.font = "80px " + Config.ALT_FONT
      context.fillStyle = "#fff"
      context.fillText(
        this.bigText,
        (canvas.width - context.measureText(this.bigText).width) / 2,
        canvas.height / 2
      )

      // draw typing text
      if (this.elapsedTime >= this.logoRevealTime) {
        let textProgress = Math.min(1,
          (this.elapsedTime - this.logoRevealTime) / this.textTypingTime)
        context.font = "20px " + Config.ALT_FONT
        context.fillStyle = "#bbb"
        context.fillText(
          this.infoText.substr(0,
            Math.floor(this.infoText.length * textProgress)),
          (canvas.width - context.measureText(this.infoText).width) / 2,
          canvas.height / 2 + 80
        )
      }
    }

    destroy() {

    }
  }

  return IntroScene

})