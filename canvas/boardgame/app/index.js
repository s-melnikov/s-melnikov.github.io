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
  constructor({ width, height, face, back }) {
    this.width = width;
    this.height = height;
    this.face = face;
    this.back = back;
    this.x = 0;
    this.y = 0;
    this.el = document.createElement("div");
    this.el.classList.add("item");
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

const table = new Table({ 
  width: 4200,
  height: 3600,
});

Promise.all([
  Utils.loadImage("assets/images/asset1.jpg"),
  // Utils.loadImage("assets/images/asset2.jpg"),
  // Utils.loadJson("assets/assets.json"),
]).then(([asset1, asset2, json]) => {
  hideLoading();
  table.addItem(
    new Item({
      width: 420,
      height: 594,
      face: {
        url: "assets/images/asset1.jpg",
        x: 0,
        y: 0,
      },
      back: {
        url: "assets/images/asset1.jpg",
        x: 3 * 420,
        y: 7 * 594,
      }
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

  // adventures.forEach((card) => {
  //   table.addItem(card);
  //   card.moveTo(20, 20);
  // }); 
  // quests.forEach((card) => {
  //   table.addItem(card);
  //   card.moveTo(250, 20);
  // });
  // locations.forEach((card) => {
  //   table.addItem(card);
  //   card.moveTo(480, 20);
  // });
  // heroes.forEach((card) => {
  //   table.addItem(card);
  //   card.moveTo(710, 20);
  // });

  function hideLoading() {
    const loading = document.querySelector("#loading");
    loading.addEventListener("transitionend", () => loading.parentNode.removeChild(loading));
    loading.style.opacity = 0;
  }