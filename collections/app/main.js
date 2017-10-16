const { h, app } = hyperapp

const ls = name => {
  name = "Table" + name
  let getItems = () => {
    if (localStorage[name] == null) {
      localStorage[name] = "{}"
    }
    return JSON.parse(localStorage[name])
  }
  let save = items => {
    localStorage[name] = JSON.stringify(items)
  }
  return {
    add: item => {
      let items = getItems()
      let uid = uniqid()
      if (items[uid]) {
        throw Error("LS Error #1")
      }
      items[uid] = item
      save(items)
      return uid
    },
    put: (uid, item) => {
      let items = getItems()
      if (!items[uid]) {
        throw Error("LS Error #2")
      }
      Object.assign(items[uid], item)
      save(items)
    },
    get: uid => {
      let item = getItems()[uid]
      return item
    },
    delete: uid => {
      let items = getItems()
      delete items[uid]
      save(items)
    },
    getAll: () => getItems(),
    drop: () => save({})
  }
}

"div,h1,h2,h3,h4,h5,p,ul,li,form,label,input,button,span".split(",").map(t => window[t] = (props, ...args) => h(t, props, ...args))

function Logger(app) {
  return (props, root) => {
    return app(enhance(props), root)
  }
  function enhance(props) {
    if (props.actions) {
      proxy(props.actions)
    }
    return props
  }
  function proxy(actions) {
    for (let prop in actions) {
      if (actions.hasOwnProperty(prop)) {
        if (typeof actions[prop] == "function") {
          actions[prop] = new Proxy(actions[prop], {
            apply(target, self, args) {
              let prevState = Object.assign({}, args[0])
              let newState = target.apply(self, args)
              log(prevState, { name: prop, data: args[2] }, newState)
              return newState
            }
          })
        } else {
          proxy(actions[prop])
        }
      }
    }
  }
  function log(prevState, action, nextState) {
    console.groupCollapsed('%c action', 'color: gray; font-weight: lighter;', action.name);
    console.log('%c prev state', 'color: #9E9E9E; font-weight: bold;', prevState);
    console.log('%c data', 'color: #03A9F4; font-weight: bold;', action.data);
    console.log('%c next state', 'color: #4CAF50; font-weight: bold;', nextState);
    console.groupEnd();
  }
}

function Router(app) {
  return (props, root) => {
    props.init = (state, actions) => {
      addEventListener("hashchange", () => {
        actions.router.set()
      })
      actions.router.set()
    }
    return app(enhance(props), root)
  }
  function enhance(props) {
    let routes = []
    if (!props.state) props.state = {}
    if (!props.actions) props.actions = {}
    props.state.router = {}
    props.actions.router = {
      set() {
        let pathname = location.hash.slice(1) || "/",
          params = {}, match
        for (let i = 0; (i < routes.length); i++) {
          if (match = routes[i].rgx.exec(pathname)) {
            routes[i].keys.map((key, i) => params[key] = match[i + 1])
            props.view = routes[i].view
            return { params, pathname }
          }
        }
      },
      go() {}
    }
    Object.keys(props.view).map(path => {
      let keys = []
      routes.push({
        rgx: RegExp(path === "*" ? ".*" : "^" +
          path.replace(/\//g, "\\/").replace(/:([\w]+)/g, function(_, key) {
            keys.push(key)
            return "([-\\.%\\w\\(\\)]+)"
          }) + "/?$"),
        view: props.view[path],
        keys
      })
    })
    return props
  }
}

const Layout = child => {
  return (state, actions) => {
    return div(null, "Layout", child(state, actions))
  }
}

const Page404 = () => h3(null, "404")

Router(Logger(app))({
  state: { count: 0 },
  actions: {
    up: ({ count }) => ({ count: count++ })
  },
  view: {
    "/": Layout(),
    "*": Layout(Page404)
  }
}, document.querySelector("#root"))

/*
fetch("mocks/Users.json").then(resp => resp.json()).then(data => {
  let table = ls("Users")
  data.map(item => { table.add(item) })
})
fetch("mocks/Cars.json").then(resp => resp.json()).then(data => {
  let table = ls("Cars")
  data.map(item => { table.add(item) })
})
fetch("mocks/Apps.json").then(resp => resp.json()).then(data => {
  let table = ls("Apps")
  data.map(item => { table.add(item) })
})
fetch("mocks/Companies.json").then(resp => resp.json()).then(data => {
  let table = ls("Companies")
  data.map(item => { table.add(item) })
})
*/