var World = function(game) {
  this.game = game;
  this.currentRoom = "";
  this.map = {};

  this.actions = [];
};

World.prototype = {
  create: function create() {
    window.setInterval(this.game.save.bind(this.game), 10000);

    this.currentRoom = "";
    this.map = {};

    this.addRoom("marmalade", "The Marmalade Forest",

      ["TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTT              TTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTT                    TTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTT            v             TTTTTTTTTTTTTT",
        "TTTTTTT                               TTTTTTTTTTTT",
        "TTTT                                    TTTTTTTTTT",
        "TT                                      TTTTTTTTTT",
        "                                         TTTTTTTTT",
        "                                         TTTTTTTTT",
        "                                         TTTTTTTTT",
        "TT                                 v    TTTTTTTTTT",
        "TT                                      TTTTTTTTTT",
        "TTT                                    TTTTTTTTTTT",
        "TTT                       ___           TTTTTTTTTT",
        "TTTT    v                /___\\           TTTTTTTTT",
        "TTTTT             # # #  |   |             TTTTTTT",
        "TTTTTTT           # # #  |_A_|              TTTTTT",
        "TTTTTTTTTT        # # #                      TTTTT",
        "TTTTTTTTTTTTT     # # #                      TTTTT",
        "TTTTTTTTTTTTTTT   # # #                     TTTTTT",
        "TTTTTTTTTTTTTTTT  # # #          v         TTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTT                TTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTT             TTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"
      ].join("\n"),

      {
        interact: [{
            type: "exit",
            pos: { x: 0, y: 11 },
            char: "#",
            target: "path",
            visible: true
          },

          {
            type: "char",
            name: "goldass",
            pos: { x: 12, y: 10 },
            char: "G",
            visible: false
          }
        ]
      }
    );

    this.addRoom("path", "The Path",

      ["TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTT      TTTTTTTTTTTTTTTTTT      TTTTTT",
        "TTTTTTTTTTTT         TTTTTTTTTTTTTT          TTTTT",
        "TTTTTTTTTTT    TTT     TTTTTTTTT              TTTT",
        "TTTTTTTTTT    TTTTT     TTTTTTT          T    TTTT",
        "TTTTTTTTTT   TTTTTTTT     TTTT           TT   TTTT",
        "TTTTTTTTTT    TTTTTTTT    TTTT           TT   TTTT",
        "TTTTTTTTTT      TTTTTTT    TT            TTT   TTT",
        "TTTTTTTTTTT      TTTTTTT   TT            TTT   TTT",
        "TTTTTTTTTTTTT      TTTTT   TT           TTTTT   TT",
        "TTTTTTTTTTTTTT      TTTT   TTT          TTTTT   TT",
        "TTTTTTTTTTTTTTTT     TTT   TTTT        TTTTTTT    ",
        "TTTTTTTTTTTTTTTTT    TTT    TTTT        TTTTTT    ",
        "TTTTTTTTTTTTTTTTTT    TTT   TTTTTTT     TTTTTTT   ",
        "TTTTTTTTTTTTTTTTTTT   TTT   TTTTTTTTT    TTTTTTTTT",
        "TTTTTTTTTTTTTTTTTT    TTT   TTTTTTTTTT    TTTTTTTT",
        "   TTTTTTTTTTTTTTT   TTTT   TTTTTTTTTTT   TTTTTTTT",
        "     TTTTTTTTTTTT    TTT   TTTTTTTTTTTTT  TTTTTTTT",
        "       TTTTTTTTT    TTTT   TTTTTTTTTTTTT  TTTTTTTT",
        "TT       TTTTT     TTTT   TTTTTTTTTTTTT   TTTTTTTT",
        "TTTT       TT      TTTT   TTTTTTTTTTTTT   TTTTTTTT",
        "TTTTTTT          TTTTTT   TTTTTTTTTTT    TTTTTTTTT",
        "TTTTTTTTTT     TTTTTTTT    TTTTTTTTT     TTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTT      TTTT      TTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTT      TT       TTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTT         TTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTT        TTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"
      ].join("\n"),

      {
        interact: [{
            type: "exit",
            pos: { x: 0, y: 18 },
            char: "#",
            target: "peoplevillage",
            visible: true
          },

          {
            type: "exit",
            pos: { x: 49, y: 13 },
            char: "#",
            target: "marmalade",
            visible: true
          },

          {
            type: "char",
            name: "donkey",
            pos: { x: 34, y: 8 },
            char: "G",
            visible: true
          }
        ]
      }
    );

    this.addRoom("peoplevillage", "The People's Village",

      ["TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTT          TTTTTTTTTTTT            TTTTTTTT",
        "TTTTTT    ____      TTTTTTTTT     ___      TTTTTTT",
        "TTTTT    /____\\       TTTTTT     /___\\      TTTTTT",
        "TTTT     |SHOP|       TTTTTT     |   |      TTTTTT",
        "TTT      |__ _|         TTT      |_A_|        TTTT",
        "TTT                  _   T                    TTTT",
        "TTT                 /_\\                        TTT",
        "TTT                 | |       v                TTT",
        "TT                  |@|                        TTT",
        "TT                                             TTT",
        "TT     v                                       TTT",
        "TT                      PPP                    TTT",
        "                     PPPPPPPPP                TTTT",
        "                  PPPPPPPPPPPPPPP         v   TTTT",
        "                 PPPPPPPPPPPPPPPPPP            TTT",
        "TT              PPPPPPPPPPPPPPPPPPPP           TTT",
        "TT           ___  PPPPPPPPPPPPPPPP ___          TT",
        "TT          /___\\  PPPPP   PPPPPP /___\\           ",
        "TTT         |   |   PPPPPPPPPPPP  |   |           ",
        "TTT         |_A_|    PPPPPPPPPP   |_A_|           ",
        "TTT                                             TT",
        "TTT                                            TTT",
        "TT  ~~~~~~~~~~~~~~~~~~~~| |~~~~~~~~~~~~~~~~~~~  TT",
        "T  ~~~~~~~~~~~~~~~~~~~~~| |~~~~~~~~~~~~~~~~~~~~  T",
        "  ~~~~~~~~~~~~~~~~~~~~~~| |~~~~~~~~~~~~~~~~~~~~~  ",
        " ~~~~~~~~~~~~~~~~~~~~~~~| |~~~~~~~~~~~~~~~~~~~~~~ ",
        "~~~~~~~~~~~~~~~~~~~~~~~~| |~~~~~~~~~~~~~~~~~~~~~~~",
        "~~~~~~~~~~~~~~~~~~~~~~~~| |~~~~~~~~~~~~~~~~~~~~~~~"
      ].join("\n"),

      {
        interact: [{
            type: "exit",
            pos: { x: 0, y: 15 },
            char: "#",
            target: "candymountains",
            visible: true
          },

          {
            type: "exit",
            pos: { x: 49, y: 20 },
            char: "#",
            target: "path",
            visible: true
          },

          {
            type: "exit",
            pos: { x: 25, y: 29 },
            char: "#",
            target: "villagepeople",
            visible: false
          },

          {
            type: "char",
            name: "fairy",
            pos: { x: 25, y: 29 },
            char: "F",
            visible: true
          },

          {
            type: "char",
            name: "shop",
            pos: { x: 12, y: 6 },
            char: "A",
            visible: true
          },

          {
            type: "char",
            name: "parade",
            pos: { x: 25, y: 19 },
            char: "M",
            visible: true
          }
        ]
      }
    );

    this.addRoom("candymountains", "The Candy Mountains",

      ["TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTT               TTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTT        __          TTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTT        /  \\    v     TTTTTTTTTTTTTTTTTTT",
        "TTTTTTTT        /    \\           TTTTTTTTTTTTTTTTT",
        "TTTTTT         /VVVVVV\\____        TTTTTTTTTTTTTTT",
        "TTTTT         /            \\         TTTTTTTTTTTTT",
        "TTTTT  v     /              \\          TTTTTTTTTTT",
        "TTTT        /                \\          TTTTTTTTTT",
        "TTTT       /                  \\          TTTTTTTTT",
        "TTTT      /                    \\          TTTTTTTT",
        "TTTT     /_________ ____________\\          TTTTTTT",
        "TTTTT                                             ",
        "TTTTT                                    v        ",
        "TTTTTT                                            ",
        "TTTTTTT                                        TTT",
        "TTTTTTTT                                     TTTTT",
        "TTTTTTTTTT                                 TTTTTTT",
        "TTTTTTTTTTTT          v               TTTTTTTTTTTT",
        "TTTTTTTTTTTTTT                      TTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTT              TTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTT         TTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"
      ].join("\n"),

      {
        interact: [{
            type: "exit",
            pos: { x: 49, y: 16 },
            char: "#",
            target: "peoplevillage",
            visible: true
          },

          {
            type: "char",
            name: "cave",
            pos: { x: 19, y: 14 },
            char: "O",
            visible: true
          }
        ]
      }
    );

    this.addRoom("villagepeople",
      "Village People's The", ["~~~~~~~~~~~~~~~~~~~~~~~~| |~~~~~~~~~~~~~~~~~~~~~~~",
        "~~~~~~~~~~~~~~~~~~~~~~~~| |~~~~~~~~~~~~~~~~~~~~~~~",
        " ~~~~~~~~~~~~~~~~~~~~~~~| |~~~~~~~~~~~~~~~~~~~~~~ ",
        "  ~~~~~~~~~~~~~~~~~~~~~~| |~~~~~~~~~~~~~~~~~~~~~  ",
        "T  ~~~~~~~~~~~~~~~~~~~~~| |~~~~~~~~~~~~~~~~~~~~  T",
        "TT  ~~~~~~~~~~~~~~~~~~~~| |~~~~~~~~~~~~~~~~~~~  TT",
        "TT                                             TTT",
        "TT           ___                   ___          TT",
        "TTT         /___\\                 /___\\           ",
        "TTT         |   |        v        |   |           ",
        "TTT         |_A_|                 |_A_|           ",
        "TTT                                             TT",
        "TT                                             TTT",
        "TT                                             TTT",
        "TT                                             TTT",
        "                                          v   TTTT",
        "                                              TTTT",
        "                      _                        TTT",
        "TT     v             /_\\                       TTT",
        "TT                   | |                       TTT",
        "TTT        ____      |@|           ___         TTT",
        "TTT       /____\\             v    /___\\        TTT",
        "TTT       |SHOP|         T        |   |        TTT",
        "TTT       |__ _|        TTT       |_A_|       TTTT",
        "TTTT                   TTTTT                 TTTTT",
        "TTTTT                 TTTTTTT               TTTTTT",
        "TTTTTTT            TTTTTTTTTTT             TTTTTTT",
        "TTTTTTTTT         TTTTTTTTTTTTT          TTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"
      ].join("\n"),

      {
        interact: [{
            type: "exit",
            pos: { x: 0, y: 16 },
            char: "#",
            target: "mousemountain",
            visible: false
          },

          {
            type: "exit",
            pos: { x: 49, y: 9 },
            char: "#",
            target: "convenientfield",
            visible: true
          },

          {
            type: "exit",
            pos: { x: 25, y: 0 },
            char: "#",
            target: "peoplevillage",
            visible: true
          },

          {
            type: "char",
            name: "card",
            pos: { x: 0, y: 16 },
            char: "W",
            visible: true
          },

          {
            type: "char",
            name: "steve",
            pos: { x: 13, y: 23 },
            char: "A",
            visible: true
          }
        ]
      }
    );

    this.addRoom("convenientfield", "The Conveniently Located Fields",

      ["TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTT               TTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTT       v            TTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTT                      TTTTTTTTTTTTTTTTTTT",
        "TTTTTTTT                         TTTTTTTTTTTTTTTTT",
        "                 # # #           TTTTTTTTTTTTTTTTT",
        "                 # # #             TTTTTTTTTTTTTTT",
        "                 # # #       v    TTTTTTTTTTTTTTTT",
        "TTT              # # #             TTTTTTTTTTTTTTT",
        "TTTTT            # # #            TTTTTTTTTTTTTTTT",
        "TTTTT            # # #            TTTTTTTTTTTTTTTT",
        "TTTTTT   v       # # #            TTTTTTTTTTTTTTTT",
        "TTTTTT           # # #           TTTTTTTTTTTTTTTTT",
        "TTTTTTT          # # #          TTTTTTTTTTTTTTTTTT",
        "TTTTTTTT                        TTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTT               v     TTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTT                  TTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTT            TTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"
      ].join("\n"),

      {
        interact: [{
          type: "exit",
          pos: { x: 0, y: 9 },
          char: "#",
          target: "villagepeople",
          visible: true
        }]
      }
    );

    this.addRoom("mousemountain",
      "The Mousey Mountains", ["TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTT               TTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTT     __                 TTTTTTTTTTTTTT",
        "TTTTTTTTT       /  \\   v             TTTTTTTTTTTTT",
        "TTTTTTTT       /    \\       __        TTTTTTTTTTTT",
        "TTTTTT        /wwwwww\\     /  \\        TTTTTTTTTTT",
        "TTTTT        /        \\___/    \\        TTTTTTTTTT",
        "TTTT   v    /            /wwwwww\\         TTTTTTTT",
        "TTTT       /        ____/        \\         TTTTTTT",
        "TTTTT     /        /              \\         TTTTTT",
        "TTTTT    /________/                \\           TTT",
        "   TTT           /___________ ______\\             ",
        "     T                                            ",
        "                                                  ",
        "     TT                            v           TTT",
        "   TTTTT                                     TTTTT",
        "TTTTTTTTTT      v                          TTTTTTT",
        "TTTTTTTTTTTT                          TTTTTTTTTTTT",
        "TTTTTTTTTTTTTTT                     TTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTT      TTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"
      ].join("\n"),

      {
        interact: [{
            type: "exit",
            pos: { x: 0, y: 16 },
            char: "#",
            target: "castle",
            visible: false
          },

          {
            type: "exit",
            pos: { x: 49, y: 15 },
            char: "#",
            target: "villagepeople",
            visible: true
          },

          {
            type: "char",
            name: "cardio",
            pos: { x: 6, y: 16 },
            char: "W",
            visible: true
          },

          {
            type: "char",
            name: "mousecave",
            pos: { x: 29, y: 14 },
            char: "O",
            visible: true
          }
        ]
      }
    );

    this.addRoom("castle",
      "The Punless Castle", ["TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTT                                        TTTTT",
        "TTTTT    _   _   _              _   _   _    TTTTT",
        "TTTTT   | |_| |_| |            | |_| |_| |   TTTTT",
        "TTTTT   \\         /     /\\     \\         /   TTTTT",
        "TTTTT    \\       /     /  \\     \\       /    TTTTT",
        "TTTTT     |  _  |     /____\\     |  _  |     TTTTT",
        "TTTTT     | |_| |  _  |    |  _  | |_| |     TTTTT",
        "TTTTT     |     |_| |_|    |_| |_|     |     TTTTT",
        "TTTTT     |             __             |     TTTTT",
        "TTTTT     |           _|__|_           |     TTTTT",
        "TTTTT     |__________|======|__________|     TTTTT",
        "TTTTT                '======'                TTTTT",
        "TTTTT                                             ",
        "TTTTT                                             ",
        "TTTTT                                             ",
        "TTTTTTTTTTTTTTTTTTTT  TTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTT             TT  TT                     TTTTT",
        "TTTTT             TT      TTTTTTTTTTTT  TTTTTTTTTT",
        "TTTTT    TTTTTTTTTTT  TTTTTT            TT   TTTTT",
        "TTTTT    TT           TT      TTTTTT  TTTT   TTTTT",
        "TTTTT         TT      TT  TT      TT         TTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"
      ].join("\n"),

      {
        interact: [{
            type: "exit",
            pos: { x: 49, y: 18 },
            char: "#",
            target: "mousemountain",
            visible: true
          },

          {
            type: "char",
            name: "theprince",
            pos: { x: 14, y: 18 },
            char: "M",
            visible: true
          }
        ]
      }
    );
  },

  addRoom: function addRoom(id, title, room, args) {
    if (this.map[id] != null)
      console.warn("Room ID '" + id + "' already in use");

    this.map[id] = {
      title: title,
      room: $(document.createElement("div")).addClass("room").text(room),
      args: args
    };
  },

  openCurrent: function openCurrent() {
    this.openRoom(this.currentRoom);
  },

  openRoom: function openRoom(id) {
    if (this.map[id] == null)
      return console.error("Room ID '" + id + "' not found.");

    var room = $(this.map[id].room).clone();
    var map = $(room).text().substr(0);

    if (this.map[id].args != null) {
      var interact = this.map[id].args.interact;

      var pos = [];

      for (var i = 0; i < interact.length; i++) {
        if (!interact[i].visible)
          continue;

        var val = (interact[i].pos.y * 51) + interact[i].pos.x;

        if (pos[val] == null)
          pos[val] = [];

        pos[val].push('<a class="hotpink" href="javascript:game.world.' + (interact[i].type == "exit" ? "exit" : "interact") + '(\'' + (interact[i].type == "exit" ? interact[i].target : interact[i].name) + '\');">' + interact[i].char + '</a>');
      }

      for (var i = pos.length; i >= 0; i--) {
        if (pos[i] == null)
          continue;

        for (var j = 0; j < pos[i].length; j++)
          map = map.replaceBetween(i, i + 1, pos[i][j]);
      }
    }

    map = this.styleMap(map);

    this.currentRoom = id;

    $(room).html(map);

    $(this.game.content).empty();
    $(this.game.content).append(room);
    $(this.game.title).text(this.map[id].title);
  },

  styleMap: function styleMap(map) {
    map = map.replace(/(T+)/g, "<span class='green'>\$1</span>")
      .replace(/( v )/g, "<span class='green'>\$1</span>")
      .replace(/(~+)/g, "<span class='blue'>\$1</span>")
      .replace(/(# # #)/g, "<a class='blue' href=\"javascript:game.conversation.showText('pepperfield');\">\$1</a>");

    return map;
  },

  exit: function exit(target) {
    if (this.map[target] == null)
      return console.error("Room ID '" + target + "' not found");

    this.openRoom(target);
  },

  interact: function interact(name) {
    if (this.currentRoom.length == 0 || this.map[this.currentRoom] == null)
      return console.error("Room ID '" + this.currentRoom + "' not found");

    var interacts = this.map[this.currentRoom].args.interact;

    if (interacts == null)
      return console.error("Interactable ID '" + name + "' not found");

    var object;

    for (var i = 0; i < interacts.length; i++) {
      if (interacts[i].name == name) {
        object = interacts[i];
        break;
      }
    }

    if (object == null)
      return console.error("Interactable ID '" + name + "' not found");

    this.game.conversation.showText(name);
  },

  changeAttribute: function changeAttribute(id, attr, value) {
    var result;

    for (var m in this.map) {
      result = $.grep(this.map[m].args.interact, function(e) {
        return e.name == id || e.target == id; });

      if (result.length > 0)
        break;
    }

    if (result.length == 0)
      return console.error(id + " not found.");

    this.actions.push({ id: id, attr: attr, value: value });

    result[0][attr] = value;
  }
};
