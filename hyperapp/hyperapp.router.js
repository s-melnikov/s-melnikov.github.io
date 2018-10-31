function Router(app) {
  return (state, actions, routes, container) => {
    let currentView = null;
    let hash = () => location.hash.slice(2);
    let preparedRoutes = Object.keys(routes).map(path => {
      let keys = [];
      let regex = RegExp(path === "*" ? ".*" :
        "^" + path.replace(/:([\w]+)/g, function(_, key) {
          keys.push(key.toLowerCase());
          return "([-\\.%\\w\\(\\)]+)";
        }) + "$");
      return { regex, keys, view: routes[path] };
    });
    actions.setRoute = path => {
      if (!path || path.type) {
        path = location.hash.slice(2) || "/";
      }
      let match, params = {};
      for (let i = 0; i < preparedRoutes.length; i++) {
        let { regex, keys, view } = preparedRoutes[i];
        if (match = regex.exec(path)) {
          keys.map((key, i) => params[key] = match[i + 1] || "");
          currentView = view;
          break;
        }
      }
      return { route: { path, params } }
    };
    state.route = actions.setRoute().route;
    let resolve = (state, actions) => (currentView || (() => {}))(state, actions);
    let main = app(state, actions, resolve, container);
    window.addEventListener("hashchange", main.setRoute);
    return main;
  }
}