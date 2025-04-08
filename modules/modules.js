((global) => {
  const MODULES = {};
  const BASE = document.querySelector("script[base]")?.getAttribute("base") || "/";
  global.require = async(moduleNames, func) => {
    const scriptName = document.currentScript.dataset.name;
    try {
      const loaded = await Promise.all(moduleNames.map((moduleName) => {
        return new Promise((resolve, reject) => {
          const moduleData = MODULES[moduleName];
          if (moduleData) {
            if (moduleData.pending) {
              moduleData.resolvers.push({ moduleName, resolve });
            } else {
              resolve(MODULES[moduleName].value);
            }
          } else {
            MODULES[moduleName] = { pending: true, resolvers: [{ moduleName, resolve }] };
            const script = document.createElement("script");
            script.dataset.name = moduleName;
            script.src = `${BASE}${moduleName}.js`;
            document.head.append(script);
          }
        });
      }));
      if (scriptName) {
        const moduleData = MODULES[scriptName];
        if (moduleData) {
          moduleData.pending = false;
          moduleData.value = typeof func === "function" ? func(...loaded) : func;
          moduleData.resolvers.forEach(({ resolve }) => resolve(moduleData.value));
          moduleData.resolvers = [];
        }
      } else {
        func(...loaded);
      }
    } catch (e) {
      console.log(e);
    }
  }
  global.define = global.require.bind(this, []);
})(this);
