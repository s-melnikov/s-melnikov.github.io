define("sprite", [], () => {

  class Sprite {
    constructor(game, parent, sprite) {
      this.ctx = game.ctx;
      this.sprite = sprite;
      this.size = game.size;
      this.l = Math.round(this.sprite.img.width / this.sprite.frames),
        this.h = this.sprite.img.height / this.sprite.lines
      this.pos = {
        x: parent.pos.x * this.size,
        y: parent.pos.y * this.size
      };
      this.length = this.sprite.frames;
      this.frame = 0;
      this.size = game.size;
      this.line = 0;
      this.animation = true;
      this.speed = 0.2;
    }
    dessiner() {
      this.ctx.drawImage(this.sprite.img, Math.floor(this.frame) * this.l, this.line, this.l, this.h, this.pos.x, this.pos.y, this.l, this.h);
    }
    animer() {
      if (this.animation) {
        this.frame += this.speed;
        if (this.frame >= this.length) {
          this.frame = 0;
        }
      }
    }
    render() {
      this.animer();
      this.dessiner();
    }
  }

  return Sprite

})