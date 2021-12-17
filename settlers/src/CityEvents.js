import {
  CITY_EVENT_BRIGAND,
  CITY_EVENT_FAIR,
} from "./const.js";
import { shuffleArray } from "./utils.js";

class CityEvents {
  constructor(playersCount) {
    this.events = [];
    this.fill(CITY_EVENT_BRIGAND, 5);
    this.fill(CITY_EVENT_FAIR, 2);
    if (playersCount > 2) {
      this.fill(CITY_EVENT_BRIGAND, 3);
      this.fill(CITY_EVENT_FAIR, 1);
    }
    if (playersCount > 3) {
      this.fill(CITY_EVENT_BRIGAND, 3);
      this.fill(CITY_EVENT_FAIR, 1);
    }
    shuffleArray(this.events);
  }

  fill(event, count) {
    for (let i = 0; i < count; i++) {
      this.events.push(event);
    }
  }
}

export default CityEvents;
