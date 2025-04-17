import { CARD_TYPE_SETTLEMENT } from "./const.js";
import Stack from "./Stack.js";

const COUNTS = {
  "2": 7,
  "3": 11,
  "4": 15,
};

class SettlementsStack extends Stack {
  constructor(playersCount) {
    super();
    this.fill(CARD_TYPE_SETTLEMENT, COUNTS[playersCount]);
  }
}

export default SettlementsStack;
