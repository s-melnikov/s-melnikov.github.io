class Item {
  constructor({ width, height, sprite, index }) {
    this.width = width;
    this.height = height;
    this.sprite = sprite;
    this.index = index;
    this.x = 0;
    this.y = 0;
    this.deg = 0;

    this.el = document.createElement("div");
    this.el.classList.add("item");
    this.el.style.width = `${width}px`;
    this.el.style.height = `${height}px`;

    this.el.__instance__ = this;
    this.el.appendChild(this.sprite.getCanvas(index));
  }
  
  moveTo(x, y) {
    this.x = x;
    this.y = y;
    this.el.style.transform = 
      `translate3d(${x}px, ${y}px, 0) rotate(${this.deg}deg)`;
  }

  rotate(deg) {
    this.deg = deg;
    this.el.style.transform = 
      `translate3d(${this.x}px, ${this.y}px, 0) rotate(${this.deg}deg)`;
  }
}

export default Item;