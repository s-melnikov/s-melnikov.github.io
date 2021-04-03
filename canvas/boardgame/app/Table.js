const KEY_CODE_SPACE = "Space";

class Selection {
  constructor(table) {
    this.table = table;
    this.el = document.querySelector("#selection");
  }
}

class Table {
  constructor({ width, height }) {
    this.el = document.querySelector("#table");   
    this.container = document.querySelector("#container");   
    this.el.style.width = `${width}px`;
    this.el.style.height = `${height}px`;     
    this.width = width;
    this.height = height;
    this.items = [];
    this.grabbed = [];  
    this.keys = {};
    this.selection = new Selection(this);

    const { innerWidth, innerHeight } = window;
    const scaleX = innerWidth / width * 0.96;
    const scaleY = innerHeight / height * 0.96;
    const scale = Math.min(scaleX, scaleY);
    this.scale = scale;
    this.x = -1 * this.width / 2;
    this.y = -1 * this.height / 2;
    this.setTransform();

    window.addEventListener("mousewheel", (event) => this.handleMouseWheel(event));
    window.addEventListener("keydown", (event) => this.handleKeyDown(event));
    window.addEventListener("keyup", (event) => this.handleKeyUp(event));
    window.addEventListener("mousemove", (event) => this.handleMouseMove(event));
    window.addEventListener("mousedown", (event) => this.handleMouseDown(event));
    // window.addEventListener("mouseup", (event) => this.handleMouseUp(event));
  }

  setTransform() {
    this.container.style.transform = `scale(${this.scale})`;
    this.el.style.transform = `translate(${this.x}px, ${this.y}px)`;
  }

  handleMouseWheel({ deltaY }) {
    this.scale = this.scale - deltaY / 1000 * this.scale;
    this.setTransform();
  }

  handleKeyDown(event) {
    const { code } = event;
    this.keys[code] = true;
    if (code === KEY_CODE_SPACE) {
      this.el.style.cursor = "grabbing";
    }
  }

  handleKeyUp({ code }) {
    this.keys[code] = false;
    if (code === KEY_CODE_SPACE) {
      this.el.style.cursor = "";
    }
  }

  handleMouseDown(event) {
    // this.storeCursor(event);
    // let parent = event.target;
    // while (parent) {
    //   if (parent.__instance__) {
    //     this.grabbed = [parent.__instance__];
    //     this.el.appendChild(parent);
    //     return;
    //   };
    //   parent = parent.parentNode;
    // }
    // this.selection.style.display = "block";
    // this.selection.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    // this.selection.data = { x, y, width: 0, height: 0 };
  }

  handleMouseUp() {
    // this.prevCursor = null;
    // if (this.grabbed.length)  {
    //   this.grabbed = [];
    // } else {
    //   // this.selection.style.display = "none";
    //   // this.selection.style.width = "";
    //   // this.selection.style.height = "";      
    // }
  }

  handleMouseMove(event) {
    const { clientX: x, clientY: y } = event;
    if (this.cursorPosition) {
      const { x: prevX, y: prevY } = this.cursorPosition;
      const deltaX = prevX - x;
      const deltaY = prevY - y;
      if (this.keys[KEY_CODE_SPACE]) {
        this.x = this.x - deltaX / this.scale;
        this.y = this.y - deltaY / this.scale;
        this.setTransform();
      }
    }
    
    // if (!this.prevCursor) return;
    // const { offsetWidth, offsetHeight } = this.el;
    // if (this.grabbed.length) {
    //   this.grabbed.forEach((item) => {
    //     const nextX = item.x - deltaX;
    //     const nextY = item.y - deltaY;
    //     const maxX = offsetWidth - item.width;
    //     const maxY = offsetHeight - item.height;
    //     item.moveTo(
    //       Math.min(Math.max(0, nextX), maxX),
    //       Math.min(Math.max(0, nextY), maxY),
    //     );   
    //   }); 
    // } else {
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
    // }
    this.cursorPosition = { x, y }; 
  }

  addItem(item) {
    this.items.push(item);
    this.el.appendChild(item.el);
  } 
}

export default Table;