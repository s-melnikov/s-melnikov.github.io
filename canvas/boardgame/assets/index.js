const Utils = {
  loadImage(src) {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.src = src;
    });
  },
  loadJson(src) {
    return fetch(src).then((r) => r.json());
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

    const x = canvas.width / 2;
    const y = canvas.height / 2;
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
  constructor({ width, height }) {
    const el = document.createElement("div");
    const container = document.createElement("div");
    const selection = document.createElement("div");
    this.el = el;    
    this.container = container;    
    this.selection = selection;    
    this.el.id = "table";    
    this.container.id = "container";    
    this.selection.id = "selection";    
    this.width = width;
    this.height = height;
    this.el.style.width = `${width}px`;
    this.el.style.height = `${height}px`;
    this.items = [];
    this.grabbed = [];
    document.body.appendChild(this.el);
    document.body.appendChild(this.selection);
    this.el.appendChild(this.container);

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);

    window.addEventListener("mousedown", this.handleMouseDown);
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mouseup", this.handleMouseUp);
  }

  handleMouseDown(event) {
    let parent = event.target;
    const { clientX: x, clientY: y } = event;
    this.prevCursor = { x, y };
    while (parent) {
      if (parent.__instance__) {
        this.grabbed = [parent.__instance__];
        this.container.appendChild(parent);
        return;
      };
      parent = parent.parentNode;
    }

    this.selection.style.display = "block";
    this.selection.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    this.selection.data = { x, y, width: 0, height: 0 };
  }

  handleMouseUp() {
    this.prevCursor = null;
    if (this.grabbed.length)  {
      this.grabbed = [];
    } else {
      // this.selection.style.display = "none";
      // this.selection.style.width = "";
      // this.selection.style.height = "";      
    }
  }

  handleMouseMove(event) {
    if (!this.prevCursor) return;
    const { clientX: x, clientY: y } = event;
    const { x: prevX, y: prevY } = this.prevCursor;
    const { offsetWidth, offsetHeight } = this.container;
    const deltaX = prevX - x;
    const deltaY = prevY - y;
    if (this.grabbed.length) {
      this.grabbed.forEach((item) => {
        const nextX = item.x - deltaX;
        const nextY = item.y - deltaY;
        const maxX = offsetWidth - item.width;
        const maxY = offsetHeight - item.height;
        item.moveTo(
          Math.min(Math.max(0, nextX), maxX),
          Math.min(Math.max(0, nextY), maxY),
        );   
      }); 
    } else {
      // const { x: _x, y: _y, width, height } = this.selection.data;
      // const nextWidth = width - deltaX;
      // const nextHeight = height - deltaY;
      // const nextX = 0;
      // const nexty = 0;
      // this.selection._width = nextWidth;
      // this.selection._height = nextHeight;
      // this.selection.style.width = `${Math.abs(nextWidth)}px`;
      // this.selection.style.height = `${Math.abs(nextHeight)}px`;
      // this.selection.style.transform = `translate3d(${_x}px, ${_y}px, 0)`;
      // this.selection.data = { 
      //   x: nextX,
      //   y: nextY,
      //   width: nextWidth, 
      //   height: nextHeight, 
      // };
    }
    this.prevCursor = { x, y }; 
  }

  add(item) {
    this.items.push(item);
    this.container.appendChild(item.getEl());
    item.scene = this;
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
    this.deg = 0;

    this.el = document.createElement("div");
    this.el.classList.add("item");
    this.el.style.width = `${width}px`;
    this.el.style.height = `${height}px`;

    this.el.__instance__ = this;
    this.el.appendChild(this.sprite.getCanvas(index));
  }

  getEl() {
    return this.el;
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

const TYPE_RISK = 0;
const TYPE_GLORY = 1;
const TYPE_QUEST = 2;
const TYPE_LOCATION = 3;
const TYPE_HEROE = 4;

Promise.all([
  Utils.loadImage("assets/images/asset1.jpg"),
  Utils.loadImage("assets/images/asset2.jpg"),
  Utils.loadJson("assets/assets.json"),
]).then(([asset1, asset2, json]) => {
  const sprite1 = new Sprite({ 
    image: asset1,
    cols: 10,
    width: 420,
    height: 594,
  });
  const sprite2 = new Sprite({ 
    image: asset2,
    cols: 5,
    width: 594,
    height: 420,
  });

  const table = new Table({ 
    width: 2600,
    height: 1800,
  });

  const adventures = [];
  const quests = [];
  const locations = [];
  const heroes = [];

  json.cards.forEach(({ index, type }, i) => {
    let card = [TYPE_LOCATION, TYPE_HEROE].includes(type)
      ? new LandscapeCard({ sprite: sprite2, index })
      : new Card({ sprite: sprite1, index });
    switch (type) {
      case TYPE_RISK:
      case TYPE_GLORY:
        return adventures.push(card);
      case TYPE_QUEST:
        return quests.push(card);
      case TYPE_LOCATION:
        return locations.push(card);
      case TYPE_HEROE:
        return heroes.push(card);
    }
  });

  adventures.forEach((card) => {
    table.add(card);
    card.moveTo(20, 20);
  }); 
  quests.forEach((card) => {
    table.add(card);
    card.moveTo(250, 20);
  });
  locations.forEach((card) => {
    table.add(card);
    card.moveTo(480, 20);
  });
  heroes.forEach((card) => {
    table.add(card);
    card.moveTo(710, 20);
  });
});