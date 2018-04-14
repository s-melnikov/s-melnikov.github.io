let { h, app } = hyperapp;

let state = {};

let actions = {};

let routes = {
  "/": IndexView,
  "/second": SecondView,
  "/third": ThirdView,
};

Router(app)(state, actions, routes, document.body);

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
      console.log(path)
      let match, params = {};
      preparedRoutes.map(({ regex, keys, view }) => {
        if (match = regex.exec(path)) {
          keys.map((key, i) => params[key] = (match[i + 1] || "").toLowerCase());
          currentView = view;         
        }
      });
      return { route: { path, params } }
    }; 
    state.route = actions.setRoute().route;
    let main = app(state, actions, (state, actions) => currentView(state, actions), container);
    window.addEventListener("hashchange", main.setRoute);
    return main;
  }
};

function IndexView(state, actions) {
  return h("div", null, "Index",
    h("p", null, 
      h("a", { href: "#" }, "index"),
      h("br"),
      h("a", { href: "#!/second" }, "second"),
      h("br"),
      h("a", { href: "#!/third" }, "tihrd"),
    )
  );
}

function SecondView(state, actions) {
  return h("div", null, "Second",
    h("p", null, 
      h("a", { href: "#" }, "index"),
      h("br"),
      h("a", { href: "#!/second" }, "second"),
      h("br"),
      h("a", { href: "#!/third" }, "tihrd"),
    )
  );
}

function ThirdView(state, actions) {
  return h("div", null, "Third",
    h("p", null, 
      h("a", { href: "#" }, "index"),
      h("br"),
      h("a", { href: "#!/second" }, "second"),
      h("br"),
      h("a", { href: "#!/third" }, "tihrd"),
    )
  );
}

// if (localStorage.hypercrm) {
//   fetch("")
// }