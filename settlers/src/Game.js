import Stack from "./Stack.js";
import Player from "./Player.js";
import DrawStack from "./DrawStack.js";
import RoadsStack from "./RoadsStack.js";
import KnightsStack from "./KnightsStack.js";
import SettlementsStack from "./SettlementsStack.js";
import CityEvents from "./CityEvents.js";
import ExpansionsStack from "./ExpansionsStack.js";

class DiscardPile extends Stack {}

class Game {
  constructor() {
    this.state = {};
    this.playersCount = 2;
  }

  setState(data) {
    this.state = { ...this.state, ...data };
    this.update();
  }

  update() {
    if (this.queueRender) return;
    this.queueRender = true;
    requestAnimationFrame(this.render.bind(this));
  }

  render() {
    this.queueRender = false;
    console.log("render()", this.state);
  }

  start() {
    this.players = [];
    for (let i = 0; i < this.playersCount; i++) {
      this.players.push(new Player(this));
    }

    this.drawStack = new DrawStack();
    this.discardPile = new DiscardPile();
    this.roadsStack = new RoadsStack(this.playersCount);
    this.knightsStack = new KnightsStack(this.playersCount);
    this.settlementsStack = new SettlementsStack(this.playersCount);
    this.cityEvents = new CityEvents(this.playersCount);
    this.expansionsStack = new ExpansionsStack(this.playersCount);
  }
}

export default Game;
