import { CARD_TYPE_KNIGHT } from "./const.js";
import Stack from "./Stack.js";

const COUNTS = {
  "2": 2,
  "3": 4,
  "4": 5,
};

class KnightsStack extends Stack {
  constructor(playersCount) {
    super();
    this.fill(CARD_TYPE_KNIGHT, COUNTS[playersCount]);    
  }
}

export default KnightsStack;
