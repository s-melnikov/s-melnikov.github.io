define("effect", [], () => {

  class Effect {
    constructor(game, x, y, sprite) {
      this.game = game
      this.ctx = game.ctx
      this.sprite = sprite
      this.size = game.size
      this.l = Math.round(this.sprite.img.width / this.sprite.frames)
      this.h = this.sprite.img.height / this.sprite.lines
      this.pos = {
        x: x,
        y: y
      }
      this.length = this.sprite.frames
      this.frame = 0
      this.size = game.size
      this.line = 0
      this.animation = true
      this.speed = 0.4
    }
    render() {
      if (this.animation) {
        this.frame += this.speed
        if (this.frame >= this.length) {
          this.game.effects.splice(this.game.effects.indexOf(this), 1)
        }
      }
      this.ctx.drawImage(
        this.sprite.img,
        Math.floor(this.frame) * this.l,
        this.line,
        this.l,
        this.h,
        this.pos.x - this.l / 4,
        this.pos.y - this.l / 4,
        this.l,
        this.h
      )
    }
  }

  return Effect

})