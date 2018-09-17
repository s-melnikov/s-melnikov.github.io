define("levels-menu", [], () => {

  class LevelsMenu {

    constructor(game) {
      this.game = game
      this.ctx = game.ctx
      this.number = game.levels.length
      this.selection = 0
    }

    render() {
      this.ctx.fillStyle = "#fff1e8"
      this.game.box(10, 10, this.game.L - 20, 200 - 20)
      this.game.write("select level", this.game.L / 2, 25)
      for (let i = 0; i < this.number; i++) {
        let number = i + 1;
        if (i > this.game.maxLevel - 1) {
          this.ctx.globalAlpha = 0.6
          this.game.ctx.drawImage(
            this.game.resources.lock.img,
            (32 + Math.floor(i % 7) * 32) -
              this.game.resources.lock.img.width / 2,
              (64 + Math.floor(i / 7) * 32) + 10
            )
        }
        this.game.write(
          number.toString(),
          32 + Math.floor(i % 7) * 32,
          64 + Math.floor(i / 7) * 32
        )
        this.ctx.globalAlpha = 1
      }
      this.game.ctx.drawImage(
        this.game.resources.cursor.img,
        0, 16, 32, 32,
        16 + Math.floor(this.selection % 7) * 32,
        51 + Math.floor(this.selection / 7) * 32, 32, 32
      )
    }

    changement(keyCode) {
      if (keyCode === 37 && this.selection > 0) {
        this.game.sounds.selection.url.play()
        this.selection -= 1
        this.render()
      }
      if (keyCode === 38 && this.selection - 6 > 0) {
        this.game.sounds.selection.url.play()
        this.selection -= 7
        this.render()
      }
      if (keyCode === 39 && this.selection +1 < this.game.maxLevel) {
        this.game.sounds.selection.url.play()
        this.selection += 1
        this.render()
      }
      if (keyCode === 40 && this.selection + 7 < this.game.maxLevel) {
        this.game.sounds.selection.url.play()
        this.selection += 7
        this.render()
      }
    }
  }

  return LevelsMenu

})