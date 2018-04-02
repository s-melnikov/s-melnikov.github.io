require(["config", "game", "intro_scene", "menu_scene", "game_scene", "exit_scene"],
  (Config, Game, IntroScene, MenuScene, GameScene, ExitScene) => {
  "use strict"

  new Game({
    IntroScene,
    MenuScene,
    GameScene,
    ExitScene
  })

})