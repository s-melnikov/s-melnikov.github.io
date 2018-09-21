/**
 * Moon v1.0.1
 */
(((root, factory) => {
  (typeof module === "undefined") ? (root.App = factory()) : (module.exports = factory())
})(this, () => {

  class MoonComponent {
    constructor(name, options) {
      let self = this;
      this.$$name = name;
      this.$$events = {};
      let data;
      if (!options) {
        data = {};
      } else if (typeof options === "function") {
        data = options();
      } else {
        data = options;
      }
      if (typeof data.view === "string") {
        // this.$$view = new Function("m", "instance", "locals", compile(data.view))(m, this, {});
      } else {
        // this.$$view = data.view(m, this, {});
      }
      if (data.onCreate) {
        this.$$events.create = data.onCreate.bind(this);
        delete data.onCreate;
      }
      if (data.onUpdate) {
        this.$$events.update = data.onUpdate.bind(this);
        delete data.onUpdate;
      }
      if (data.onDestroy) {
        this.$$events.destroy = data.onDestroy.bind(this);
        delete data.onDestroy;
      }
      for (let key in data) {
        let value = data[key];
        if (typeof value === "function") {
          self[key] = value.bind(this$1);
        } else {
          self[key] = value;
        }
      }
    }
    create (root) {
    }
    update(key, value) {
    }
    destroy() {
    }
    on(type, handler) {
      if (!this.$$events[type]) {
        this.$$events[type] = [];
      }
      this.$$events[type].push(handler);
    }
    off(type, handler) {
      if (!type) {
        this.$$events = {};
      } else if (!handler) {
        this.$$events[type] = [];
      } else {
        let handlers = this.$$events[type];
        handlers.splice(handlers.indexOf(handler), 1);
      }
    }
    emit(type, data) {
      let handlers = this.$$events[type];
      if (handlers) {
        if (typeof handlers === "function") {
          handlers(data);
        } else {
          for (let i = 0; i < handlers.length; i++) {
            handlers[i](data);
          }
        }
      }
    }
  }

  return function App(options) {
    let root = options.root;
    delete options.root;
    if (typeof root === "string") {
      root = document.querySelector(root);
    }
    let instance = component("", options)();
    console.log(instance);
    // instance.create(root);
    // instance.update();
    // return instance;
  };

  function component(name, options) {
    return () => new Component(name, options);
  }


}));
