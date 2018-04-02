define("menu_scene", ["config"], (Config) => {

  "use strict"

  // Menu scene
  class MenuScene {

    constructor(game) {
      // set default values
      this.game = game
      this.opacityDirection = 1
      this.menuActiveOpacity = 0
      this.menuIndex = 0
      this.menuTitle = "Game Menu"
      this.menuItems = [
        "Start",
        "Intro",
        "Exit"
      ]
    }

    update(delta) {
      // calculate active menu item opacity
      let opacityValue = this.menuActiveOpacity + delta * this.opacityDirection
      if (opacityValue > 1 || opacityValue < 0) {
        this.opacityDirection *= - 1
      }
      this.menuActiveOpacity += delta * 2 * this.opacityDirection

      // menu navigation
      if (this.game.checkKeyPress(Config.KEYS.DOWN)) {
        this.menuIndex++
        this.menuIndex %= this.menuItems.length
      } else if (this.game.checkKeyPress(Config.KEYS.UP)) {
        this.menuIndex--
        if (this.menuIndex < 0) {
          this.menuIndex = this.menuItems.length - 1
        }
      }

      // menu item selected
      if (this.game.checkKeyPress(Config.KEYS.ENTER)) {
        switch (this.menuIndex) {
          case 0:
            this.game.setScene("GameScene")
            break
          case 1:
            this.game.setScene("IntroScene")
            break
          case 2:
            this.game.setScene("ExitScene")
            break
        }
      }
    }

    render(delta, context, canvas) {
      // fill menu background
      context.fillStyle = "#34495e"
      context.fillRect(0, 0, canvas.width, canvas.height)

      // draw menu title
      context.font = "60px " + Config.MAIN_FONT
      context.textBaseline = "top"
      context.fillStyle = "#ffffff"
      context.fillText(this.menuTitle,
        (canvas.width - context.measureText(this.menuTitle).width) / 2, 20)

      // draw menu items
      let itemHeight = 50,
        fontSize = 30
      context.font = fontSize + "px " + Config.MAIN_FONT
      for (let [index, item] of this.menuItems.entries()) {
        if (index === this.menuIndex) {
          context.globalAlpha = this.menuActiveOpacity
          context.fillStyle = "#2c3e50"
          context.fillRect(
            0,
            canvas.height / 2 + index * itemHeight,
            canvas.width, itemHeight
          )
        }

        context.globalAlpha = 1
        context.fillStyle = "#ecf0f1"
        context.fillText(
          item,
          (canvas.width - context.measureText(item).width) / 2,
          canvas.height / 2 + index * itemHeight + (itemHeight - fontSize) / 2
        )
      }
    }

    destroy() {
      // nothing to do here
    }

  }

  return MenuScene

})
