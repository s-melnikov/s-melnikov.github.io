let { h, app } = hyperapp;

let state = {};

let actions = {};

let routes = {
  "/": IndexView
};

Router(app)(state, actions, routes, document.body);

function Router(app) {
  return (state, actions, routes, container) => {
    let router = createRouter(routes);
    state.route = location.hash;
    actions.setRoute = route => ({ route });
    function view(state, actions) {
      return h("main", null, router(state, actions));
    }
    let main = app(state, actions, view, container);
    window.addEventListener("hashchange", () => main.setRoute(location.hash));
    return main;
  }
  function createRouter(routes) {
    routes = Object.keys(routes).map(path => {
      let keys = [];
      let regex = RegExp(path === "*" ? ".*" :
        "^" + path.replace(/:([\w]+)/g, function(_, key) {
          keys.push(key.toLowerCase());
          return "([-\\.%\\w\\(\\)]+)";
        }) + "$");
      return { regex, keys, component: routes[path] };
    })
    return (state, actions) => {
      return routes.map(({ regex, keys, component }) => {
        let route = state.route || "/"
        let match, params = {}
        if (match = regex.exec(route)) {
          keys.map((key, i) => params[key] = (match[i + 1] || "").toLowerCase())
          return component(state, actions, params)
        }
        return null
      })
    }
  }
};

function IndexView(state, actions, params) {
  console.log(params)
  return h("div", null, "Index");
}

// if (localStorage.hypercrm) {
//   fetch("")
// }