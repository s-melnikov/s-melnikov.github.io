class Land {

}

class Scene {

}

class Sprite {

}

class Game {
  constructor({ canvas }) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
  }

  loader(sources) {

  }
}

new Game({
  canvas: document.querySelector("#scene")
})