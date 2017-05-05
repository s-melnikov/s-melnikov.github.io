define(
  "entity",
  ["sprite", "effect", "utils"],
  (Sprite, Effect, Utils) => {

  class Entity {
    constructor(game, x, y, sprite) {
      this.game = game
      this.limit = game.limit
      this.ctx = game.ctx
      this.pos = {
        x: x,
        y: y
      }
      this.size = game.size
      this.target = {
        x: this.pos.x * this.size,
        y: this.pos.y * this.size,
      }
      this.start = {
        x: this.pos.x * this.size,
        y: this.pos.y * this.size,
      }
      this.sprite = new Sprite(this.game, this, sprite)
      this.transition = {
        state: false,
        time: null,
        duration: 200,
        style: "walking"
      }
      this.lastDirection = "none"
      this.canMove = true
      this.collision = false
      this.validation = false
      this.game.sounds.appearance.url.play()
      this.game.effects.push(
        new Effect(
          this.game,
          this.start.x,
          this.start.y,
          this.game.resources.explosion
        )
      )
    }

    controls() {
      if (!this.transition.state && this.canMove) {
        if (this.game.keys[37]) {
          this.direct("left")
        }
        if (this.game.keys[38]) {
          this.direct("top")
        }
        if (this.game.keys[39]) {
          this.direct("right")
        }
        if (this.game.keys[40]) {
          this.direct("bottom")
        }
      }
    }

    direct(direction) {
      let mouvement = {}
      switch (direction) {
        case "left":
          mouvement = {
            x: this.pos.x - 1,
            y: this.pos.y
          }
          break
        case "right":
          mouvement = {
            x: this.pos.x + 1,
            y: this.pos.y
          }
          break
        case "bottom":
          mouvement = {
            x: this.pos.x,
            y: this.pos.y + 1
          }
          break
        case "top":
          mouvement = {
            x: this.pos.x,
            y: this.pos.y - 1
          }
          break
      }
      this.move(mouvement, direction)
    }

    move(coordinates, direction) {
      if (!this.transition.state) {
        this.targetTile = this.game.tileInfo(coordinates.x, coordinates.y)
        if (!this.targetTile.collision) {
          if (this.targetTile.action === "ice") {
            this.transition.style = "ice"
            this.transition.duration = 80
          } else {
            this.transition.style = "walking"
            this.transition.duration = 200
          }
          this.collision = false
          this.validation = false
          this.transition.state = true
          this.lastDirection = direction
          this.transition.time = new Date()
          this.pos.x = coordinates.x
          this.pos.y = coordinates.y
          this.target.x = this.pos.x * this.size
          this.target.y = this.pos.y * this.size
        } else {
          this.collision = true
        }
      }
    }

    translation() {
      if (this.transition.state) {
        let time = new Date() - this.transition.time
        if (time < this.transition.duration) {
          if (this.transition.style === "walking") {
            this.sprite.pos.x = Utils.easeInOutQuart(time, this.start.x,
              this.target.x - this.start.x, this.transition.duration)
            this.sprite.pos.y = Utils.easeInOutQuart(time, this.start.y,
              this.target.y - this.start.y, this.transition.duration)
          } else {
            this.sprite.pos.x = Utils.linearTween(time, this.start.x,
              this.target.x - this.start.x, this.transition.duration)
            this.sprite.pos.y = Utils.linearTween(time, this.start.y,
              this.target.y - this.start.y, this.transition.duration)
          }
        } else {
          this.transition.state = false
          this.sprite.pos.x = this.target.x
          this.sprite.pos.y = this.target.y
          this.start.x = this.target.x
          this.start.y = this.target.y

          switch (this.targetTile.action) {
            case "ice":
              this.direct(this.lastDirection)
              if (!this.collision) {
                this.canMove = false
              } else {
                this.canMove = true
              }
              break
            case "left":
              this.game.sounds.validation.url.play()
              this.canMove = false
              this.direct("left")
              break
            case "top":
              this.game.sounds.validation.url.play()
              this.canMove = false
              this.direct("top")
              break
            case "bottom":
              this.game.sounds.validation.url.play()
              this.canMove = false
              this.direct("bottom")
              break
            case "right":
              this.game.sounds.validation.url.play()
              this.canMove = false
              this.direct("right")
              break
            case "trap":
              this.game.sounds.block.url.play()
              this.game.effects.push(
                new Effect(this.game,
                  this.pos.x * this.size,
                  this.pos.y * this.size,
                  this.game.resources.dust)
                )
              this.game.land.geometry[this.pos.y][this.pos.x] = 7
              this.canMove = true
              break
            case "next":
              this.validation = true
              this.canMove = true
              this.game.action("next")
              break;
            default:
              this.game.sounds.mouvement.url.play()
              this.canMove = true
              this.validation = false
          }
        }
      }
    }
    render() {
      this.sprite.render()
      this.translation()
      this.controls()
    }
  }

  return Entity
})