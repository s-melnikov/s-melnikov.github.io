


/*


const State = {
  loader: false
};

const Actions = {
  setLoader: show => (state, actions) => {
    console.log(state, actions)
  }
};

const Router = (app, routes) => {
  const createRouter = routes => {
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
  const enhance = actions => {
    actions.setRoute = route => ({ route });
    return actions;
  }
  return (state, actions, view, container) => {
    let router = createRouter(routes);
    actions = enhance(actions);
    view = view(router);
    return app(state, actions, view, container)
  }
};

const Logger = app => {
  let start = new Date();
  const log = (prevState, action, nextState) => {
    let time = Date.now() - start,
      min = Math.floor(time / 1000 / 60).toString().padStart(2, 0),
      sec = Math.floor((time - min * 1000 * 60) / 1000).toString().padStart(2, 0),
      msec = (time - min * 1000 * 60 - sec * 1000).toString().padStart(3, 0);
    console.groupCollapsed("%c action", "color: gray", action.name);
    console.log("%c Time:", "color: yellow", min + ":" + sec + ":" + msec);
    console.log("%c prev state", "color:#9E9E9E", prevState);
    console.log("%c data", "color: #03A9F4", action.data);
    console.log("%c next state", "color:#4CAF50", nextState);
    console.groupEnd();
  }
  const enhance = (actions, prefix) => {
    let namespace = prefix ? prefix + "." : ""
    return Object.keys(actions || {}).reduce((otherActions, name) => {
      let namedspacedName = namespace + name, action = actions[name]
      otherActions[name] = typeof action === "function" ? data => (state, actions) => {
        let result = action(data)
        result = typeof result === "function" ? result(state, actions) : result
        log(state,{ name: namedspacedName, data: data }, result)
        return result
      } : enhance(action, namedspacedName)
      return otherActions
    }, {});
  }
  return (state, actions, view, container) => {
    actions = enhance(actions)
    return app(state, actions, view, container)
  }
};

const capitalize = str => str[0].toUpperCase() + str.slice(1);

const ItemsList = (state, actions) => h("div", null,
  h("ul", null,
    [].map(item => h("li", null, item))
  )
);

const Loader = () => h("div", { class: "overlay" },
  h("div", { class: "loader" },
    h("span")
  )
);

const Header = (state, actions) => h("header", null,
  h("div", { "class": "container" },
    newsTypes.map(type => h("a", {
        href: "#/" + type,
        "class": ""
      }, capitalize(type))
    )
  )
);

const View = router => (state, actions) => h("div", null,
  router(state, actions),
  h(Header),
  false && Loader()
);

const routes = {
  "/": ItemsList
};

const main = Router(Logger(app), routes)(State, Actions, View, document.querySelector("#root"));

/*
const Actions = {
  loader: (state, actions, show) => ({ loader: show }),
  ids: (state, actions, ids) => {
    fetchItems(ids, actions.items)
  },
  items: (state, actions, items) => {
    items.sort((a, b) => {
      a = state.seen.indexOf(a.id) > -1
      b = state.seen.indexOf(b.id) > -1
      if (a > b) return 1
      if (a < b) return -1
      return 0
    })
    return { loader: false, items }
  },
  seen: (state, actions, id) => {
    let seen = JSON.parse(localStorage.hyperapphn || "[]")
    seen.push(id)
    if (seen.length > 100000) seen.shift()
    try {
      localStorage.hyperapphn = JSON.stringify(seen)
    } catch(e) {
      seen = seen.splice(0, 1000)
      localStorage.hyperapphn = JSON.stringify(seen)
    }
    return { seen }
  }
};
function ItemsListView(state, actions) {
  return h("div", {
      class: "items-list",
      key: "list-" + state.route[0],
      oncreate() {
        actions.loader(true)
        switch (state.route[0]) {
          case "user":
            break
          case "item":
            break
          default:
            subscription = db.child(state.route[0] + "stories")
            subscription.once("value", snapshot => {
              actions.ids(snapshot.val())
            })
        }
      },
      onremove() {
        if (subscription) {
          subscription.off()
          subscription = null
        }
      }
    },
    state.items.map(item => ItemView(state, actions, item))
  )
}
*/
/*
const now = Date.now()
const pp = 30
const ttl = 1000 * 60 * 15
const types = ["top", "new", "best", "show", "ask", "job"]
let db = firebase.database().ref("/v0")
let cached = {}
let subscription
const parser = document.createElement("a")
const domain = url => (parser.href = url) && parser.hostname
const fromNow = (time, between) => {
  between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return ~~(between / 60) + " minutes"
  } else if (between < 86400) {
    return ~~(between / 3600) + " hours"
  } else {
    return ~~(between / 86400) + " days"
  }
}
const fetchItem = (id, callback) => {
  let item = cached[id]
  if (item && item._timestamp + ttl > Date.now()) {
    callback(item)
  } else {
    db.child("item/" + id).once("value", snapshot => {
      let item = snapshot.val()
      if (item) {
        item._timestamp = Date.now()
        cached[item.id] = item
      }
      callback(item)
    })
  }
}
const fetchItems = (ids, callback) => {
  let items = [],
    handler = item => {
      items.push(item)
      if (items.length == ids.length) callback(items)
    }
  ids.map(id => fetchItem(id, handler))
}

const ItemView = (state, actions, item) => {
  let view = null
  switch (state.route[0]) {
    case "user":
      break
    case "item":
      break
    default:
      view = h("div", { "class": "inner" },
        h("div", { "class": "title" },
          h("a", { href: item.url || ("#/item/" + item.id), target: item.url ? "_blank" : "_self" }, item.title),
        ),
        h("div", { "class": "info" },
          item.score + " points",
          "by ",
          h("a", { href: "#/user/" + item.by }, item.by),
          " ",
          fromNow(item.time),
          " ago | ",
          h("a", { href: "#" }, item.descendants ? (item.descendants + " comments") : "discuss"),
          item.url && [
            " | ",
            h("a", {
                "class": "host",
                href: item.url ? "//" + domain(item.url) : "#/item/" + item.id,
                target: "_blank"
              }, domain(item.url)
            )
          ]
        )
      )
  }
  return h("div", {
    class: "item item-" + state.route[0] + " id-" + item.id + (state.seen.indexOf(item.id) > -1 ? " seen" : ""),
    onclick: () => { actions.seen(item.id) }
  }, view)
}
*/