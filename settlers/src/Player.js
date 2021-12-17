class Player {
  constructor(game) {
    this.game = game;
    this.state = {};
    this.hand = [];
    this.roads = [];
    this.roads = [];
  }

  setState(data) {
    this.state = { ...this.state, ...data };
    this.update();
  }
}

export default Player
