import {
  CARD_TWO_SIDES,
  CARD_SIDE_A,
} from "./const.js";
import { shuffleArray } from "./utils.js";

class Stack {
  constructor() {
    this.cards = [];
  }

  add(card) {
    if (!card) throw Error("Stack:add()", { card });
    this.cards.push(card);
  }

  get() {
    return this.cards.pop();
  }

  fill(type, count) {
    for (let i = 0; i < count; i++) {
      this.add({ type, side: CARD_SIDE_A });
    }
  }

  shuffle() {
    shuffleArray(this.cards);
  }
}

export default Stack;
