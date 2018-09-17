(exports => {
const modules = [];
const pending = [];
const loaded = [];
const define = (name, dependencies, module) => {
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
const require = (dependencies, callback) => {
  const module = {
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
          module.dependencies.map(depn => modules[depn].module));
        unroll();
      }
    });
};
require.loadScript = (src, callback) => {
  const script = document.createElement("script");
  script.onload = callback;
  document.head.appendChild(script);
  script.src = src;
}
document.addEventListener("DOMContentLoaded", () => {
  for (let script of document.querySelectorAll("script[data-main]")) {
    if (script.src.match(/tinyrequire/)) {
      let main = script.getAttribute("data-main");
      let path = main.split("/");
      let basename = path.pop();
      let root = path.join("/");
      require.loadScript(main);
      require.onModule = module => module.dependencies.map(dependency => {
        if (pending.indexOf(dependency) == -1 && !modules[dependency]) {
          require.loadScript(root + "/" + dependency + ".js", () =>
            pending.splice(pending.indexOf(dependency), 1));
          pending.push(dependency);
        }
      });
    }
  }
});
require.modules = modules;
exports.require = require;
exports.define = define;
})(window)