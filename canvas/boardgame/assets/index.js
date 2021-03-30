const Utils = {
  loadImage(src, cb) {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.src = src;
    });
  }
};

class Sprite {
  constructor({ image, cols, rows, width, height }) {
    this.image = image;
    this.cols = cols;
    this.width = width;
    this.height = height;
  }

  getCanvas(index) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = this.width;
    canvas.height = this.height;
    context.drawImage(
      this.image, 
      (index % this.cols) * this.width, 
      Math.floor(index / this.cols) * this.height, 
      this.width, 
      this.height, 
      0, 
      0, 
      this.width, 
      this.height, 
    );
    return canvas;
  }
}

class Table {
  constructor({ el, width, height }) {
    this.el = el;
    this.width = width;
    this.height = height;
    this.el.style.width = `${width}px`;
    this.el.style.height = `${height}px`;
    this.items = [];
  }

  add(item) {
    this.items.push(item);
    this.el.appendChild(item.getEl());
    item.scene = this;
  }

  moveToEnd(item) {
    const el = item.getEl();
    this.el.appendChild(el);
  }
}

class Item {
  constructor({ width, height, sprite, index }) {
    this.width = width;
    this.height = height;
    this.sprite = sprite;
    this.index = index;
    this.x = 0;
    this.y = 0;

    this.el = document.createElement("div");
    this.el.classList.add("item");
    this.el.style.width = `${width}px`;
    this.el.style.height = `${height}px`;

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);

    this.el.addEventListener("mousedown", this.handleMouseDown);
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mouseup", this.handleMouseUp);
  }

  handleMouseDown(event) {
    this.dragged = true;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.startX = this.x;
    this.startY = this.y;
    this.scene.moveToEnd(this);
  }

  handleMouseUp() {
    this.dragged = false;
  }

  handleMouseMove(event) {
    if (!this.dragged) return;
    const { clientX: x, clientY: y } = event;
    this.moveTo(
      this.startX + x - this.dragStartX,
      this.startY + y - this.dragStartY,
    );   
  }

  destroy() {
    this.el.removeEventListener("mousedown", this.handleMouseDown);
    window.removeEventListener("mousemove", this.handleMouseMove);  
    window.removeEventListener("mouseup", this.handleMouseUp);  
  }

  getEl() {
    return this.el;
  }

  moveTo(x, y) {
    this.x = x;
    this.y = y;
    this.el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }
}

class Card extends Item {
  constructor({ index, sprite }) {
    super({ 
      width: 210,
      height: 297,
      sprite,
      index,
    });    
    this.el.classList.add("card");
    this.el.appendChild(this.sprite.getCanvas(index));
  }
}

Utils.loadImage("assets/images/asset.jpg").then((image) => {
  const sprite = new Sprite({ 
    image,
    cols: 10,
    width: 420,
    height: 594,
  });

  const table = new Table({ 
    el: document.querySelector("#table"),
    width: 4200,
    height: 4200,
  });

  for (let i = 0; i < 107; i++) {
    let card = new Card({ sprite, index: i });
    table.add(card);
    card.moveTo(230 * (i % 10), 317 * Math.floor(i / 10));
  }
});