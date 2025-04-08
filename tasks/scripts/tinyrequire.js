(exports => {
  const modules = [];
  const pending = [];
  const loaded = [];
  const define = (name, dependencies, module) => {
    if (!dependencies.length) {
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
  const require = (dependencies, callback) => {
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
  };
  const unroll = () => {
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
  const loadScript = (src, callback) => {
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
        loadScript(main + ".js");
        require.onModule = module => module.dependencies.map(dependency => {
          if (pending.indexOf(dependency) == -1 && !modules[dependency]) {
            loadScript(root + "/" + dependency + ".js", () => {
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
