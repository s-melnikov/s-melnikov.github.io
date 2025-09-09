class Sprite {
  children = [];

  static CSSVAR_IMAGE_SCALE = '--scale';
  static CSSVAR_IMAGE_TRANSLATE_X = '--translate-x';
  static CSSVAR_IMAGE_TRANSLATE_Y = '--translate-y';

  constructor(params) {
    const {
      width = 0,
      height = 0,
      scale = 1,
      x = 0,
      y = 0,
      image = {},
      el = createElement('div', 'sprite'),
      align = ['center', 'center'],
      name,
      slots,
      borderRadius
    } = params;

    this.name = name;
    this.slots = slots;
    this.el = el;
    this.width = width;
    this.height = height;
    this.scale = scale;
    this.align = align;
    this.x = x;
    this.y = y;
    this.el.style.width = `${width}px`;
    this.el.style.height = `${height}px`;
    if (image.src) {
      this.el.style.background = `url(./images/${image.src})`;
    }

    if (borderRadius) {
      this.el.style.borderRadius = borderRadius + 'px';
    }
    this.el.style.transform =
      `translate(var(${Sprite.CSSVAR_IMAGE_TRANSLATE_X}, 0px), var(${Sprite.CSSVAR_IMAGE_TRANSLATE_Y}, 0px)) scale(var(${Sprite.CSSVAR_IMAGE_SCALE}, 1))`;
  }

  get scale() {
    return this.__scale__;
  }

  set scale(scale) {
    this.__scale__ = scale;
    this.el.style.setProperty(Sprite.CSSVAR_IMAGE_SCALE, scale.toString());
  }

  get x() {
    return this.__x__;
  }

  set x(x) {
    const [align] = this.align;
    switch (align) {
      case 'center':
        this.__x__ = x - round(this.width / 2);
        break;
      case 'right':
        this.__x__ = x - this.width;
        break;
      default:
        this.__x__ = x;
        break;
    }
    this.el.style.setProperty(Sprite.CSSVAR_IMAGE_TRANSLATE_X, `${this.__x__}px`);
  }

  get y() {
    return this.__y__;
  }

  set y(y) {
    const [, align] = this.align;
    switch (align) {
      case 'center':
        this.__y__ = y - round(this.height / 2);
        break;
      case 'bottom':
        this.__y__ = y - this.height;
        break;
      default:
        this.__y__ = y;
        break;
    }
    this.el.style.setProperty(Sprite.CSSVAR_IMAGE_TRANSLATE_Y, `${this.__y__}px`);
  }

  add(child, slotId) {
    const foundSlot = slotId && this.slots?.find(({ id }) => id === slotId);
    (Array.isArray(child) ? child : [child]).forEach((c, i) => {
      if (foundSlot) {
        c.x = foundSlot.x + i * (c.width + (foundSlot.margin || 0));
        c.y = foundSlot.y;
      }
      this.children.push(c);
      this.el.appendChild(c.el);
    });
  }
}

class Table extends Sprite {
  static MOVE_TO_KEYWORDS_X = ['left', 'right', 'center'];
  static MOVE_TO_KEYWORDS_Y = ['top', 'bottom', 'center'];
  static MARGIN = 32;
  
  _cache = {
    sizesDiff: null,
    containerCenter: null,
    lastUpdate: 0
  };
  
  constructor(params) {
    const { width, height } = params;
    const container = document.querySelector('#container');
    const { clientWidth: containerWidth, clientHeight: containerHeight } = container;
    const scaleX = (containerWidth - Table.MARGIN) / width;
    const scaleY = (containerHeight - Table.MARGIN) / height
    const minScale = round(Math.min(scaleX, scaleY), 5);
    const gameId = location.hash;
    const state = ls(gameId + '.table');
    const { x, y, scale } = state || {
      x: (containerWidth - width) / 2,
      y: (containerHeight - height) / 2,
      scale: minScale,
    };
    super({
      ...params,
      x,
      y,
      scale,
      el: document.querySelector('#table'),
      align: ['top', 'left']
    });
    this.gameId = gameId;
    this.minScale = minScale;
    this.maxScale = 1;
    this.container = container;
    this.controller = new AbortController();
    this.dragData = { prevX: 0, prevY: 0 };
    this.states = {};
    const { signal } = this.controller;

    window.addEventListener('wheel', (e) => this.handleWindowWheel(e), { signal });
    window.addEventListener('mousedown', (e) => this.handleWindowMouseDown(e), { signal });
    window.addEventListener('mousemove', (e) => this.handleWindowMouseMove(e), { signal });
    window.addEventListener('mouseup', (e) => this.handleWindowMouseUp(e), { signal });
    window.addEventListener('beforeunload', () => {
      ls(this.gameId + '.table', { x: this.x, y: this.y, scale: this.scale });
    });
  }

