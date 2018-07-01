const log = console.log.bind(console);

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

const installDemoData = () => {
  const db = database("simplecrm");
  const rand = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));
  const randArrVal = array => array[rand(0, array.length - 1)];
  const slugify = str => str.toLowerCase().replace(/\s/g, "_");
  db.drop();
  Promise
    .all([
      "assets/json/colors.json",
      "assets/json/account_types.json",
      "assets/json/account_sectors.json",
      "assets/json/account_sources.json",
      "assets/json/accounts.json",
      "assets/json/contacts.json",
    ].map(src => fetch(src)))
    .then(responses => Promise.all(responses.map(r => r.json())))
    .then(responses => {
      let [
        colors,
        account_types,
        account_sectors,
        account_sources,
        accounts,
        contacts,
      ] = responses;
      account_types = account_types.map(item => ({
        name: slugify(item),
        title: item
      }));
      account_sources = account_sources.map(item => ({
        name: slugify(item),
        title: item
      }));
      account_sectors = account_sectors.map(item => ({
        name: slugify(item),
        title: item
      }));
      accounts = accounts.map(item => ({
        type: randArrVal(account_types).name,
        source: randArrVal(account_sources).name,
        sector: randArrVal(account_sectors).name,
        created: Date.now(),
        updated: null,
        ...item
      }));
      db.collection("colors").pushMany(colors);
      db.collection("account_sectors").pushMany(account_sectors);
      db.collection("account_types").pushMany(account_types);
      db.collection("account_sources").pushMany(account_sources);
      accounts = db.collection("accounts").pushMany(accounts);
      contacts = contacts.map(item => ({
        account: randArrVal(accounts).uid,
        created: Date.now(),
        updated: null,
        ...item
      }));
      db.collection("contacts").pushMany(contacts);
    });
}

// define("utils", ["libs/database"], (database) => {
//   const db = database("simplecrm");

//   const getCurrentPath = () => location.hash.replace(/^#!|\/$/g, "") || "/";


//   return {
//     getCurrentPath,
//     db
//   };
// });