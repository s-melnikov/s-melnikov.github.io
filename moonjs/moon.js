/**
 * Moon v1.0.0-beta.2
 * Copyright 2016-2018 Kabir Shah
 * Released under the MIT License
 * https://kbrsh.github.io/moon
 */
(function(root, factory) {
  if (typeof module === "undefined") {
    root.Moon = factory();
  } else {
    module.exports = factory();
  }
}(this, function() {

  const config = {
    silent: false
  };

  const error = message => {
    if (!config.silent) console.error("[Moon] ERROR: " + message);
  };

  class MoonComponent {
    constructor(name, options) {
      console.log(this)
      // var this$1 = this;

      // // Properties
      // this._name = name;
      // this._queued = false;

      // // Options
      // var data;
      // if (options === undefined) {
      //   data = {};
      // } else if (typeof options === "function") {
      //   data = options();
      // } else {
      //   data = options;
      // }

      // // View
      // if (typeof data.view === "string") {
      //   this._view = new Function("m", "instance", "locals", compile(data.view))(m, this, {});
      // } else {
      //   this._view = data.view(m, this, {});
      // }

      // delete data.view;

      // // Events
      // var events = {};

      // if (data.onCreate !== undefined) {
      //   events.create = data.onCreate.bind(this);
      //   delete data.onCreate;
      // }

      // if (data.onUpdate !== undefined) {
      //   events.update = data.onUpdate.bind(this);
      //   delete data.onUpdate;
      // }

      // if (data.onDestroy !== undefined) {
      //   events.destroy = data.onDestroy.bind(this);
      //   delete data.onDestroy;
      // }

      // this._events = events;

      // // Data
      // for (var key in data) {
      //   var value = data[key];
      //   if (typeof value === "function") {
      //     this$1[key] = value.bind(this$1);
      //   } else {
      //     this$1[key] = value;
      //   }
      // }

      // // Methods
      // this.create = create;
      // this.update = update;
      // this.destroy = destroy;
      // this.on = on;
      // this.off = off;
      // this.emit = emit;
    }
  };

  const component = (name, options) => () => new MoonComponent(name, options);

  function Moon(options) {
    let root = options.root;
    delete options.root;
    if (typeof root === "string") {
      root = document.querySelector(root);
    }
    let createInstance = component("", options);
    let instance = createInstance();
    // instance.create(root);
    // instance.update();
    // return instance;
  }

  return Moon;
}));