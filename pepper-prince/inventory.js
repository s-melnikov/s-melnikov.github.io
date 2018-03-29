var Inventory = function(game) {
  this.game = game;
};

Inventory.prototype = {
  create: function create(save) {
    this.resetValues();

    this.inventory = document.createElement("div");
    $(this.inventory).attr("id", "inventory");
    $("body").append(this.inventory);

    this.stats = document.createElement("div");
    $(this.stats).attr("id", "stats");
    $(this.inventory).append(this.stats);

    //this.actions = document.createElement("div");
    //$(this.actions).attr("id", "actions");
    this.actions = this.stats;
    //$("body").append(this.actions);
  },

  resetValues: function resetValues() {
    this.elapsed = 0;

    this.dwarves = 0;
    this.satin = 0;
    this.cashmere = 0;
    this.angora = 0;

    this.diarrhea = 0;
    this.maxdiarrhea = 1000;

    this.gold = 0;

    this.pepper = 0;
    this.allpepper = 0;
    this.plantedpepper = 0;

    this.chili = 0;
    this.allchili = 0;
    this.plantedchili = 0;

    this.multiplier = 1;
    this.fertilizer = 1;
    this.courage = 1;

    this.boat = false;
    this.pipe = false;

    this.pepperowned = false;
    this.chiliowned = false;

    this.paradeseen = false;
    this.ratsgone = false;
  },

  getSave: function getSave() {
    return {
      dwarves: this.dwarves,
      satin: this.satin,
      cashmere: this.cashmere,
      angora: this.angora,
      diarrhea: this.diarrhea,
      maxdiarrhea: this.maxdiarrhea,
      gold: this.gold,
      pepper: this.pepper,
      allpepper: this.allpepper,
      plantedpepper: this.plantedpepper,
      chili: this.chili,
      allchili: this.allchili,
      plantedchili: this.plantedchili,
      multiplier: this.multiplier,
      fertilizer: this.fertilizer,
      courage: this.courage,
      boat: this.boat,
      pipe: this.pipe,
      pepperowned: this.pepperowned,
      chiliowned: this.chiliowned,
      paradeseen: this.paradeseen,
      ratsgone: this.ratsgone
    };
  },

  /*
   * COURAGE
   */
  initCourage: function initCourage() {
    if (this.hudcourage == null) {
      this.hudcourage = document.createElement("div");
      $(this.hudcourage).attr("id", "courage");
      $(this.hudcourage).text("Courage: " + this.courage);
      $(this.stats).prepend(this.hudcourage);
    }
  },

  increaseCourage: function increaseCourage(chili) {
    if (this.hudcourage == null)
      this.initCourage();

    if (chili)
      this.courage += 25 * game.conversation.getValue("fertilizer");
    else
      this.courage += game.conversation.getValue("fertilizer");

    $(this.hudcourage).text("Courage: " + this.courage);
  },

  /*
   * GOLD
   */
  initGold: function initGold() {
    if (this.hudgold == null) {
      this.hudgold = document.createElement("div");
      $(this.hudgold).attr("id", "gold");
      $(this.stats).append(this.hudgold);
    }
  },

  increaseGold: function increaseGold() {
    if (this.hudgold == null)
      this.initGold();

    this.gold += this.game.conversation.getValue("multiplier");
    $(this.hudgold).text("Gold: " + this.gold);
  },

  /*
   * PEPPER
   */
  initPepper: function initPepper() {
    if (this.hudpepper == null) {
      this.hudpepper = document.createElement("div");
      $(this.hudpepper).attr("id", "pepper");
      $(this.stats).append(this.hudpepper);
    }
  },

  increasePepper: function increasePepper() {
    if (this.hudpepper == null)
      this.initPepper();

    if (this.pepperowned == false) {
      this.pepperowned = true;

      var eat = $('<a>', { class: 'hotpink', text: 'Eat Pepper', href: 'javascript:game.inventory.eatPepper();' });
      $(this.actions).append(eat);
    }

    this.pepper++;
    this.allpepper++;
  },

  decreasePepper: function decreasePepper() {
    if (this.hudpepper == null)
      this.initPepper();

    this.pepper--;
    $(this.hudpepper).text("Pepper: " + this.game.conversation.getValue("pepper"));
  },

  /*
   * CHILI
   */
  initChili: function initChili() {
    if (this.hudchili == null) {
      this.hudchili = document.createElement("div");
      $(this.hudchili).attr("id", "chili");
      $(this.stats).append(this.hudchili);
    }
  },

  increaseChili: function increaseChili() {
    if (this.hudchili == null)
      this.initChili();

    if (this.chiliowned == false) {
      this.chiliowned = true;

      var eat = $('<a>', { class: 'hotpink', text: 'Eat Chili', href: 'javascript:game.inventory.eatChili();' });
      $(this.actions).append(eat);
    }

    this.chili++;
    this.allchili++;
  },

  decreaseChili: function decreaseChili() {
    if (this.hudchili == null)
      this.initChili();

    this.chili--;
    $(this.hudchili).text("Chili: " + this.game.conversation.getValue("chili"));
  },

  /*
   * DIARRHEA
   */
  increaseDiarrhea: function increaseDiarrhea(chili) {
    if (chili)
      this.diarrhea += 25;
    else
      this.diarrhea++;
  },

  /*
   * PLANTING & EATING
   */
  increasePlanted: function increasePlanted(chili) {
    if (chili)
      this.plantedchili++;
    else
      this.plantedpepper++;
  },

  eatPepper: function eatPepper() {
    if (this.game.conversation.getValue("pepper") > 0) {
      this.decreasePepper();
      this.increaseCourage();
    } else
      this.game.showInfo("You have no pepper!");
  },

  eatChili: function eatChili() {
    if (this.game.conversation.getValue("chili") > 0) {
      this.decreaseChili();
      this.increaseCourage(true);
    } else
      this.game.showInfo("You have no chilis!");
  },

  /*
   * UPDATE
   */
  update: function update(fps) {
    this.elapsed += (fps / 1000);

    if (this.elapsed >= 1) {
      var dif = Math.floor(this.elapsed);

      for (var i = 0; i < this.dwarves; i++)
        this.gold += dif * this.game.conversation.getValue("multiplier");

      this.pepper += this.game.conversation.getValue("harvest");
      this.chili += this.game.conversation.getValue("harvestchili");

      this.elapsed -= dif;
    }

    if (this.hudgold != null && $(this.hudgold).text() != ("Gold: " + this.gold))
      $(this.hudgold).text("Gold: " + this.gold);

    if (this.hudpepper != null && $(this.hudpepper).text() != ("Pepper: " + this.game.conversation.getValue("pepper")))
      $(this.hudpepper).text("Pepper: " + this.game.conversation.getValue("pepper"));

    if (this.hudchili != null && $(this.hudpepper).text() != ("Chili: " + this.game.conversation.getValue("chili")))
      $(this.hudchili).text("Chili: " + this.game.conversation.getValue("chili"));

    if (this.hudcourage != null && $(this.hudcourage).text() != ("Courage: " + this.courage))
      $(this.hudcourage).text("Courage: " + this.courage);
  }
};
