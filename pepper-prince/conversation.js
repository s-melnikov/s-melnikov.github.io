var Conversation = function(game) {
  this.game = game;
  this.convo = "";
  this.texts = {};

  this.gender = 1;
};

Conversation.prototype = {
  create: function create() {
    this.convo = "";
    this.texts = {};
    this.gender = 1;

    /*
     * TODO INTRO
     */
    this.addText("intro", "The Pepper Prince", [{
      condition: null,
      text: [
        "Just behind the candy mountains",
        "In a lonesome chocolate shack",
        "Lived a little {girl named Gretel|boy named Hansel}",
        "Longing for a savory snack",
        "",
        "Suprisingly, it does get tiring",
        "Eating chocolate night and day ",
        "So {she|he} went out to try {her|his} luck",
        "And find a slightly different taste"
      ].join("\n"),
      options: [{
        id: "cont",
        option: "Continue",
        effect: function() {
          this.game.world.openRoom("marmalade");
        }.bind(this)
      }]
    }]);

    /*
     * TODO DONKEY
     */
    this.addText("goldass", "The Gold-Ass", [{
        condition: function() {
          return this.game.inventory.diarrhea == 0 && this.game.inventory.dwarves == 0; }.bind(this),
        text: [
          "\"Why, hello there little {lady|fella}",
          "Is it gold you're thinking 'bout?",
          "Pooping gold is what I do",
          "Just pet my belly, it slides right out!\"",
          "",
          "Soft Touch Bonus: x#multi#"
        ].join("\n"),
        options: [{
            id: "pet",
            option: "Pet",
            effect: function() {
              this.game.inventory.increaseGold();
            }.bind(this),
            stay: true
          },

          {
            id: "feed",
            condition: function() {
              return this.game.inventory.pepperowned; }.bind(this),
            option: "Feed Pepper",
            effect: function() {
              if (this.getValue("pepper") > 0) {
                this.game.inventory.increaseDiarrhea();
                this.game.inventory.decreasePepper();
                this.showText("goldass");
              } else
                this.game.showInfo("You have no pepper!");
            }.bind(this),
            stay: true
          },

          {
            id: "feedchili",
            condition: function() {
              return this.game.inventory.chiliowned; }.bind(this),
            option: "Feed Chili",
            effect: function() {
              if (this.getValue("chili") > 0) {
                this.game.inventory.increaseDiarrhea(true);
                this.game.inventory.decreaseChili();
                this.showText("goldass");
              } else
                this.game.showInfo("You have no chilis!");
            }.bind(this),
            stay: true
          },

          {
            id: "back",
            option: "Back",
            effect: function() {
              this.game.world.openCurrent();
            }.bind(this)
          }
        ]
      },

      {
        condition: function() {
          return this.game.inventory.diarrhea == 0 && this.game.inventory.dwarves > 0; }.bind(this),
        text: [
          "\"I see you got some dwarves to pet me",
          "A most wonderful decision!",
          "Their hands are strong yet soft as snow",
          "I feel like I'm in donkey heaven!\"",
          "",
          "Soft Touch Bonus: x#multi#",
          "",
          "Dwarves: #dwarves#"
        ].join("\n"),
        options: [{
            id: "pet",
            option: "Pet",
            effect: function() {
              this.game.inventory.increaseGold();
            }.bind(this),
            stay: true
          },

          {
            id: "feed",
            condition: function() {
              return this.game.inventory.pepperowned; }.bind(this),
            option: "Feed Pepper",
            effect: function() {
              if (this.getValue("pepper") > 0) {
                this.game.inventory.increaseDiarrhea();
                this.game.inventory.decreasePepper();
                this.showText("goldass");
              } else
                this.game.showInfo("You have no pepper!");
            }.bind(this),
            stay: true
          },

          {
            id: "feedchili",
            condition: function() {
              return this.game.inventory.chiliowned; }.bind(this),
            option: "Feed Chili",
            effect: function() {
              if (this.getValue("chili") > 0) {
                this.game.inventory.increaseDiarrhea(true);
                this.game.inventory.decreaseChili();
                this.showText("goldass");
              } else
                this.game.showInfo("You have no chilis!");
            }.bind(this),
            stay: true
          },

          {
            id: "back",
            option: "Back",
            effect: function() {
              this.game.world.openCurrent();
            }.bind(this)
          }
        ]
      },

      {
        condition: function() {
          return this.game.inventory.diarrhea > 0 && this.game.inventory.diarrhea < 1000 && this.game.inventory.dwarves == 0; }.bind(this),
        text: [
          "\"I thank you for that tasty snack",
          "Though eating much's a bad idea",
          "These peppers sure are mighty hot",
          "They'll give me fiery diarrhea\"",
          "",
          "Soft Touch Bonus: x#multi#",
          "",
          "Diarrhea: #diarrhea#%"
        ].join("\n"),
        options: [{
            id: "pet",
            option: "Pet",
            effect: function() {
              this.game.inventory.increaseGold();
            }.bind(this),
            stay: true
          },

          {
            id: "feed",
            condition: function() {
              return this.game.inventory.pepperowned; }.bind(this),
            option: "Feed Pepper",
            effect: function() {
              if (this.getValue("pepper") > 0) {
                this.game.inventory.increaseDiarrhea();
                this.game.inventory.decreasePepper();
                this.showText("goldass");
              } else
                this.game.showInfo("You have no pepper!");
            }.bind(this),
            stay: true
          },

          {
            id: "feedchili",
            condition: function() {
              return this.game.inventory.chiliowned; }.bind(this),
            option: "Feed Chili",
            effect: function() {
              if (this.getValue("chili") > 0) {
                this.game.inventory.increaseDiarrhea(true);
                this.game.inventory.decreaseChili();
                this.showText("goldass");
              } else
                this.game.showInfo("You have no chilis!");
            }.bind(this),
            stay: true
          },

          {
            id: "back",
            option: "Back",
            effect: function() {
              this.game.world.openCurrent();
            }.bind(this)
          }
        ]
      },

      {
        condition: function() {
          return this.game.inventory.diarrhea == 1000 && this.game.inventory.dwarves == 0; }.bind(this),
        text: [
          "\"I think I've had enough of these",
          "The gold can't run out any faster",
          "Enjoy your golden waterfall",
          "My ass is burning, thanks for asking\"",
          "",
          "Soft Touch Bonus: x#multi#",
          "",
          "Diarrhea: #diarrhea#%"
        ].join("\n"),
        options: [{
            id: "pet",
            option: "Pet",
            effect: function() {
              this.game.inventory.increaseGold();
            }.bind(this),
            stay: true
          },

          {
            id: "feed",
            condition: function() {
              return this.game.inventory.pepperowned; }.bind(this),
            option: "Feed Pepper",
            effect: function() {
              if (this.getValue("pepper") > 0) {
                this.game.inventory.increaseDiarrhea();
                this.game.inventory.decreasePepper();
                this.showText("goldass");
              } else
                this.game.showInfo("You have no pepper!");
            }.bind(this),
            stay: true
          },

          {
            id: "feedchili",
            condition: function() {
              return this.game.inventory.chiliowned; }.bind(this),
            option: "Feed Chili",
            effect: function() {
              if (this.getValue("chili") > 0) {
                this.game.inventory.increaseDiarrhea(true);
                this.game.inventory.decreaseChili();
                this.showText("goldass");
              } else
                this.game.showInfo("You have no chilis!");
            }.bind(this),
            stay: true
          },

          {
            id: "back",
            option: "Back",
            effect: function() {
              this.game.world.openCurrent();
            }.bind(this)
          }
        ]
      },

      {
        condition: function() {
          return this.game.inventory.diarrhea > 0 && this.game.inventory.diarrhea < 1000 && this.game.inventory.dwarves > 0; }.bind(this),
        text: [
          "\"I thank you for that tasty snack",
          "Though eating much's a bad idea",
          "These peppers sure are mighty hot",
          "They'll give me fiery diarrhea\"",
          "",
          "Soft Touch Bonus: x#multi#",
          "",
          "Diarrhea: #diarrhea#%",
          "",
          "Dwarves: #dwarves#"
        ].join("\n"),
        options: [{
            id: "pet",
            option: "Pet",
            effect: function() {
              this.game.inventory.increaseGold();
            }.bind(this),
            stay: true
          },

          {
            id: "feed",
            condition: function() {
              return this.game.inventory.pepperowned; }.bind(this),
            option: "Feed Pepper",
            effect: function() {
              if (this.getValue("pepper") > 0) {
                this.game.inventory.increaseDiarrhea();
                this.game.inventory.decreasePepper();
                this.showText("goldass");
              } else
                this.game.showInfo("You have no pepper!");
            }.bind(this),
            stay: true
          },

          {
            id: "feedchili",
            condition: function() {
              return this.game.inventory.chiliowned; }.bind(this),
            option: "Feed Chili",
            effect: function() {
              if (this.getValue("chili") > 0) {
                this.game.inventory.increaseDiarrhea(true);
                this.game.inventory.decreaseChili();
                this.showText("goldass");
              } else
                this.game.showInfo("You have no chilis!");
            }.bind(this),
            stay: true
          },

          {
            id: "back",
            option: "Back",
            effect: function() {
              this.game.world.openCurrent();
            }.bind(this)
          }
        ]
      },

      {
        condition: function() {
          return this.game.inventory.diarrhea == 1000 && this.game.inventory.dwarves > 0; }.bind(this),
        text: [
          "\"I think I've had enough of these",
          "The gold can't run out any faster",
          "Enjoy your golden waterfall",
          "My ass is burning, thanks for asking\"",
          "",
          "Soft Touch Bonus: x#multi#",
          "",
          "Diarrhea: #diarrhea#%",
          "",
          "Dwarves: #dwarves#"
        ].join("\n"),
        options: [{
            id: "pet",
            option: "Pet",
            effect: function() {
              this.game.inventory.increaseGold();
            }.bind(this),
            stay: true
          },

          {
            id: "feed",
            condition: function() {
              return this.game.inventory.pepperowned; }.bind(this),
            option: "Feed Pepper",
            effect: function() {
              if (this.getValue("pepper") > 0) {
                this.game.inventory.increaseDiarrhea();
                this.game.inventory.decreasePepper();
                this.showText("goldass");
              } else
                this.game.showInfo("You have no pepper!");
            }.bind(this),
            stay: true
          },

          {
            id: "feedchili",
            condition: function() {
              return this.game.inventory.chiliowned; }.bind(this),
            option: "Feed Chili",
            effect: function() {
              if (this.getValue("chili") > 0) {
                this.game.inventory.increaseDiarrhea(true);
                this.game.inventory.decreaseChili();
                this.showText("goldass");
              } else
                this.game.showInfo("You have no chilis!");
            }.bind(this),
            stay: true
          },

          {
            id: "back",
            option: "Back",
            effect: function() {
              this.game.world.openCurrent();
            }.bind(this)
          }
        ]
      }
    ]);

    this.addText("donkey", "The Lonely Donkey", [{
      condition: null,
      text: [
        "In the middle of a clearing",
        "Smiling the most goofy grin",
        "Sat a handsome little donkey",
        "{Gretel|Hansel} went and talked to him",
        "",
        "\"Why, hello there little {lady|fella}",
        "Are you on your way back home?",
        "I'm bored and cold and oh so lonely",
        "Would you mind I come along?",
        "",
        "...like, seriously, can I come?\""
      ].join("\n"),

      options: [{
          id: "sure",
          option: "Sure thing",
          text: [
            "\"Why, thank you for your kindness, {Miss|Sir}",
            "I know for sure you won't regret this",
            "Come find me should you need some gold—",
            "There's always something in my ass!\"",
            "",
            "* The donkey is waiting at your house!",
            "",
            "* You can skip the path from now on"
          ].join("\n"),
          effect: function() {
            this.game.world.changeAttribute("donkey", "visible", false);
            this.game.world.changeAttribute("goldass", "visible", true);
            this.game.world.changeAttribute("path", "target", "peoplevillage");
            this.game.world.changeAttribute("path", "target", "marmalade");
          }.bind(this)
        },

        {
          id: "imgood",
          option: "Thanks, I'm good",
          text: [
            "\"Damn, that's cold,\" the Donkey muttered",
            "Gently stroking his behind",
            "\"You know, I'm worth my weight in gold",
            "I'll be here if you change your mind\""
          ].join("\n")
        }
      ]
    }]);

    /*
     * TODO FAIRY
     */
    this.addText("fairy", "The Fairy Man", [{
      condition: null,
      text: [
        "\"How can I help you, little one?\"",
        "The tiny fairy asked with glee",
        "And flapped his little wings, excited"
      ].join("\n"),
      options: [{
          id: "nocross",
          condition: function() {
            return this.game.inventory.boat && !this.game.inventory.paradeseen; }.bind(this),
          option: "I'd like to cross the milky sea",
          text: [
            "\"I'm so sorry,\" said the fairy",
            "\"My orders say I can't depart",
            "Not while the parade's still going",
            "Maybe come back afterward\""
          ].join("\n")
        },

        {
          id: "cross",
          condition: function() {
            return this.game.inventory.boat && this.game.inventory.paradeseen; }.bind(this),
          option: "I'd like to cross the milky sea",
          text: [
            "\"As you wish,\" the fairy said",
            "\"I'll take you to the southern isle",
            "You just sit there and relax—",
            "We'll be there in a little while\""
          ].join("\n"),
          effect: function() {
            this.game.world.changeAttribute("fairy", "visible", false);
            this.game.world.changeAttribute("villagepeople", "visible", true);
            this.game.world.currentRoom = "villagepeople";
          }.bind(this)
        },

        {
          id: "trycross",
          condition: function() {
            return !this.game.inventory.boat; }.bind(this),
          option: "I'd like to cross the milky sea",
          text: [
            "\"Oh, I'm sorry,\" said the fairy",
            "And hanged his little head in shame",
            "\"My ferry boat was made of cheese",
            "It sank due to its holey frame\"",
            "",
            "\"But if you found a boat I'd take you",
            "Wherever you would want to go!",
            "I wouldn't even charge you for it",
            "Seriously, just let me know!\""
          ].join("\n")
        },

        {
          id: "back",
          option: "I didn't mean to bother thee",
          effect: function() {
            this.game.world.openCurrent();
          }.bind(this)
        }
      ]
    }]);

    /*
     * TODO PARADE
     */
    this.addText("parade", "The Pepper Parade", [{
      condition: null,
      text: [
        "What's going on here, wondered {Gretel|Hansel}",
        "As people gathered 'round a man",
        "When their eyes met, {Gretel|Hansel} froze",
        "{Her|His} heart had made a jump just then",
        "",
        "{She|He} missed what purpose this all had",
        "{Her|His} awe had muted every sense",
        "But when he left, {she|he} felt a sadness",
        "{She|He} knew {she|he} had to meet the prince"
      ].join("\n"),
      effect: function() {
        this.game.world.changeAttribute("parade", "visible", false);
        this.game.inventory.paradeseen = true;
        $(this.game.world.map.peoplevillage.room).text($(this.game.world.map.peoplevillage.room).text().replace(/P/g, " ").replace(/SHO /g, "SHOP"));
      }.bind(this)
    }]);

    /*
     * TODO CANDY MOUNTAIN
     */
    this.addText("cave", "The Candy Mountains", [{
        condition: function() {
          return this.game.inventory.courage < 10; }.bind(this),
        text: [
          "{Gretel|Hansel} went and faced the mine",
          "But didn't dare to take a step",
          "The darkness had {her|him} too afraid",
          "{She|He} didn't have the courage yet",
          "",
          "* You need a Courage of 10 to enter"
        ].join("\n"),
        effect: function() {
          this.game.inventory.initCourage();
        }.bind(this)
      },

      {
        condition: function() {
          return this.game.inventory.courage >= 10 && this.game.inventory.dwarves < 6; }.bind(this),
        text: [
          "{Gretel|Hansel} bravely went inside",
          "The darkness scaring {her|him} no more",
          "In a cave {she|he} found some dwarves",
          "Keenly mining candy ore"
        ].join("\n"),
        options: [{
            id: "hire",
            option: "Hire a Dwarf ([dwarves] Gold)",
            effect: function() {
              if (this.game.inventory.gold >= this.getPrice("dwarves")) {
                this.game.inventory.gold -= this.getPrice("dwarves");
                this.game.inventory.dwarves++;
                this.showText("cave");
              } else
                this.game.showInfo("You can't afford that!");
            }.bind(this),
            stay: true
          },

          {
            id: "leave",
            option: "Leave",
            effect: function() {
              this.game.world.openCurrent();
            }.bind(this)
          }
        ]
      },

      {
        condition: function() {
          return this.game.inventory.courage >= 10 && this.game.inventory.dwarves == 6; }.bind(this),
        text: [
          "{Gretel|Hansel} bravely went inside",
          "The darkness scaring {her|him} no more",
          "In a cave {she|he} found a dwarf",
          "Keenly mining candy ore"
        ].join("\n"),
        options: [{
            id: "hire",
            option: "Hire the Dwarf ([dwarves] Gold)",
            effect: function() {
              if (this.game.inventory.gold >= this.getPrice("dwarves")) {
                this.game.inventory.gold -= this.getPrice("dwarves");
                this.game.inventory.dwarves++;
                this.showText("cave");
              } else
                this.game.showInfo("You can't afford that!");
            }.bind(this),
            stay: true
          },

          {
            id: "leave",
            option: "Leave",
            effect: function() {
              this.game.world.openCurrent();
            }.bind(this)
          }
        ]
      },

      {
        condition: function() {
          return this.game.inventory.courage >= 10 && this.game.inventory.dwarves > 6; }.bind(this),
        text: [
          "{Gretel|Hansel} bravely went inside",
          "The darkness scaring {her|him} no more",
          "In the cave were no more dwarves",
          "No-one mining candy ore"
        ].join("\n"),
        options: [{
          id: "leave",
          option: "Leave",
          effect: function() {
            this.game.world.openCurrent();
          }.bind(this)
        }]
      }
    ]);

    /*
     * TODO SHOP
     */
    this.addText("shop", "The Merchant of Dennis", [{
      condition: null,
      text: [
        "\"I bid you g'day, little {lass|lad}",
        "Feel free to browse my merchandise",
        "Some things are cheap and some are not",
        "But rest assured, they're worth their price<sup>*</sup>\"",
        " "
      ].join("\n"),
      options: [{
          id: "buysatin",
          option: "Buy Satin Gloves ([satin] Gold)",
          effect: function() {
            if (this.game.inventory.gold >= this.getPrice("satin")) {
              this.game.inventory.gold -= this.getPrice("satin");
              this.game.inventory.satin++;
              this.game.inventory.multiplier++;
              this.showText("shop");
            } else
              this.game.showInfo("You can't afford that!");
          }.bind(this),
          stay: true
        },

        {
          id: "buycashmere",
          option: "Buy Cashmere Gloves ([cashmere] Gold)",
          effect: function() {
            if (this.game.inventory.gold >= this.getPrice("cashmere")) {
              this.game.inventory.gold -= this.getPrice("cashmere");
              this.game.inventory.cashmere++;
              this.game.inventory.multiplier += 5;
              this.showText("shop");
            } else
              this.game.showInfo("You can't afford that!");
          }.bind(this),
          stay: true
        },

        {
          id: "buyangora",
          option: "Buy Angora Gloves ([angora] Gold)",
          effect: function() {
            if (this.game.inventory.gold >= this.getPrice("angora")) {
              this.game.inventory.gold -= this.getPrice("angora");
              this.game.inventory.angora++;
              this.game.inventory.multiplier += 20;
              this.showText("shop");
            } else
              this.game.showInfo("You can't afford that!");
          }.bind(this),
          stay: true
        },

        {
          id: "buyboat",
          condition: function() {
            return !this.game.inventory.boat; }.bind(this),
          option: "Buy Boat ([boat] Pepper)",
          effect: function() {
            if (this.game.inventory.pepper >= this.getPrice("boat")) {
              this.game.inventory.pepper -= this.getPrice("boat");
              this.game.inventory.boat = true;
              this.showText("shop");
            } else
              this.game.showInfo("You can't afford that!");
          }.bind(this),
          stay: true
        },

        {
          id: "buypepper",
          option: "Buy Pepper ([pepper] Gold)",
          effect: function() {
            if (this.game.inventory.gold >= this.getPrice("pepper")) {
              this.game.inventory.gold -= this.getPrice("pepper");
              this.game.inventory.increasePepper();
              this.showText("shop");
            } else
              this.game.showInfo("You can't afford that!");
          }.bind(this),
          stay: true
        },

        {
          id: "sellpepper",
          condition: function() {
            return this.game.inventory.pepperowned; }.bind(this),
          option: "Sell Pepper (200 Gold)",
          effect: function() {
            if (this.getValue("pepper") > 0) {
              this.game.inventory.gold += 200;
              this.game.inventory.decreasePepper();
              this.showText("shop");
            } else
              this.game.showInfo("You have no pepper!");
          }.bind(this),
          stay: true
        },

        {
          id: "leave",
          option: "Leave",
          effect: function() {
            this.game.world.openCurrent();
          }.bind(this)
        }
      ]
    }]);

    /*
     * TODO PEPPER FIELD
     */
    this.addText("pepperfield", "The Fields of Gold (and Pepper)", [{
        condition: function() {
          return !this.game.inventory.pepperowned && !this.game.inventory.chiliowned; }.bind(this),
        text: [
          "Beneath {her|his} feet lay fertile soil",
          "Cultivated with much care",
          "The perfect spot to plant some stuff",
          "If only {she|he} had some to spare",
          " "
        ].join("\n"),
        options: [{
          id: "leave",
          option: "Leave",
          effect: function() {
            this.game.world.openCurrent();
          }.bind(this)
        }]
      },

      {
        condition: function() {
          return this.game.inventory.pepperowned && !this.game.inventory.chiliowned; }.bind(this),
        text: [
          "Beneath {her|his} feet lay fertile soil",
          "Cultivated with much care",
          "The perfect spot to plant some stuff",
          "Anything {she|he} had to spare",
          " ",
          " ",
          "Planted Peppers: #planted#",
          "",
          "Peppers Harvested per Second: #harvest#",
          " "
        ].join("\n"),
        options: [{
            id: "plant",
            option: "Plant Pepper",
            effect: function() {
              if (this.getValue("pepper") > 0) {
                this.game.inventory.increasePlanted();
                this.game.inventory.decreasePepper();
                this.showText("pepperfield");
              } else
                this.game.showInfo("You have no pepper!");
            }.bind(this),
            stay: true
          },

          {
            id: "leave",
            option: "Leave",
            effect: function() {
              this.game.world.openCurrent();
            }.bind(this)
          }
        ]
      },

      {
        condition: function() {
          return this.game.inventory.pepperowned && this.game.inventory.chiliowned; }.bind(this),
        text: [
          "Beneath {her|his} feet lay fertile soil",
          "Cultivated with much care",
          "The perfect spot to plant some stuff",
          "Anything {she|he} had to spare",
          " ",
          " ",
          "Planted Peppers: #planted#",
          "",
          "Peppers Harvested per Second: #harvest#",
          " ",
          "Planted Chilis: #plantedchili#",
          "",
          "Chilis Harvested per Second: #harvestchili#",
          " "
        ].join("\n"),
        options: [{
            id: "plant",
            option: "Plant Pepper",
            effect: function() {
              if (this.getValue("pepper") > 0) {
                this.game.inventory.increasePlanted();
                this.game.inventory.decreasePepper();
                this.showText("pepperfield");
              } else
                this.game.showInfo("You have no pepper!");
            }.bind(this),
            stay: true
          },

          {
            condition: function() {
              return this.game.inventory.chiliowned; }.bind(this),
            id: "plantchili",
            option: "Plant Chili",
            effect: function() {
              if (this.getValue("chili") > 0) {
                this.game.inventory.increasePlanted(true);
                this.game.inventory.decreaseChili();
                this.showText("pepperfield");
              } else
                this.game.showInfo("You have no chilis!");
            }.bind(this),
            stay: true
          },

          {
            id: "leave",
            option: "Leave",
            effect: function() {
              this.game.world.openCurrent();
            }.bind(this)
          }
        ]
      }
    ]);

    /*
     * TODO CARD GUARD
     */
    this.addText("card", "The Card Guard", [{
      condition: null,
      text: [
        "\"And who might you be, little one?",
        "On your way to see the king?",
        "Well sorry, {lass|lad}, but I have orders",
        "This path's off limits, no-one's passing\""
      ].join("\n"),
      options: [{
          id: "saywhat",
          option: "Say whaaaaaat?",
          text: [
            "\"Is it so urgent you must see him?",
            "Well, maybe we can make a deal",
            "There's nothing quite like chili peppers",
            "Gosh, they make a tasty meal\""
          ].join("\n"),
          options: [{
              id: "bribe",
              option: "Give 100 Chilis",
              effect: function() {
                if (this.getValue("chili") >= 100) {
                  this.game.inventory.chili -= 100;
                  this.game.world.changeAttribute("card", "visible", false);
                  this.game.world.changeAttribute("mousemountain", "visible", true);
                  this.game.world.openCurrent();
                } else
                  this.game.showInfo("You don't have enough chili!");
              }.bind(this),
              stay: true
            },

            {
              id: "leave",
              option: "I'll be back",
              effect: function() {
                this.game.world.openCurrent();
              }.bind(this)
            }
          ]
        },

        {
          id: "leave",
          option: "Whatevs",
          effect: function() {
            this.game.world.openCurrent();
          }.bind(this)
        }
      ]
    }]);

    /*
     * TODO STEVE MERCHANT
     */
    this.addText("steve", "Steve Merchant", [{
      condition: null,
      text: [
        "\"Your gold's no good here\", said the merchant",
        "\"Barely worth a battered pan",
        "Pepper is what they're all after",
        "Don't you know? Get with it, man!\"",
        " "
      ].join("\n"),
      options: [{
          id: "buyfertilizer",
          option: "Buy Fertilizer ([fertilizer] Pepper)",
          effect: function() {
            if (this.game.inventory.pepper >= this.getPrice("fertilizer")) {
              this.game.inventory.pepper -= this.getPrice("fertilizer");
              this.game.inventory.fertilizer++;
              this.showText("steve");
            } else
              this.game.showInfo("You can't afford that!");
          }.bind(this),
          stay: true
        },

        {
          id: "buypipe",
          condition: function() {
            return !this.game.inventory.pipe; }.bind(this),
          option: "Buy Pipe ([pipe] Chilis)",
          effect: function() {
            if (this.game.inventory.chili >= this.getPrice("pipe")) {
              this.game.inventory.chili -= this.getPrice("pipe");
              this.game.inventory.pipe = true;
              this.showText("steve");
            } else
              this.game.showInfo("You can't afford that!");
          }.bind(this),
          stay: true
        },

        {
          id: "buychili",
          option: "Buy Chili ([chili] Pepper)",
          effect: function() {
            if (this.game.inventory.pepper >= this.getPrice("chili")) {
              this.game.inventory.pepper -= this.getPrice("chili");
              this.game.inventory.increaseChili();
              this.showText("steve");
            } else
              this.game.showInfo("You can't afford that!");
          }.bind(this),
          stay: true
        },

        {
          id: "sellchili",
          condition: function() {
            return this.game.inventory.chiliowned; }.bind(this),
          option: "Sell Chili (200 Pepper)",
          effect: function() {
            if (this.getValue("chili") > 0) {
              this.game.inventory.pepper += 200;
              this.game.inventory.decreaseChili();
              this.showText("steve");
            } else
              this.game.showInfo("You have no chilis!");
          }.bind(this),
          stay: true
        },

        {
          id: "leave",
          option: "Leave",
          effect: function() {
            this.game.world.openCurrent();
          }.bind(this)
        }
      ]
    }]);

    /*
     * TODO MOUSEY CARD GUARD
     */
    this.addText("cardio", "The Other Card Guard", [{
        condition: function() {
          return !this.game.inventory.ratsgone; }.bind(this),
        text: [
          "\"Now wait a minute,\" said the card",
          "\"What do you think you're doing here?",
          "How'd you get past the other guard?",
          "Oh, you know what—I don't care.\"",
          "",
          "\"I have a problem with some rats",
          "I can't get them to leave that cave",
          "If you take care of them for me",
          "You'll soon be on your merry way\""
        ].join("\n")
      },

      {
        condition: function() {
          return this.game.inventory.ratsgone; }.bind(this),
        text: [
          "\"Well, well, well, you kept your word",
          "I saw them running for the trees",
          "You must be quite the flautist, {lady|laddy}!",
          "Now if you will, keep moving, please!\""
        ].join("\n"),
        effect: function() {
          this.game.world.changeAttribute("cardio", "visible", false);
          this.game.world.changeAttribute("castle", "visible", true);
        }.bind(this)
      }
    ]);

    /*
     * TODO RATTY RAT RATS
     */
    this.addText("mousecave", "The Ratty Rat Rats", [{
        condition: function() {
          return this.game.inventory.ratsgone; }.bind(this),
        text: [
          "The rats were gone, the cave was saved",
          "Nothing left for {her|him} to do",
          "{Gretel|Hansel} went right back outside",
          "{She|He} had a lovely prince to get to"
        ].join("\n")
      },

      {
        condition: function() {
          return this.game.inventory.courage < 10000; }.bind(this),
        text: [
          "A dark cave is already bad",
          "But there was movement everywhere",
          "{Gretel|Hansel}'s skin crawled for its life",
          "No, {she|he} wouldn't go in there",
          "",
          "* You need a Courage of 10000"
        ].join("\n")
      },

      {
        condition: function() {
          return this.game.inventory.courage >= 10000; }.bind(this),
        text: [
          "{Gretel|Hansel} bravely stepped inside",
          "And faced about a thousand rats",
          "{She|He} kept {her|his} calm and thought it over",
          "What would be the best next step?"
        ].join("\n"),
        options: [{
            condition: null,
            id: "ask",
            option: "Ask Nicely",
            text: [
              "Weird, that didn't work."
            ].join("\n")
          },

          {
            condition: function() {
              return this.game.inventory.pipe; }.bind(this),
            id: "pipeaway",
            option: "Play the Pipe",
            text: [
              "Apparently the pipe was broken",
              "It only made a horrid sound",
              "But it seemed to work regardless",
              "The rats all winced and hit the ground"
            ].join("\n"),
            effect: function() {
              this.game.inventory.ratsgone = true;
            }.bind(this)
          },

          {
            id: "leave",
            option: "Leave",
            effect: function() {
              this.game.world.openCurrent();
            }.bind(this)
          }
        ]
      }
    ]);

    /*
     * TODO THE PRINCE
     */
    this.addText("theprince", "The Pepper Prince", [{
        condition: function() {
          return this.game.inventory.courage < 250000; }.bind(this),
        text: [
          "{Gretel|Hansel} saw the handsome prince",
          "And couldn't move even a bit",
          "Approaching strangers does take courage",
          "And {she|he} just needed more of it",
          "",
          "* You need a Courage of 250000"
        ].join("\n")
      },

      {
        condition: function() {
          return this.game.inventory.courage >= 250000; }.bind(this),
        text: [
          "Slowly {she|he} approached the prince",
          "And looked him straight into the eye",
          "He saw {her|him}, smiled, and waved {her|him} closer",
          "And said, \"There's no need to be shy!\"",
          "",
          "\"How can I be of service, {Miss|Sir}?\"",
          "He asked {her|him} kindly and {she|he} blushed",
          "What was {she|he} supposed to say?",
          "Should {she|he} tell him of {her|his} crush?"
        ].join("\n"),
        options: [{
            id: "tell",
            option: "Yes, tell him",
            text: [
              "{She|He} took a heart and said the words",
              "Staring firmly on the ground",
              "A moment passed and then he spoke",
              "{She|He} jumped a little at the sound",
              "",
              "\"I thank you for that compliment",
              "But I'm afraid we cannot be",
              "You must know, I am in love",
              "With the ruler of the sea",
              "",
              "But if you'd like to be my friend",
              "I would love to get to know you",
              "You seem like a splendid {girl|boy}",
              "I'm sure that we'd be great friends too\""
            ].join("\n"),
            options: [{
                id: "befriends",
                option: "I'll be your friend",
                text: [
                  "Do you mean it or do you just say it in the",
                  "hopes that he'll change his mind later?",
                ].join("\n"),
                options: [{
                    id: "meanit",
                    option: "I mean it, I'm cool with being friends",
                    effect: function() {
                      this.showText("wincool");
                    }.bind(this)
                  },

                  {
                    id: "nomeanit",
                    option: "I'm hoping he'll change his mind",
                    text: [
                      "Really? Don't you think that's kinda mean?"
                    ].join("\n"),
                    options: [{
                        id: "yeah",
                        option: "Hm, you're right, let's really be friends",
                        effect: function() {
                          this.showText("wincool");
                        }.bind(this)
                      },

                      {
                        id: "dontcare",
                        option: "Whatever, I dont care",
                        effect: function() {
                          this.showText("lose");
                        }.bind(this)
                      }
                    ]
                  }
                ]
              },

              {
                id: "nofriends",
                option: "I don't think I can",
                effect: function() {
                  this.showText("winhonest");
                }.bind(this)
              }
            ]
          },

          {
            id: "donttell",
            option: "No, don't say anything",
            text: [
              "{Gretel|Hansel} and the prince talked briefly",
              "'bout anything except for this",
              "And when {Gretel|Hansel} finally left him",
              "{She|He} wondered what {she|he} could've missed"
            ].join("\n"),
            options: [{
              id: "cont",
              option: "Continue",
              effect: function() {
                this.showText("draw");
              }.bind(this)
            }]
          }
        ]
      }
    ]);

    /*
     * TODO WIN HONEST
     */
    this.addText("winhonest", "You're awesome!", [{
      condition: null,
      text: [
        "Congratulations!",
        "",
        "You're honest and you're awesome!",
        "",
        "You win the game because you know",
        "that being deceptive is wrong!",
        "",
        "That also means you win at life! Yay!"
      ].join("\n"),
      options: [{
        id: "exit",
        option: "Back to Menu",
        effect: function() {
          this.showText("mainmenu");
        }.bind(this)
      }]
    }]);

    /*
     * TODO WIN COOL
     */
    this.addText("wincool", "You win!", [{
      condition: null,
      text: [
        "Congratulations!",
        "",
        "You win the game because you",
        "value friendship!",
        "",
        "That also means you win at life! Yay!"
      ].join("\n"),
      options: [{
        id: "",
        option: "Back to Menu",
        effect: function() {
          this.showText("mainmenu");
        }.bind(this)
      }]
    }]);

    /*
     * TODO LOSE
     */
    this.addText("lose", "You are terrible", [{
      condition: null,
      text: [
        "That is terrible. That is truly, truly terrible.",
        "Saying you'll be someone's friend when you don't",
        "really mean it is totally not cool. How do you",
        "think they'll feel when they eventually find out",
        "that you lied just to get closer to them?",
        "",
        "You lose the game because that's just wrong.",
        "I'm also deleting your saves and your score.",
        "",
        "(Just kidding, it didn't save to begin with.)",
        "",
        "(OR DID IT?)"
      ].join("\n"),
      options: [{
        id: "exit",
        option: "Back to Menu",
        effect: function() {
          localStorage.clear();
          this.game.inventory.resetValues();
          this.showText("mainmenu");
        }.bind(this)
      }],
      effects: function effects() {
        window.localStorage.clear();
        this.game.inventory.resetValues();
      }.bind(this)
    }]);

    /*
     * TODO DRAW
     */
    this.addText("draw", "The End", [{
      condition: null,
      text: [
        "You finished the game!",
        "",
        "This is the ambiguous ending. I hope you",
        "really didn't want to pursue this, otherwise,",
        "just try next time! Sure, it might not work",
        "out, but at least you'd know and won't have",
        "to wonder \"what if?\" That's something right?"
      ].join("\n"),
      options: [{
        id: "exit",
        option: "Back to Menu",
        effect: function() {
          this.showText("mainmenu");
        }.bind(this)
      }]
    }]);

    /*
     * TODO MAIN MENU
     */
    this.addText("mainmenu", "The Pepper Prince", [{
        condition: function() {
          return window.localStorage.pepperSave != null && window.localStorage.pepperSave.length > 0; },
        text: [
          "   The Pepper Prince   ",
          " ",
        ].join("\n"),
        options: [{
            id: "start",
            option: "      Start Game        ",
            effect: function() {
              this.game.inventory.resetValues();
              this.game.world.create();
              this.showText("gender");
            }.bind(this)
          },

          {
            id: "continue",
            option: "      Continue          ",
            effect: function() {
              this.game.inventory.resetValues();
              this.game.world.create();
              this.game.load();
            }.bind(this)
          },

          {
            id: "credits",
            option: "      Credits           ",
            effect: function() {
              this.showText("credits");
            }.bind(this)
          }
        ]
      },

      {
        condition: null,
        text: [
          "   The Pepper Prince   ",
          " ",
        ].join("\n"),
        options: [{
            id: "start",
            option: "      Start Game        ",
            effect: function() {
              this.game.inventory.resetValues();
              this.game.world.create();
              this.showText("gender");
            }.bind(this)
          },

          {
            id: "credits",
            option: "      Credits           ",
            effect: function() {
              this.showText("credits");
            }.bind(this)
          }
        ]
      }
    ]);

    /*
     * TODO MAIN MENU
     */
    this.addText("credits", "Credits", [{
      condition: null,
      text: [
        "   THE PEPPER PRINCE   ",
        " ",
        " ",
        "A Hypnotic Fairy Tale by",
        "      The Crabman",
        " ",
        " ",
        "       <a class='green' href='https://twitter.com/elCrabman/' target='_blank'>@elCrabman</a>",
        "",
        " <a class='green' href='http://hypnoticowl.com/' target='_blank'>http://hypnoticowl.com/</a>",
        " ",
        " ",
      ].join("\n"),
      options: [{
        id: "back",
        option: "      Back to Menu      ",
        effect: function() {
          this.showText("mainmenu");
        }.bind(this)
      }]
    }]);

    /*
     * TODO GENDER
     */
    this.addText("gender", "The Pepper Prince", [{
      condition: null,
      text: [
        "Choose a gender",
        ""
      ].join("\n"),
      options: [{
          id: "female",
          option: "=female=",
          effect: function() {
            this.gender = 1;
            this.showText("intro");
          }.bind(this)
        },

        {
          id: "transfemale",
          option: "=transfemale=",
          effect: function() {
            this.gender = 1;
            this.showText("intro");
          }.bind(this)
        },

        {
          id: "male",
          option: "=male=",
          effect: function() {
            this.gender = 2;
            this.showText("intro");
          }.bind(this)
        },

        {
          id: "transmale",
          option: "=transmale=",
          effect: function() {
            this.gender = 2;
            this.showText("intro");
          }.bind(this)
        }
      ]
    }]);
  },

  addText: function addText(id, name, texts) {
    if (this.texts[id] != null)
      console.warn("Text ID '" + id + "' already in use");

    this.texts[id] = {
      name: name,
      texts: texts
    };
  },

  showText: function showText(id) {
    if (this.texts[id] == null)
      return console.error("Text ID '" + id + "' not found.");

    var texts = this.texts[id].texts;

    if (texts == null || texts.length == 0)
      return;

    var text;

    for (var i = 0; i < texts.length; i++) {
      if (texts[i].condition == null || (typeof texts[i].condition == "function" && texts[i].condition())) {
        text = texts[i].text;
        this.convo = texts[i];
        break;
      }
    }

    if (text == null || text.length == 0)
      return;

    text = this.updateLabel(text.replace(/{([\w\s]*)\|([\w\s]*)}/g, "\$" + this.gender));
    var verse = $(document.createElement("div")).addClass("verse").append($(document.createElement("p")).html(text));

    if (this.convo.options != null) {
      for (var i = 0; i < this.convo.options.length; i++)
        if (this.convo.options[i].condition == null || (typeof this.convo.options[i].condition == "function" && this.convo.options[i].condition()))
          $(verse).append($(document.createElement("p")).html('<a class="hotpink" href="javascript:game.conversation.choose(\'' + this.convo.options[i].id + '\');">' + this.updateLabel(this.convo.options[i].option) + '</a>'));
    } else
      $(verse).append($(document.createElement("p")).html('<a class="hotpink" href="javascript:game.world.openCurrent();">Continue</a>'));

    $(this.game.content).empty();
    $(this.game.content).append($(document.createElement("div")).attr("id", "conversation").append(verse));
    $(this.game.title).text(this.texts[id].name);

    if (typeof this.convo.effect == "function")
      this.convo.effect();
  },

  choose: function choose(id) {
    if (this.convo == null)
      return console.error("No active conversation found.");

    if (this.convo.options == null)
      return console.error("No options found:", this.convo.id);

    var option;

    for (var i = 0; i < this.convo.options.length; i++) {
      if (this.convo.options[i].id == id) {
        option = this.convo.options[i];
        break;
      }
    }

    if (option == null)
      return console.error("Options ID '" + id + "' not found.");

    var verse = $(document.createElement("div")).addClass("verse");

    if (option.text != null) {
      text = option.text.replace(/{([\w\s]*)\|([\w\s]*)}/g, "\$" + this.gender);
      $(verse).append($(document.createElement("p")).html(this.updateLabel(text)));
    }

    if (option.options != null) {
      this.convo = option;

      for (var i = 0; i < this.convo.options.length; i++)
        if (this.convo.options[i].condition == null || (typeof this.convo.options[i].condition == "function" && this.convo.options[i].condition()))
          $(verse).append($(document.createElement("p")).html('<a class="hotpink" href="javascript:game.conversation.choose(\'' + this.convo.options[i].id + '\');">' + this.updateLabel(this.convo.options[i].option) + '</a>'));
    } else if (!option.stay)
      $(verse).append($(document.createElement("p")).html('<a class="hotpink" href="javascript:game.world.openCurrent();">Continue</a>'));

    if ($(verse).children().length > 0) {
      $(this.game.content).empty();
      $(this.game.content).append($(document.createElement("div")).attr("id", "conversation").append(verse));
    }

    if (typeof option.effect == "function")
      option.effect();
  },

  updateLabel: function updateLabel(text) {
    return text.replace(/\[dwarves\]/, this.getPrice("dwarves"))
      .replace(/\[satin\]/, this.getPrice("satin"))
      .replace(/\[cashmere\]/, this.getPrice("cashmere"))
      .replace(/\[angora\]/, this.getPrice("angora"))
      .replace(/\[pepper\]/, this.getPrice("pepper"))
      .replace(/\[boat\]/, this.getPrice("boat"))
      .replace(/\[chili\]/, this.getPrice("chili"))
      .replace(/\[pipe\]/, this.getPrice("pipe"))
      .replace(/\[fertilizer\]/, this.getPrice("fertilizer"))
      .replace(/#dwarves#/, this.getValue("dwarves"))
      .replace(/#pepper#/, this.getValue("pepper"))
      .replace(/#multi#/, this.getValue("multi"))
      .replace(/#multiplier#/, this.getValue("multiplier"))
      .replace(/#diarrhea#/, this.getValue("diarrhea"))
      .replace(/#harvest#/, this.getValue("harvest"))
      .replace(/#planted#/, this.getValue("planted"))
      .replace(/#harvestchili#/, this.getValue("harvestchili"))
      .replace(/#plantedchili#/, this.getValue("plantedchili"))
      .replace(/=(\w+)=/, "<div class='gender' id='\$1'></div>");
  },

  getPrice: function getPrice(id) {
    switch (id) {
      case "dwarves":
        return (this.game.inventory.dwarves + 1) * (this.game.inventory.dwarves + 1) * 1000;

      case "satin":
        return (this.game.inventory.satin + 1) * (this.game.inventory.satin + 1) * 50;

      case "cashmere":
        return (this.game.inventory.cashmere + 1) * (this.game.inventory.cashmere + 1) * 1000;

      case "angora":
        return (this.game.inventory.angora + 1) * (this.game.inventory.angora + 1) * 10000;

      case "pepper":
        return 300 + (this.game.inventory.allpepper * 200);

      case "chili":
        return 500 + (this.game.inventory.allchili * 300);

      case "fertilizer":
        return 500 + (this.game.inventory.fertilizer * 500);

      case "pipe":
        return 5000;

      case "boat":
        return 5000;

      default:
        console.error("Price for '" + id + "' not found");
        return 0;
    }
  },

  getValue: function getValue(id) {
    switch (id) {
      case "dwarves":
        return this.game.inventory.dwarves;

      case "pepper":
        return Math.floor(this.game.inventory.pepper);

      case "chili":
        return Math.floor(this.game.inventory.chili);

      case "multiplier":
        return Math.round(this.game.inventory.multiplier * (1 + this.getValue("diarrhea")));

      case "fertilizer":
        return this.game.inventory.fertilizer;

      case "multi":
        return this.game.inventory.multiplier;

      case "diarrhea":
        return Math.round((this.game.inventory.diarrhea / this.game.inventory.maxdiarrhea) * 1000) / 10;

      case "planted":
        return this.game.inventory.plantedpepper;

      case "harvest":
        return (Math.round((this.game.inventory.plantedpepper / 60) * 1000 * this.getValue("fertilizer")) / 1000);

      case "plantedchili":
        return this.game.inventory.plantedchili;

      case "harvestchili":
        return (Math.round((this.game.inventory.plantedchili / 160) * 1000 * this.getValue("fertilizer")) / 1000);

      default:
        console.error("Value for '" + id + "' not found");
        return 0;
    }
  }
};
