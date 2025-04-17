import Utils from "./Utils.js";
import Table from "./Table.js";
import Sprite from "./Sprite.js";
// import Card from "./Card.js";
import LandscapeCard from "./LandscapeCard.js";

const TYPE_RISK = 0;
const TYPE_GLORY = 1;
const TYPE_QUEST = 2;
const TYPE_LOCATION = 3;
const TYPE_HEROE = 4;

class Item {
  constructor({ width, height, face, className }) {
    this.width = width;
    this.height = height;
    this.face = face;
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.el = document.createElement("div");
    this.el.classList.add("item");
    if (className) {
      this.el.classList.add(className);
    }
    this.el.style.width = `${width}px`;
    this.el.style.height = `${height}px`;
    this.el.__instance__ = this;
    this.renderBg();
  }

  renderBg() {
    const { url, x, y } = this.face;
    this.el.style.backgroundImage = `url(${url})`;
    this.el.style.backgroundPosition = `-${x}px -${y}px`;
  }

  moveTo(x, y) {
    this.x = x;
    this.y = y;
    this.el.style.transform =
      `translate3d(${x}px, ${y}px, 0) rotate(${this.angle}deg)`;
  }

  rotate(deg) {
    this.angle = angle;
    this.el.style.transform =
      `translate3d(${this.x}px, ${this.y}px, 0) rotate(${this.angle}deg)`;
  }
}

class CardAdventure extends Item {
  constructor({ index, sprite }) {
    super({
      width: 210,
      height: 297,
      sprite,
      index,
    });
    this.el.classList.add("card");
  }

  renderBg() {
    const { url, x, y } = this.face;
    this.el.style.backgroundImage = `url(${url})`;
    this.el.style.backgroundPosition = `-${x}px -${y}px`;
  }
}

const table = new Table({
  width: 1600,
  height: 1200,
});

Promise.all([
  Utils.loadImage("/canvas/boardgame/assets/images/asset1.jpg"),
  // Utils.loadJson("assets/assets.json"),
]).then(([asset1, asset2, json]) => {
  hideLoading();

  const item1 = new Item({
    width: 96,
    height: 96,
    face: {
      url: "/canvas/boardgame/assets/images/asset1.jpg",
      x: 3362,
      y: 4160,
    },
    className: "token",
  });
  const item2 = new Item({
    width: 96,
    height: 96,
    face: {
      url: "/canvas/boardgame/assets/images/asset1.jpg",
      x: 3462,
      y: 4160,
    },
    className: "token",
  });
  const item3 = new Item({
    width: 96,
    height: 96,
    face: {
      url: "/canvas/boardgame/assets/images/asset1.jpg",
      x: 3562,
      y: 4160,
    },
    className: "token",
  });
  item1.moveTo(100, 100);
  item2.moveTo(200, 100);
  item3.moveTo(200, 100);
  table.addItem(item1);
  table.addItem(item2);
  table.addItem(item3);
  table.addItem(
    new Item({
      width: 96,
      height: 96,
      face: {
        url: "/canvas/boardgame/assets/images/asset1.jpg",
        x: 3662,
        y: 4160,
      },
      className: "token",
    })
  );


});



  // const adventures = [];
  // const quests = [];
  // const locations = [];
  // const heroes = [];

  // json.cards.forEach(({ index, type }, i) => {
  //   let card = [TYPE_LOCATION, TYPE_HEROE].includes(type)
  //     ? new LandscapeCard({ sprite: sprite2, index })
  //     : new Card({ sprite: sprite1, index });
  //   switch (type) {
  //     case TYPE_RISK:
  //     case TYPE_GLORY:
  //       return adventures.push(card);
  //     case TYPE_QUEST:
  //       return quests.push(card);
  //     case TYPE_LOCATION:
  //       return locations.push(card);
  //     case TYPE_HEROE:
  //       return heroes.push(card);
  //   }
  // });

  function hideLoading() {
    const loading = document.querySelector("#loading");
    loading.addEventListener("transitionend", () => loading.parentNode.removeChild(loading));
    loading.style.opacity = 0;
  }
