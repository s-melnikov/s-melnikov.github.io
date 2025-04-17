import Item from "./Item.js";

class Card extends Item {
  constructor({ index, sprite }) {
    super({ 
      width: 210,
      height: 297,
      sprite,
      index,
    });    
    this.el.classList.add("card");
  }
}

export default Card;