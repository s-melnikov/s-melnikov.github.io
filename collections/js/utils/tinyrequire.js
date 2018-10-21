(exports => {
  let modules = [],
    pending = [],
    loaded = []
  let define = (name, dependencies, module) => {
    if (!dependencies || !dependencies.length) {
      loaded.push(name);
      modules[name] = {
        name,
        callback: module,
        module: module(),
        loaded: true,
        dependencies: []
      };
    } else {
      modules[name] = {
        name,
        callback: module,
        loaded: false,
        dependencies
      };
    }
    unroll();
    if (require.onModule) {
      require.onModule(modules[name]);
    }
    return modules[name];
  }
  let require = (dependencies, callback) => {
    if (require.vendors) {
      let i = 0;
      for (let module in require.vendors) {
        i++;
        require.loadScript(require.vendors[module], () => {
          define(module, null, () => exports[module]);
          if (!--i) return require(dependencies, callback);
        })
      }
      return require.vendors = null;
    }
    let module = {
      callback: callback,
      dependencies: dependencies
    };
    modules.push(module);
    if (require.onModule) {
      require.onModule(module);
    }
    unroll();
    return module;
  }
  let unroll = () => {
    Object.keys(modules).map(name => modules[name]).concat(modules)
      .map(module => {
        if (!module.loaded &&
          module.dependencies.every(depn => loaded.indexOf(depn) !== -1)) {
          loaded.push(module.name);
          module.loaded = true;
          module.module = module.callback.apply(null,
            module.dependencies.map(depn => modules[depn].module))
          unroll();
        }
      });
  };
  require.loadScript = (src, callback) => {
    let script = document.createElement("script");
    script.onload = callback;
    document.head.appendChild(script);
    script.src = src;
  }
  document.addEventListener("DOMContentLoaded", () => {
    for (let script of document.querySelectorAll("script[data-main]")) {
      if (script.src.match(/tinyrequire/)) {
        let main = script.getAttribute("data-main"),
          path = main.split("/"),
          basename = path.pop(),
          root = path.join("/");
        require.loadScript(main + ".js");
        require.onModule = module => module.dependencies.map(dependency => {
          if (pending.indexOf(dependency) == -1 && !modules[dependency]) {
            require.loadScript(root + "/" + dependency + ".js", () => {
              pending.splice(pending.indexOf(dependency), 1);
            });
            pending.push(dependency);
          }
        })
      }
    }
  })
  require.modules = modules;
  exports.require = require;
  exports.define = define;
})(window);