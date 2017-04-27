define("config", [], () => {

  "use strict"

  let Config = {}

  Config.KEYS = {
    ENTER: 13,
    ESC: 27,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    W: 87,
    S: 83,
    A: 65,
    D: 68,
    R: 82
  }

  Config.MAIN_FONT = "GraphicPixel"
  Config.ALT_FONT = "AdvoCut"

  return Config

})