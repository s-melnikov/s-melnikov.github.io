define("game", ["config"], (Config) => {

  // Main Game Class
  class Game {

    constructor(scenes) {
      this.scenes = scenes
      this.canvas = document.querySelector("canvas")
      this.context = this.canvas.getContext("2d")
      this.setScene("intro")
      this.initInput()
      this.start()
    }

    initInput() {
      // save keys state
      this.keys = {}
      document.addEventListener("keydown", event => this.keys[event.which] = true)
      document.addEventListener("keyup", event => this.keys[event.which] = false)
    }

    checkKeyPress(keyCode) {
      // handle key press + release
      let isKeyPressed = !!this.keys[keyCode]
      this.lastKeyState = this.lastKeyState || {}

      // disallow key event from previous scene
      if (typeof this.lastKeyState[keyCode] === "undefined") {
        this.lastKeyState[keyCode] = isKeyPressed
        return false
      }

      // allow press only when state was changed
      if (this.lastKeyState[keyCode] !== isKeyPressed) {
        this.lastKeyState[keyCode] = isKeyPressed
        return isKeyPressed
      } else {
        return false
      }
    }

    setScene(name) {
      this.activeScene = new this.scenes[name](this)
    }

    update(delta) {
      this.activeScene.update(delta)
    }

    render(delta) {
      this.context.save()
      this.activeScene.render(delta, this.context, this.canvas)
      this.context.restore()
    }

    start() {
      let last = performance.now(),
        step = 1 / 30,
        delta = 0,
        now

      let frame = () => {
        now = performance.now()
        delta = delta + (now - last) / 1000
        while(delta > step) {
          delta = delta - step
          this.update(step)
        }
        last = now

        this.render(delta)
        requestAnimationFrame(frame)
      }

      requestAnimationFrame(frame)
    }

  }

  return Game
})