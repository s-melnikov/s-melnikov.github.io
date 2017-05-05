define("menu", [], () => {

  class Menu {
    constructor(parent, x, y, choix) {
      this.parent = parent
      this.ctx = parent.ctx
      this.choix = choix
      this.pos = { x: x, y: y }
      this.actif = false
      this.selection = 0
      this.max = this.choix.length - 1
      this.cursor = this.parent.resources.cursor
      this.keys = []
      let valeur = []
      for (var i = 0; i < this.choix.length; i++) {
        valeur.push(this.choix[i].name.length)
      }
      this.texteMax = Math.max(...valeur) * 6 + 60
    }

    changement(keyCode) {
      if (keyCode === 38 && this.selection > 0) {
        // haut
        this.parent.sounds.selection.url.play()
        this.selection -= 1
        this.render();
      } else if (keyCode === 40 && this.selection < this.max) {
        // bas
        this.parent.sounds.selection.url.play()
        this.selection += 1
        this.render()
      } else if (keyCode === 88) {
        // action
        this.parent.sounds.validation.url.play()
        this.actif = false
        this.parent.phase(this.choix[this.selection].lien)
      }
    }

    selectionne() {}

    render() {
      this.ctx.fillStyle = "#fff1e8"
      // dessiner le cadre
      this.parent.boite(this.pos.x - this.texteMax / 2, this.pos.y - 10,
        this.texteMax, 26 * this.choix.length)
      // on affiche le title
      for (var i = 0; i < this.choix.length; i++) {
        this.parent.ecrire(this.choix[i].name, this.pos.x, this.pos.y + 25 * i)
      }
      // on affiche la selection
      this.ctx.drawImage(this.cursor.img, 48, 0, 16, 16, this.pos.x -
        this.texteMax / 2 + 8, this.pos.y + 25 * (this.selection) - 4, 16, 16)
    }
  }

  return Menu
})