import {
  CARD_TYPE_CHURCH,
  CARD_TYPE_CITADEL,
  CARD_TYPE_LIBRARY,
  CARD_TYPE_CATHEDRAL,
  CARD_TYPE_UNIVERSITY,
  CARD_TYPE_TOWN_HALL,
  CARD_TYPE_GUILD,
} from "./const.js";
import Stack from "./Stack.js";

class KnightsStack extends Stack {
  constructor(playersCount) {
    super();
    this.add({ CARD_TYPE_CHURCH });
    this.add({ CARD_TYPE_CITADEL });
    this.add({ CARD_TYPE_LIBRARY });
    this.add({ CARD_TYPE_CATHEDRAL });
    this.add({ CARD_TYPE_UNIVERSITY });
    this.add({ CARD_TYPE_TOWN_HALL });
    if (playersCount > 2) {
      this.add({ CARD_TYPE_CHURCH });
      this.add({ CARD_TYPE_GUILD });
    }
    if (playersCount > 3) {
      this.add({ CARD_TYPE_CITADEL });
      this.add({ CARD_TYPE_GUILD });
    }
  }
}

export default KnightsStack;
