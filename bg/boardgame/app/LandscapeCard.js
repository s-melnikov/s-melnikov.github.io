import Item from "./Item.js";

class LandscapeCard extends Item {
  constructor({ index, sprite }) {
    super({ 
      width: 297,
      height: 210,
      sprite,
      index,
    });    
    this.el.classList.add("card");
    this.el.appendChild(this.sprite.getCanvas(index));
  }
}

export default LandscapeCard;