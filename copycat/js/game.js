define("game",
  ["utils", "menu", "entity"],
  (Utils, Menu, Entity) => {

  class Game {
    constructor(params, levels) {
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
        this.processing(params.images, params.sounds, params.tiles);
      }
      this.levels = levels;
      this.niveauActuel = 0;
      if (localStorage.copycat) {
        console.info('Memory recovered')
        this.niveauMax = JSON.parse(localStorage.copycat);
      } else {
        localStorage.setItem("copycat", JSON.stringify(5));
        this.niveauMax = JSON.parse(localStorage.copycat);
      }
      this.cat = [];

      let self = this;
      this.menuLevels = {
          monde: self,
          ctx: self.ctx,
          nombre: self.levels.length,
          selection: 0,
          rendu: function() {
            this.ctx.fillStyle = "#fff1e8";
            this.monde.boite(10, 10, this.monde.L - 20, 200 - 20);
            this.monde.ecrire("select level", this.monde.L / 2, 25);
            for (let i = 0; i < this.nombre; i++) {
              let numero = i + 1;
              if (i > this.monde.niveauMax-1) {
                this.ctx.globalAlpha = 0.6;
                this.monde.ctx.drawImage(this.monde.resources.lock.img, (32 + Math.floor(i % 7) * 32) - this.monde.resources.lock.img.width / 2, (64 + Math.floor(i / 7) * 32) + 10);
              }
              this.monde.ecrire(numero.toString(), 32 + Math.floor(i % 7) * 32, 64 + Math.floor(i / 7) * 32);
              this.ctx.globalAlpha = 1;
            }
            this.monde.ctx.drawImage(this.monde.resources.cursor.img, 0, 16, 32, 32, 16 + Math.floor(this.selection % 7) * 32, 51 + Math.floor(this.selection / 7) * 32, 32, 32);
          },
          changement: function(keyCode) {
            if (keyCode === 38 && this.selection - 6 > 0) {
              // haut
              this.monde.sounds.selection.url.play();
              this.selection -= 7;
              this.render();
            }
            if (keyCode === 40 && this.selection + 7 < this.monde.niveauMax) {
              // bas
              this.monde.sounds.selection.url.play();
              this.selection += 7;
              this.render();
            }
            if (keyCode === 37 && this.selection > 0) {
              // gauche
              this.monde.sounds.selection.url.play();
              this.selection -= 1;
              this.render();
            }
            if (keyCode === 39 && this.selection +1 < this.monde.niveauMax) {
              // droit
              this.monde.sounds.selection.url.play();
              this.selection += 1;
              this.render();
            }
          }
        }
        //transition
      this.transition = {
        duration: 800,
      }
      this.effects = [];
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

    chargement() {
      this.prop.count += 1;
      if (this.prop.count === this.prop.length) {
        console.log('Resources are loaded ' + this.prop.length + " / " + this.prop.length)
        // menu
        let bouttons = [{
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
        }, ];
        this.menu = new Menu(this, this.L / 2, 110, bouttons);
        // Fin de chargement
        this.phase("menu");
        document.addEventListener("keydown", event => this.touchePresse(event), false);
        document.addEventListener("keyup", event => this.toucheLache(event), false);
      } else {
        // écran de chargement
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(0, 0, this.L, this.H);
        this.ctx.fillStyle = "#fff";
        this.ctx.fillRect(0, (this.H / 2) - 1, (this.prop.count * this.L) / this.prop.length, 2);
      }
    }
    chargerImages(url) {
      let img = new Image();
      let self = this;
      img.onload = function() {
        self.chargement();
      }
      img.src = url;
      return img;
    }
    chargerSon(url) {
      let audio = new Audio(url);
      audio.addEventListener('canplaythrough', this.chargement(), false);
      audio.volume = this.volume;
      return audio;
    }
    processing(images, sounds, tiles) {
      // processing images
      let IM = {};
      for (let i = 0; i < images.length; i++) {
        let sujet = images[i];
        let name = sujet.name;
        sujet.img = this.chargerImages(images[i].img);
        IM[name] = images[i];
      }
      this.resources = IM;
      // processing images
      let IS = {};
      for (let i = 0; i < sounds.length; i++) {
        let sujet = sounds[i];
        let name = sujet.name;
        sujet.url = this.chargerSon(sounds[i].url);
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
    touchePresse(event) {
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
            this.phase("menu")
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
            this.phase("menu")
          }
          break;
        case "regles":
          if (this.keys[67]) {
            this.sounds.validation.url.play();
            this.phase("menu")
          }
          break;
        case "info":
          if (this.keys[67]) {
            this.sounds.validation.url.play();
            this.phase("menu")
          }
          break;
        case "levels":
          this.menuLevels.changement(event.keyCode);
          if (this.keys[67]) {
            this.sounds.validation.url.play();
            this.phase("menu")
          }
          if (this.keys[88]) {
            this.niveauActuel = this.menuLevels.selection;
            this.phase("start")
          }
          break;
        default:
          console.log("No recognized key");
      }
    }
    toucheLache(event) {
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
    ecrire(texte, x, y) {
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
    boite(x, y, l, h) {
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
    renduland() {
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
      if (this.levels[this.niveauActuel].indice) {
        this.boite(0, this.H - 32, this.L, 32);
        this.ecrire(this.levels[this.niveauActuel].indice, this.L / 2, this.H - 20);
      }

    }
    initialiserMap() {
      this.land = {};
      this.arret = false;
      this.land.geometry = JSON.parse(JSON.stringify(this.levels[this.niveauActuel].geometry));
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
      this.renduland();
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
      let monde = this;
      this.transition.time = new Date();
      boucle();

      function boucle() {
        let time = new Date() - monde.transition.time;
        if (time < monde.transition.duration) {
          monde.ctx.fillRect(0, 0, monde.L, x);
          monde.ctx.fillRect(0, monde.H, monde.L, x * -1);
          x = Utils.easeInOutQuart(time, startX, targetX - startX, monde.transition.duration);
          requestAnimationFrame(boucle);
        } else {
          if (monde.niveauActuel < monde.levels.length) {
            monde.phase("start");
            cancelAnimationFrame(boucle);
          } else {
            // fin du jeu
            monde.arret = true;
            monde.phase("fin");
            monde.niveauActuel = 0;
          }
        }
      }
    }

    intro() {
      this.initialiserMap();
      let x = this.H / 2;
      let targetX = 0;
      let startX = this.H / 2;
      let monde = this;
      this.transition.time = new Date();
      boucle();

      function boucle() {
        let time = new Date() - monde.transition.time;
        if (time < monde.transition.duration) {
          monde.renduland();
          monde.ctx.fillStyle = "black";
          monde.ctx.fillRect(0, 0, monde.L, x);
          monde.ctx.fillRect(0, monde.H, monde.L, x * -1);
          x = Utils.easeInOutQuart(time, startX, targetX - startX, monde.transition.duration);
          requestAnimationFrame(boucle);
        } else {

          monde.initJoueur();

          monde.boucle();
          cancelAnimationFrame(boucle);
        }
      }
    }

    phase(phase) {
      this.state = phase;
      cancelAnimationFrame(this.animation);
      this.animation = null;
      this.ctx.fillStyle = "#fff1e8";
      this.ctx.fillRect(0, 0, this.L, this.H);
      switch (phase) {
        case "menu":
          // affiche le menu du jeu

          let pat = this.ctx.createPattern(this.resources.pattern.img, "repeat");
          this.ctx.fillStyle = pat;
          this.ctx.fillRect(0, 0, this.L, this.H);

          this.ctx.drawImage(this.resources.title.img, 0, 0);
          this.menu.render();
          this.ctx.fillStyle = "#83769c";
          this.ctx.fillRect(0, this.H - 35, this.L, 18);
          this.ecrire("arrow keys to select 'x' to confirm", this.L / 2, this.H - 30);
          break;
        case "start":
          this.intro();
          break;
        case "fin":
          // affiche le tableau de mort du player
          this.ecrire("thanks for playing :) !", this.L / 2, 15);
          this.ecrire("if you have something to tell me about", this.L / 2, 40);
          this.ecrire("this pen please do so", this.L / 2, 55);
          this.ecrire("in the comment section.", this.L / 2, 70);
          this.ecrire("any feedback is appreciated", this.L / 2, 85);
          this.ctx.fillStyle = "#83769c";
          this.ctx.fillRect(0, this.H - 35, this.L, 18);
          this.ecrire("press 'c' to return to menu", this.L / 2, this.H - 30);
          break;
        case "regles":
          // affiche les regles
          this.ecrire("game control : ", this.L / 2, 15);
          this.ecrire("arrow keys to move", this.L / 2, 60);
          this.ecrire("'f' to toggle fullscreen", this.L / 2, 80);
          this.ecrire("'r' if you're stuck", this.L / 2, 100);
          this.ecrire("'e' to exit the game", this.L / 2, 120);
          this.ctx.fillStyle = "#83769c";
          this.ctx.fillRect(0, this.H - 35, this.L, 18);
          this.ecrire("press 'c' to return to menu", this.L / 2, this.H - 30);
          break;
        case "info":
          // Affiche les infos
          this.ecrire("about : ", this.L / 2, 15);
          this.ecrire("made with html5 canvas", this.L / 2, 40);
          this.ecrire("by gtibo on codepen", this.L / 2, 55);
          this.ecrire("credits:", this.L / 2, 80);
          this.ecrire("sound effect : noiseforfun.com", this.L / 2, 100);
          this.ctx.fillStyle = "#83769c";
          this.ctx.fillRect(0, this.H - 35, this.L, 18);
          this.ecrire("press 'c' to return to menu", this.L / 2, this.H - 30);
          break;
        case "levels":
          // Afficher menu levels
          this.menuLevels.render();
          this.ctx.fillStyle = "#83769c";
          this.ctx.fillRect(0, this.H - 35, this.L, 28);
          this.ecrire("arrow keys to select 'x' to confirm", this.L / 2, this.H - 30);
          this.ecrire("press 'c' to return to menu", this.L / 2, this.H - 20);
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
              this.niveauActuel += 1;
            if (this.niveauMax < this.niveauActuel) {
              this.niveauMax = this.niveauActuel;
              localStorage.setItem("copycat", JSON.stringify(this.niveauActuel));
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