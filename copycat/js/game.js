define("game",
  ["utils", "menu", "levels-menu", "entity"],
  (Utils, Menu, LevelsMenu, Entity) => {

  class Game {

    constructor(params, levels) {
      let self = this
      this.alphabet = "abcdefghijklmnopqrstuvwxyz0123456789 ?!():'"
      this.size = params.size
      this.keys = []
      this.zoom = params.zoom || 2
      this.filling = false
      this.state = "menu"
      this.fps = 60
      this.prop = {
        count: 0,
        length: params.images.length + params.sounds.length
      }
      this.resources = {}
      this.volume = 0.05
      this.createContext()
      if (this.prop !== 0) {
        this.processing(params.images, params.sounds, params.tiles)
      }
      this.levels = levels
      this.currentLevel = 0
      if (localStorage.copycat) {
        console.info("Memory recovered")
        this.maxLevel = JSON.parse(localStorage.copycat)
      } else {
        localStorage.setItem("copycat", JSON.stringify(5))
        this.maxLevel = JSON.parse(localStorage.copycat)
      }
      this.cat = []
      this.levelsMenu = new LevelsMenu(this)
      this.transition = {
        duration: 800,
      }
      this.effects = []
    }

    createContext() {
      this.canvas = document.createElement("canvas")
      this.ctx = this.canvas.getContext("2d")
      this.L = this.canvas.width = 16 * 16
      this.H = this.canvas.height = 16 * 16
      this.limit = {
        x: this.L,
        y: this.H
      }
      this.canvas.style.width = this.L * this.zoom + "px"
      this.canvas.style.height = this.H * this.zoom + "px"
      this.ctx.imageSmoothingEnabled = false
      document.body.appendChild(this.canvas)
      console.log("game created")
    }

    onload() {
      this.prop.count += 1
      if (this.prop.count === this.prop.length) {
        console.log("Resources are loaded" + this.prop.length + " / " + this.prop.length)
        let buttons = [{
          name: "start game",
          lien: "start"
        }, {
          name: "levels",
          lien: "levels"
        }, {
          name: "how to play",
          lien: "regles"
        }, {
          name: "about",
          lien: "info"
        }]
        this.menu = new Menu(this, this.L / 2, 110, buttons)
        this.setState("menu")
        document.addEventListener("keydown", event => this.keyDown(event))
        document.addEventListener("keyup", event => this.keyUp(event))
      } else {
        this.ctx.fillStyle = "#000"
        this.ctx.fillRect(0, 0, this.L, this.H)
        this.ctx.fillStyle = "#fff"
        this.ctx.fillRect(0, (this.H / 2) - 1, (this.prop.count * this.L) / this.prop.length, 2)
      }
    }

    loadImage(url) {
      let img = new Image()
      img.onload = () => this.onload()
      img.src = url
      return img
    }

    loadSound(url) {
      let audio = new Audio(url)
      let onload = () => {
        this.onload()
        audio.removeEventListener("canplaythrough", onload)
      }
      audio.addEventListener("canplaythrough", onload)
      audio.volume = this.volume
      return audio
    }

    processing(images, sounds, tiles) {
      let IM = {};
      for (let i = 0; i < images.length; i++) {
        let sujet = images[i];
        let name = sujet.name;
        sujet.img = this.loadImage(images[i].img);
        IM[name] = images[i];
      }
      this.resources = IM;
      // processing images
      let IS = {};
      for (let i = 0; i < sounds.length; i++) {
        let sujet = sounds[i];
        let name = sujet.name;
        sujet.url = this.loadSound(sounds[i].url);
        IS[name] = sounds[i];
      }
      this.sounds = IS;
      //  processing tiles
      this.nettoyer = new Array(tiles.length).fill(false)
      let CM = {};
      for (let i = 0; i < tiles.length; i++) {
        let sujet = tiles[i];
        let name = sujet.id;
        if (sujet.type === "sprite") {
          sujet.frame = 0;
          sujet.sprite = this.resources[sujet.apparence];
          sujet.memoireBoucle = false;
          sujet.peutAnimer = true;
          sujet.boucle = true;
        }
        CM[name] = tiles[i];
      }
      this.tiles = CM;
    }
    keyDown(event) {
      this.keys[event.keyCode] = true;
      if (this.keys[70]) {
        this.activeRemplissage();
      }
      switch (this.state) {
        case "menu":
          this.menu.changement(event.keyCode);
          break;
        case "start":
          if (this.keys[69] && this.animation) {
            this.sounds.validation.url.play();
            this.setState("menu")
          }
          if (this.keys[82] && this.animation) {
            this.sounds.validation.url.play();
            cancelAnimationFrame(this.animation);
            this.animation = null;
            this.arret = true;
            this.outro();
          }
          break;
        case "fin":
          if (this.keys[67]) {
            this.sounds.validation.url.play();
            this.setState("menu")
          }
          break;
        case "regles":
          if (this.keys[67]) {
            this.sounds.validation.url.play();
            this.setState("menu")
          }
          break;
        case "info":
          if (this.keys[67]) {
            this.sounds.validation.url.play();
            this.setState("menu")
          }
          break;
        case "levels":
          this.levelsMenu.changement(event.keyCode);
          if (this.keys[67]) {
            this.sounds.validation.url.play();
            this.setState("menu")
          }
          if (this.keys[88]) {
            this.currentLevel = this.levelsMenu.selection;
            this.setState("start")
          }
          break;
        default:
          console.log("No recognized key");
      }
    }
    keyUp(event) {
      this.keys[event.keyCode] = false;
    }
    activeRemplissage() {
      if (!this.filling) {
        this.canvas.webkitRequestFullScreen()
        this.filling = true;
        this.canvas.style.width = "100vmin";
        this.canvas.style.height = "100vmin";
      } else {
        document.webkitCancelFullScreen()
        this.filling = false;
        this.canvas.style.width = this.L * this.zoom + "px";
        this.canvas.style.height = this.H * this.zoom + "px";
      }
    }
    cherchetile(recherche) {
      let blockRecherche = [];
      for (var j = 0; j < this.land.dimension.y; j++) {
        for (var i = 0; i < this.land.dimension.x; i++) {
          let id = this.land.geometry[j][i];
          if (this.tiles[id].name === recherche) {
            let info = {
              pos: {
                x: i,
                y: j
              }
            }
            blockRecherche.push(info);
          }
        }
      }
      return blockRecherche;
    }
    tileInfo(x, y) {
      if (x > -1 && x < this.land.dimension.x && y > -1 && y < this.land.dimension.y) {
        return this.tiles[this.land.geometry[y][x]];
      } else {
        return false;
      }
    }
    write(texte, x, y) {
      let largeur = 6,
        hauteur = 9;
      let centre = (texte.length * largeur) / 2
      for (let i = 0; i < texte.length; i++) {
        let index = this.alphabet.indexOf(texte.charAt(i)),
          clipX = largeur * index,
          posX = (x - centre) + (i * largeur);
        this.ctx.drawImage(this.resources.pixelFont.img, clipX, 0, largeur, hauteur, posX, y, largeur, hauteur);
      }
    }
    box(x, y, l, h) {
      this.ctx.fillStyle = "#fff1e8";
      // dessiner le fond
      this.ctx.fillRect(x + 1, y + 1, l - 2, h - 2);
      // dessiner les bords
      //haut Gauche
      this.ctx.drawImage(this.resources.cursor.img, 32, 16, 16, 16, x, y, 16, 16);
      //haut Droit
      this.ctx.drawImage(this.resources.cursor.img, 32 + 8, 16, 16, 16, x + l - 16, y, 16, 16);
      //bas Gauche
      this.ctx.drawImage(this.resources.cursor.img, 32, 16 + 8, 16, 16, x, y + h - 16, 16, 16);
      //bas Gauche
      this.ctx.drawImage(this.resources.cursor.img, 32 + 8, 16 + 8, 16, 16, x + l - 16, y + h - 16, 16, 16);
      // haut
      this.ctx.drawImage(this.resources.cursor.img, 32 + 4, 16, 16, 16, x + 16, y, l - 32, 16);
      // bas
      this.ctx.drawImage(this.resources.cursor.img, 32 + 4, 16 + 8, 16, 16, x + 16, y + h - 16, l - 32, 16);
      // gauche
      this.ctx.drawImage(this.resources.cursor.img, 32, 16 + 4, 16, 16, x, y + 16, 16, h - 32);
      // droit
      this.ctx.drawImage(this.resources.cursor.img, 32 + 8, 16 + 4, 16, 16, x + l - 16, y + 16, 16, h - 32);
    }
    bitMasking() {
      let count = 0;
      this.land.apparence = [];
      for (var j = 0; j < this.land.dimension.y; j++) {
        for (var i = 0; i < this.land.dimension.x; i++) {
          let id = this.land.geometry[j][i];
          // haut gauche droit bas
          let voisine = [0, 0, 0, 0];
          count += 1;
          if (j - 1 > -1) {
            if (id === this.land.geometry[j - 1][i]) {
              //haut
              voisine[0] = 1;
            }
          } else {
            voisine[0] = 1;
          }
          if (i - 1 > -1) {
            if (id === this.land.geometry[j][i - 1]) {
              // gauche
              voisine[1] = 1;
            }
          } else {
            voisine[1] = 1;
          }
          if (i + 1 < this.land.dimension.x) {
            if (id === this.land.geometry[j][i + 1]) {
              // droite
              voisine[2] = 1;
            }
          } else {
            voisine[2] = 1;
          }
          if (j + 1 < this.land.dimension.y) {
            if (id === this.land.geometry[j + 1][i]) {
              //bas
              voisine[3] = 1;
            }
          } else {
            voisine[3] = 1;
          }
          id = 1 * voisine[0] + 2 * voisine[1] + 4 * voisine[2] + 8 * voisine[3];
          this.land.apparence.push(id);
        }
      }
      this.land.apparence = Utils.morceler(this.land.apparence, this.land.dimension.x);
    }
    renderland() {
      for (let j = 0; j < this.land.dimension.y; j++) {
        for (let i = 0; i < this.land.dimension.x; i++) {
          let id = this.land.geometry[j][i];
          if (this.tiles[id].apparence === "auto") {
            var sourceX = Math.floor(this.land.apparence[j][i]) * this.size;
            var sourceY = Math.floor(this.land.apparence[j][i]) * this.size;
            this.ctx.drawImage(this.resources.tiles.img, sourceX, this.tiles[id].lines * this.size, this.size, this.size, i * this.size, j * this.size, this.size, this.size);
          } else if (this.tiles[id].type === "sprite") {
            if (!this.tiles[id].memoireBoucle) {
              if (this.tiles[id].peutAnimer) {
                this.tiles[id].frame += this.tiles[id].speed;
              }
              if (this.tiles[id].frame >= this.tiles[id].sprite.frames) {
                if (!this.tiles[id].boucle) {
                  this.tiles[id].peutAnimer = false;
                }
                this.tiles[id].frame = 0;
              }
              this.tiles[id].memoireBoucle = true;
              // on sait quel id est déjà passé :^)
              this.nettoyer[id] = true;
            }
            this.ctx.drawImage(this.tiles[id].sprite.img, Math.floor(this.tiles[id].frame) * this.size, 0, this.size, this.size, i * this.size, j * this.size, this.size, this.size);
          } else {
            var sourceX = Math.floor(this.tiles[id].apparence % 16) * this.size;
            var sourceY = Math.floor(this.tiles[id].apparence / 16) * this.size;
            this.ctx.drawImage(this.resources.tiles.img, sourceX, sourceY, this.size, this.size, i * this.size, j * this.size, this.size, this.size);
          }
        }
      }
      for (var i = 0; i < this.nettoyer.length; i++) {
        if (this.nettoyer[i]) {
          this.tiles[i].memoireBoucle = false;
        }
      }
      if (this.levels[this.currentLevel].indice) {
        this.box(0, this.H - 32, this.L, 32);
        this.write(this.levels[this.currentLevel].indice, this.L / 2, this.H - 20);
      }

    }
    initialiserMap() {
      this.land = {};
      this.arret = false;
      this.land.geometry = JSON.parse(JSON.stringify(this.levels[this.currentLevel].geometry));
      this.land.dimension = {
        x: this.land.geometry[0].length,
        y: this.land.geometry.length
      };
      this.land.apparence = [];
      this.bitMasking();
    }
    initJoueur() {
      this.effects = [];
      this.cat = [];
      let posCat = this.cherchetile("player");
      for (var i = 0; i < posCat.length; i++) {
        this.cat.push(new Entity(this, posCat[i].pos.x, posCat[i].pos.y, this.resources.playerSprite));
      }
    }
    render() {
      this.renderland();
      for (var i = 0; i < this.cat.length; i++) {
        this.cat[i].render();
      }
      for (var i = this.effects.length - 1; i >= 0; i--) {
        this.effects[i].render();
      }
    }
    boucle() {
      this.ctx.fillStyle = "black";
      this.ctx.fillRect(0, 0, this.L, this.H);
      this.render();
      if (!this.arret) {
        this.animation = requestAnimationFrame(() => this.boucle());
      }
    }
    outro() {
      cancelAnimationFrame(this.animation);
      this.animation = null;
      this.arret = true;

      this.ctx.fillStyle = "black";
      let x = 0;
      let targetX = this.H / 2;
      let startX = 0;
      let game = this;
      this.transition.time = new Date();
      boucle();

      function boucle() {
        let time = new Date() - game.transition.time;
        if (time < game.transition.duration) {
          game.ctx.fillRect(0, 0, game.L, x);
          game.ctx.fillRect(0, game.H, game.L, x * -1);
          x = Utils.easeInOutQuart(time, startX, targetX - startX, game.transition.duration);
          requestAnimationFrame(boucle);
        } else {
          if (game.currentLevel < game.levels.length) {
            game.setState("start");
            cancelAnimationFrame(boucle);
          } else {
            // fin du jeu
            game.arret = true;
            game.setState("fin");
            game.currentLevel = 0;
          }
        }
      }
    }

    intro() {
      this.initialiserMap();
      let x = this.H / 2;
      let targetX = 0;
      let startX = this.H / 2;
      let game = this;
      this.transition.time = new Date();
      boucle();

      function boucle() {
        let time = new Date() - game.transition.time;
        if (time < game.transition.duration) {
          game.renderland();
          game.ctx.fillStyle = "black";
          game.ctx.fillRect(0, 0, game.L, x);
          game.ctx.fillRect(0, game.H, game.L, x * -1);
          x = Utils.easeInOutQuart(time, startX, targetX - startX, game.transition.duration);
          requestAnimationFrame(boucle);
        } else {

          game.initJoueur();

          game.boucle();
          cancelAnimationFrame(boucle);
        }
      }
    }

    setState(state) {
      this.state = state;
      cancelAnimationFrame(this.animation);
      this.animation = null;
      this.ctx.fillStyle = "#fff1e8";
      this.ctx.fillRect(0, 0, this.L, this.H);
      switch (state) {
        case "menu":
          // affiche le menu du jeu

          let pat = this.ctx.createPattern(this.resources.pattern.img, "repeat");
          this.ctx.fillStyle = pat;
          this.ctx.fillRect(0, 0, this.L, this.H);

          this.ctx.drawImage(this.resources.title.img, 0, 0);
          this.menu.render();
          this.ctx.fillStyle = "#83769c";
          this.ctx.fillRect(0, this.H - 35, this.L, 18);
          this.write("arrow keys to select 'x' to confirm", this.L / 2, this.H - 30);
          break;
        case "start":
          this.intro();
          break;
        case "fin":
          // affiche le tableau de mort du player
          this.write("thanks for playing :) !", this.L / 2, 15);
          this.write("if you have something to tell me about", this.L / 2, 40);
          this.write("this pen please do so", this.L / 2, 55);
          this.write("in the comment section.", this.L / 2, 70);
          this.write("any feedback is appreciated", this.L / 2, 85);
          this.ctx.fillStyle = "#83769c";
          this.ctx.fillRect(0, this.H - 35, this.L, 18);
          this.write("press 'c' to return to menu", this.L / 2, this.H - 30);
          break;
        case "regles":
          // affiche les regles
          this.write("game control : ", this.L / 2, 15);
          this.write("arrow keys to move", this.L / 2, 60);
          this.write("'f' to toggle fullscreen", this.L / 2, 80);
          this.write("'r' if you're stuck", this.L / 2, 100);
          this.write("'e' to exit the game", this.L / 2, 120);
          this.ctx.fillStyle = "#83769c";
          this.ctx.fillRect(0, this.H - 35, this.L, 18);
          this.write("press 'c' to return to menu", this.L / 2, this.H - 30);
          break;
        case "info":
          // Affiche les infos
          this.write("about : ", this.L / 2, 15);
          this.write("made with html5 canvas", this.L / 2, 40);
          this.write("by gtibo on codepen", this.L / 2, 55);
          this.write("credits:", this.L / 2, 80);
          this.write("sound effect : noiseforfun.com", this.L / 2, 100);
          this.ctx.fillStyle = "#83769c";
          this.ctx.fillRect(0, this.H - 35, this.L, 18);
          this.write("press 'c' to return to menu", this.L / 2, this.H - 30);
          break;
        case "levels":
          // Afficher menu levels
          this.levelsMenu.render();
          this.ctx.fillStyle = "#83769c";
          this.ctx.fillRect(0, this.H - 35, this.L, 28);
          this.write("arrow keys to select 'x' to confirm", this.L / 2, this.H - 30);
          this.write("press 'c' to return to menu", this.L / 2, this.H - 20);
          break;
        default:
          console.log("No recognized action");
      }
    }
    action(action) {
      switch (action) {
        case "next":
          let tab = [];
          for (var i = 0; i < this.cat.length; i++) {
            tab.push(this.cat[i].validation);
          }
          let confirmation = tab.every(function(vrai) {
            return vrai === true;
          });
          if (confirmation) {
              this.currentLevel += 1;
            if (this.maxLevel < this.currentLevel) {
              this.maxLevel = this.currentLevel;
              localStorage.setItem("copycat", JSON.stringify(this.currentLevel));
            }
            this.outro();
            this.sounds.bravo.url.play();
          }

          break;
        case "autre":
          break;
        default:
          console.log("No recognized action");
      }
    }
  }

  return Game

})