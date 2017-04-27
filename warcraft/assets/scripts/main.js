require(["config", "game", "intro_scene", "menu_scene", "game_scene", "exit_scene"],
  (Config, Game, IntroScene, MenuScene, GameScene, ExitScene) => {
  "use strict"

  // launch game
  let game = new Game({
    intro: IntroScene,
    menu: MenuScene,
    game: GameScene,
    exit: ExitScene
  })
})