function mitt(handlers) {
  handlers = handlers || {}
  function list(type) {
    type = type.toLowerCase()
    return handlers[type] || (handlers[type] = [])
  }
  return {
    on(type, handler) {
      list(type).push(handler)
    },
    off(type, handler) {
      if (!handler) {
        type == '*' ? (handlers = {}) : (handlers[type] = [])
      } else {
        let e = list(type),
          i = e.indexOf(handler)
        if (~i) e.splice(i, 1)
      }
    },
    emit(type, event) {
      list('*').concat(list(type)).forEach(handler => { handler(event) })
    }
  }
}
class Emitter {
  constructor() {
    this.events = {};
  }
  on(event, cb) {
    let list = this.events[event] || (this.events[event] = []);
    list.push(cb);
    return () => list.splice(list.indexOf(cb) >>> 0, 1);
  }
  emit(event, ...args) {
    let list = this.events[event];
    if (!list || !list[0]) return;
    list.map(cb => cb(...args));
  }
}

let e = new Emitter();
let off1 = e.on('e1', (a, b) => console.log('Event 1', a, b));
let off2 = e.on('e1', (a, b) => console.log('Event 1 (2)', a, b));
let off3 = e.on('e2', (a, b) => console.log('Event 2', a, b));
e.emit('e1');
e.emit('e1', 5, 10);
e.emit('e2', 5, 10);
console.log('off1');
off1();
e.emit('e1');
e.emit('e1', 5, 10);
e.emit('e2', 5, 10);
console.log('off2');
off2();
e.emit('e1');
e.emit('e1', 5, 10);
e.emit('e2', 5, 10);
console.log('off3');
off3();
e.emit('e1');
e.emit('e1', 5, 10);
e.emit('e2', 5, 10);