  getSizesDiff() {
    return {
      width: -Infinity,
      height: -Infinity,
    };
    /*
    const { scale } = this;
    const { clientWidth: containerWidth, clientHeight: containerHeight } = this.container;
    const { width, height } = this.el.getBoundingClientRect();
    return {
      width: (containerWidth - width) / 2,
      height: (containerHeight - height) / 2
    };
    */
  }

  getContainerCenterClient() {
    const now = Date.now();
    
    if (this._cache.containerCenter && (now - this._cache.lastUpdate) < 100) {
      return this._cache.containerCenter;
    }
    
    const { container } = this;
    const { top, left, width, height } = container.getBoundingClientRect();
    
    this._cache.containerCenter = {
      clientX: left + width / 2,
      clientY: top + height / 2
    };
    this._cache.lastUpdate = now;
    
    return this._cache.containerCenter;
  }

  moveTo({ x, y }) {
    const { width: widthDiff, height: heightDiff } = this.getSizesDiff();
    if (isNaN(x)) {
      if (Table.MOVE_TO_KEYWORDS_X.some((item) => item === x)) {
        const keywordsValue = {
          left: -widthDiff,
          right: widthDiff,
          center: 0
        };
        this.x = keywordsValue[x];
      }
    } else {
      this.x = minmax(x, widthDiff, -widthDiff);
    }
    if (isNaN(y)) {
      if (Table.MOVE_TO_KEYWORDS_Y.some((item) => item === y)) {
        const keywordsValue = {
          top: -heightDiff,
          bottom: heightDiff,
          center: 0
        }
        this.y = keywordsValue[y];
      }
    } else {
      this.y = minmax(y, heightDiff, -heightDiff);
    }
  }

  zoomTo(ratio, pointer = true) {
    const {
      minScale,
      maxScale,
      image,
      scale,
      x: oldX,
      y: oldY
    } = this;
    ratio = minmax(ratio, minScale, maxScale);
    if (ratio === scale) return;
    this.scale = ratio;
    if (!pointer) return;
    const { clientX, clientY } = (typeof pointer === 'boolean' ? this.getContainerCenterClient() : pointer);
    const { top: imageTop, left: imageLeft, width: imageWidth, height: imageHeight } = this.el.getBoundingClientRect();
    const { width: widthDiff, height: heightDiff } = this.getSizesDiff();
    const scaleDiff = ratio / scale - 1;
    const distanceX = (imageWidth / 2 - clientX + imageLeft) * scaleDiff + oldX;
    const distanceY = (imageHeight / 2 - clientY + imageTop) * scaleDiff + oldY;
    this.x = minmax(distanceX, widthDiff, -widthDiff);
    this.y = minmax(distanceY, heightDiff, -heightDiff);
  }

  zoom(ratio, pointer) {
    const { scale: oldScale, minScale, maxScale } = this;

    const scale = minmax(round(oldScale * (ratio + 1)), minScale, maxScale);

    if (oldScale === scale) return;

    this.zoomTo(scale, pointer);
  }

  handleWindowMouseDown(event) {
    const { dragData } = this;

    if (event && event.button !== 0) return;

    event.preventDefault();

    if (dragData.frame) cancelAnimationFrame(dragData.frame);
    const { clientX, clientY } = getPointer(event);

    this.dragData = {
      ...dragData,
      prevX: clientX,
      prevY: clientY,
      frame: null
    }

    this.states.dragging = true;
  }

