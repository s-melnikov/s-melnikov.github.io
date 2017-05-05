require(["game", "params", "levels"], (Game, params, levels) => {

  let keycodes = [37, 38, 39, 40]
  document.addEventListener("keydown", function(e) {
    if (keycodes.indexOf(e.keyCode) > -1) {
      e.preventDefault()
    }
  })

  new Game(params, levels)
})