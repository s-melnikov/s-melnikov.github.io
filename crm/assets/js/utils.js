function Logger(app) {
  return (state, actions, view, container) => {
    actions = enhance(actions);
    return app(state, actions, view, container);
  }
  function log(prevState, action, nextState) {
    console.groupCollapsed("%c action", "color: gray", action.name);
    console.log("%c prev state", "color:#9E9E9E", prevState);
    console.log("%c data", "color: #03A9F4", action.data);
    console.log("%c next state", "color:#4CAF50", nextState);
    console.groupEnd();
  }
  function enhance(actions, prefix) {
    let namespace = prefix ? prefix + "." : ""
    return Object.keys(actions || {}).reduce((otherActions, name) => {
      let namedspacedName = namespace + name, action = actions[name];
      otherActions[name] = typeof action === "function" ? data => (state, actions) => {
        let result = action(data);
        result = typeof result === "function" ? result(state, actions) : result;
        log(state,{ name: namedspacedName, data: data }, result);
        return result;
      } : enhance(action, namedspacedName);
      return otherActions;
    }, {});
  }
}

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
    let main = app(state, actions, (state, actions) => currentView(state, actions), container);
    window.addEventListener("hashchange", main.setRoute);
    return main;
  }
}

const Link = () => {

}

// define("utils", ["libs/database"], (database) => {
//   const db = database("simplecrm");

//   const getCurrentPath = () => location.hash.replace(/^#!|\/$/g, "") || "/";

//   window.mock = () => {
//     const rand = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));
//     const randArrVal = array => array[rand(0, array.length - 1)];
//     const statuses = ["new", "assigned", "converted", "in_process", "recycled", "closed"];
//     const leadsRef = db.collection("leads");
//     db.drop();
//     fetch("assets/json/leads.json").then(resp => resp.json()).then(items => {
//       let leads = db.collection("leads");
//       items = items.map(item => {
//         item.status = randArrVal(statuses);
//         return item;
//       });
//       leads.pushMany(items, () => {
//         console.log("Leads ready")
//       });
//     });
//   }

//   return {
//     getCurrentPath,
//     db
//   };
// });