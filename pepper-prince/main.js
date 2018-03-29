var Game = function() {
  this.now = null;
  this.lastUpdate = $.now();

  this.conversation = new Conversation(this);
  this.inventory = new Inventory(this);
  this.world = new World(this);

  this.tick = 0;
};

Game.prototype = {
  init: function init() {

    this.title = document.createElement("div");
    $(this.title).attr("id", "title");
    $(this.title).text("The Pepper Prince");
    $("body").append(this.title);

    this.content = document.createElement("div");
    $(this.content).attr("id", "content");
    $("body").append(this.content);

    this.conversation.create();
    this.inventory.create(window.localStorage.gold);

    this.conversation.showText("mainmenu");

    this.update();
  },

  update: function update() {
    window.requestAnimFrame(this.update.bind(this));

    this.now = $.now();
    var fps = this.now - game.lastUpdate;

    this.inventory.update(fps);

    this.tick += .01;
    $(".blue").css("color", "hsl(" + (-60 + Math.sin(this.tick) * 5) + ",80%,66%)");
    $(".green").css("color", "hsl(" + (-90 + Math.sin(this.tick) * 5) + ",100%,50%)");
    $(".hotpink").css("color", "hsl(" + (-45 + Math.sin(this.tick) * 5) + ",100%,50%)");

    this.lastUpdate = this.now;
  },

  showInfo: function showInfo(text, time) {
    if (typeof time != "number")
      time = 1500;

    $("#info").remove();

    if (this.timer != null)
      window.clearTimeout(this.timer);

    var info = document.createElement("div");
    $(info).attr("id", "info");
    $(info).text(text);
    $(game.content).prepend(info);

    this.timer = window.setTimeout(function() {
      $("#info").remove();
      window.clearTimeout(this.timer);
      this.timer = null;
    }.bind(this), time);
  },

  load: function load() {
    var save = JSON.parse(atob(window.localStorage.pepperSave));

    this.conversation.gender = save.gender;

    for (var i in save.inventory) {
      this.inventory[i] = save.inventory[i];

      switch (i) {
        case "courage":
          if (save.inventory[i] > 1)
            this.inventory.initCourage();
          break;

        case "gold":
          if (save.inventory[i] > 0)
            this.inventory.initGold();
          break;

        case "pepper":
          if (save.inventory[i] > 0)
            this.inventory.initPepper();
          break;

        case "chili":
          if (save.inventory[i] > 0)
            this.inventory.initChili();
          break;
      }
    }

    for (var i in save.world)
      this.world.changeAttribute(save.world[i].id, save.world[i].attr, save.world[i].value);

    this.world.openRoom(save.currentRoom);
  },

  save: function save() {
    window.localStorage.pepperSave = btoa(JSON.stringify({ currentRoom: this.world.currentRoom, gender: this.conversation.gender, inventory: this.inventory.getSave(), world: this.world.actions }));
  }
};