  handleWindowMouseMove(event) {
    if (!this.states.dragging) return;
    
    // Дебаунсинг для улучшения производительности
    if (this.dragData.frame) {
      cancelAnimationFrame(this.dragData.frame);
    }
    
    this.dragData.frame = requestAnimationFrame(() => {
      const { dragData, x, y } = this;
      event.preventDefault();

    const { clientX, clientY } = getPointer(event);

    const deltaX = clientX - dragData.prevX;
    const deltaY = clientY - dragData.prevY;
    const translateX = x + deltaX;
    const translateY = y + deltaY;

    this.moveTo({ x: translateX, y: translateY });

      this.dragData = {
        ...dragData,
        prevX: clientX,
        prevY: clientY,
        frame: null
      };
    });
  }

  handleWindowMouseUp() {
    if (!this.states.dragging) return;
    this.states.dragging = false;
  }

  handleWindowWheel(event) {
    const { clientX, clientY, deltaY, zoomRatio = 0.1 } = event;

    const delta = deltaY > 0 ? -1 : 1;

    if (this.states.wheeling) return;

    this.states.wheeling = true;

    setTimeout(() => {
      this.states.wheeling = false;
    }, 30);

    this.zoom(delta * zoomRatio, { clientX, clientY })
  }
}

class Assets {
  assets = [];

  constructor(assets) {
    const lists = assets.filter((item) => item.range);

    this.assets = [
      ...assets.filter((item) => !item.range),
      ...lists.map((item) => {
        const { name, ext = 'png', range, ...rest } = item;
        const list = [];
        for (let i = range[0]; i < range[1]; i++) {
          list.push({
            name: `${name}${i}`,
            src: `${name}${i}.${ext}`,
            ...rest
          });
        }
        return [
          { name, list },
          ...list
        ];
      }).flat()
    ];
  }

  get(name, params = {}) {
    if (!name || typeof name !== 'string') {
      throw new Error('Asset name must be a non-empty string');
    }
    
    const found = this.assets.find((item) => item.name === name);

    if (!found) {
      throw new Error(`Asset "${name}" not found. Available assets: ${this.assets.map(a => a.name).join(', ')}`);
    }
    
    const { src, ...rest } = found;
    return new Sprite({
      image: { src },
      ...rest,
      ...params
    });
  }

  getList(name, params = {}) {
    if (!name || typeof name !== 'string') {
      throw new Error('Asset name must be a non-empty string');
    }
    
    const found = this.assets.find((item) => item.name === name);

    if (!found) {
      throw new Error(`Asset "${name}" not found. Available assets: ${this.assets.map(a => a.name).join(', ')}`);
    }
    
    if (!found.list) {
      throw new Error(`Asset "${name}" is not a list. Use get() method instead.`);
    }

    return found.list.map(({ src, ...rest }) => {
      return new Sprite({
        image: { src },
        ...rest,
        ...params
      });
    });
  }
}

function createElement(tagName = 'div', className, attributes, children) {
  const el = document.createElement(tagName);
  if (className) {
    el.classList.add(...className.split(' '));
  }
  if (attributes) {
    setAttributes(el, attributes);
  }
  if (children) {
    el.innerHTML = children;
  }
  return el;
}

function setAttributes(element, value) {
  for (const [k, v] of Object.entries(value)) {
    element.setAttribute(k, v);
  }
}

function round(value, precision = 2) {
  if (isNaN(value)) return 0;
  const delimeter = Math.pow(10, precision);
  return Math.round(value * delimeter) / delimeter;
}

function getPointer(event) {
  return { clientX: event.clientX, clientY: event.clientY };
}

function minmax(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function ls(key, data) {
  if (!key || typeof key !== 'string') {
    throw new Error('LocalStorage key must be a non-empty string');
  }
  
  if (data === null) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('Failed to remove from localStorage:', e);
      return false;
    }
  }
  
  let stored = null;
  try {
    const item = localStorage.getItem(key);
    if (item) {
      stored = JSON.parse(item);
    }
  } catch (e) {
    console.error('Failed to parse localStorage data:', e);
    stored = null;
  }
  
  if (data === undefined) {
    return stored;
  }
  
  try {
    const newData = { ...stored, ...data };
    localStorage.setItem(key, JSON.stringify(newData));
    return newData;
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
    return stored;
  }
}
