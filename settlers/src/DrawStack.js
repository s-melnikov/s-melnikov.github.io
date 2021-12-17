import {
  CARD_TYPE_BRICK,
  CARD_TYPE_LUMBER,
  CARD_TYPE_WOOL,
  CARD_TYPE_GRAIN,
  CARD_TYPE_ORE,
} from "./const.js";
import Stack from "./Stack.js";

class DrawStack extends Stack {
  constructor() {
    super();
    this.fill(CARD_TYPE_BRICK, 11);
    this.fill(CARD_TYPE_LUMBER, 11);
    this.fill(CARD_TYPE_WOOL, 15);
    this.fill(CARD_TYPE_GRAIN, 14);
    this.fill(CARD_TYPE_ORE, 16);
    this.shuffle();
  }
}

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

export default DrawStack;
