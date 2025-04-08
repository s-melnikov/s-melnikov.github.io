async function loadImage(path) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.src = "/games/royal-goods/" + path;
  });
}

async function loadJSON(path) {
  const resp = await fetch("/games/royal-goods/" + path);
  return resp.json();
}

async function loadingAssets(assets) {
  const entries = Object.entries(assets);
  const result = await Promise.all(
    entries.map(([, val]) => {
      switch (val.type) {
        case "json":
          return loadJSON(val.path);
        default:
          return loadImage(val.path);
      }
    }),
  );
  entries.forEach(([key], index) => {
    assets[key] = result[index];
  });
  return assets;
}

async function init() {
  console.log("init()");

  const assets = await loadingAssets({
    image: { path: "images/sprite_all_hq.jpg", type: "image" },
    data: { path: "assets.json", type: "json" },
  });

  const game = new Game({ el: document.querySelector("#root") });

  assets.data.cards
    .sort((a, b) => {
      if (!a.hasSun < !b.hasSun) return -1;
      if (!a.hasSun > !b.hasSun) return 1;
      return 0;
    })
    .forEach((el, i) => {
      const card = new Card(el, game);
      card.move(i * 50, 100);
      game.add(card.el);
    });
}

class Game {
  selected = [];

  elements = [];

  constructor({ el }) {
    this.el = el;
    this.el.style.width = "2000px";
    this.el.style.height = "2000px";
    const stored = localStorage.gameTransform;
    this.transform = stored
      ? JSON.parse(stored)
      : {
        x: -500,
        y: -500,
        z: 0,
        scale: 0.5,
        rotateX: 10
      };

    this.handleClick = this.handleClick.bind(this);
    this.handleWindowMouseWheel = this.handleWindowMouseWheel.bind(this);
    this.handleWindowMouseDown = this.handleWindowMouseDown.bind(this);
    this.handleWindowMouseUp = this.handleWindowMouseUp.bind(this);
    this.handleWindowMouseOut = this.handleWindowMouseOut.bind(this);
    this.handleWindowMouseMove = this.handleWindowMouseMove.bind(this);
    this.handleWindowContextMenu = this.handleWindowContextMenu.bind(this);

    this.el.addEventListener("click", this.handleClick);
    window.addEventListener("mousewheel", this.handleWindowMouseWheel);
    window.addEventListener("mousedown", this.handleWindowMouseDown);
    window.addEventListener("mouseup", this.handleWindowMouseUp);
    window.addEventListener("mouseout", this.handleWindowMouseOut);
    window.addEventListener("mousemove", this.handleWindowMouseMove);
    window.addEventListener("contextmenu", this.handleWindowContextMenu);

    this.applyTransfrom();
  }

  applyTransfrom() {
    const { x, y, scale, rotateX } = this.transform;
    this.el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    document.body.style.transform
      = `rotateX(${rotateX}deg) scale(${scale})`;
    localStorage.gameTransform = JSON.stringify(this.transform);
  }

  add(el) {
    this.elements.push(el);
    this.el.appendChild(el);
  }

  select(el) {
    if (!this.selected.includes(el)) {
      el.onSelect();
      this.selected.push(el);
    }
  }

  handleClick(event) {
    if (event.target === event.currentTarget) {
      this.selected.forEach((el) => {
        el.onDeselect();
      });
      this.selected = [];
    }
  }

  handleWindowMouseWheel(event) {
    const { scale } = this.transform;
    const value = event.deltaY * -0.0002 + scale;
    this.transform.scale = Math.min(Math.max(.2, value), 2);
    this.applyTransfrom();
  }

  handleWindowMouseDown(event) {
    const { clientX: x, clientY: y, which } = event;
    this.dragStart = { x, y };
    this.isRightMouse = which === 3;
  }

  handleWindowMouseUp() {
    this.dragStart = null;
    this.isRightMouse = null;
  }

  handleWindowMouseOut() {
    if (event.target === event.currentTarget) {
      this.dragStart = null;
      this.isRightMouse = null;
    }
  }

  handleWindowMouseMove(event) {
    if (this.dragStart) {
      const {
        scale,
        rotateX: prevRotateX,
        rotateZ: prevRotateZ,
      } = this.transform;
      const { x, y } = this.dragStart;
      const { clientX, clientY } = event;
      const deltaX = clientX - x;
      const deltaY = clientY - y;
      if (this.isRightMouse) {
        const rotateX = prevRotateX - deltaY * 0.3;
        const rotateZ = prevRotateZ - deltaX * 0.3;
        this.transform.rotateX = Math.min(Math.max(0, rotateX), 85);
        this.transform.rotateZ = rotateZ;
      } else {
        this.transform.x += deltaX / scale;
        this.transform.y += deltaY / scale;
      }
      this.applyTransfrom();
      this.dragStart = { x: clientX, y: clientY };
    }
  }

  handleWindowContextMenu(event) {
    event.preventDefault();
  }
}

class Card {
  constructor(data, game) {
    this.data = data;
    this.game = game;

    this.el = document.createElement("div");
    this.inner = document.createElement("div");
    this.el.className = "card";
    this.inner.className = "inner";
    const { x, y } = data.sprite;
    this.inner.style.backgroundPosition = `-${x}px -${y}px`;
    this.el.appendChild(this.inner);

    this.handleClick = this.handleClick.bind(this);

    this.el.addEventListener("click", this.handleClick);
  }

  move(x = 0, y = 0, z = 0) {
    this.el.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`
  }

  onSelect() {
    this.el.classList.add("selected");
  }

  onDeselect() {
    this.el.classList.remove("selected");
  }

  handleClick(event) {
    this.game.select(this);
  }
}

init();
