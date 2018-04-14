let { h, app } = hyperapp;
let db = database("hypercrm");

let state = {};

let actions = {};

let routes = {
  "*": NotFoundView,
  "/": IndexView,
  "/companies": CompaniesView,
  "/employers": EmployersView
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
  setTimeout(() => location.hash = "#!/companies", 0);
  return null;
}

function CompaniesView(state, actions) {
  return h("div", null, "Companies");
}

function EmployersView(state, actions) {
  return h("div", null, "Employers");
}

function NotFoundView(state, actions) {
  return h("div", null, "404! Page not found");
}

if (!localStorage.hypercrm) {
  fetch("dump.json").then(resp => resp.json()).then(data => {
    Object.keys(data)
  });
}