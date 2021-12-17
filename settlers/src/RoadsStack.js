import { CARD_TYPE_ROAD } from "./const.js";
import Stack from "./Stack.js";

const COUNTS = {
  "2": 5,
  "3": 7,
  "4": 9,
};

class RoadsStack extends Stack {
  constructor(playersCount) {
    super();
    this.fill(CARD_TYPE_ROAD, COUNTS[playersCount]);
  }
}

export default RoadsStack;
