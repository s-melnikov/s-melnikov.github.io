const { h, app } = hyperapp

const uniqid = () => {
  let src = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", now = Date.now(), chars = [], i = 8, id
  while (i--) {
    chars[i] = src.charAt(now % 64)
    now = Math.floor(now / 64)
  }
  id = chars.join("")
  while (i++ < 8) {
    id += src.charAt(Math.floor(Math.random() * 64))
  }
  return id
}

function log(prevState, action, nextState) {
  console.group('%c action', 'color: gray; font-weight: lighter;', action.name);
  console.log('%c prev state', 'color: #9E9E9E; font-weight: bold;', prevState);
  console.log('%c data', 'color: #03A9F4; font-weight: bold;', action.data);
  console.log('%c next state', 'color: #4CAF50; font-weight: bold;', nextState);
  console.groupEnd();
}

"div,h1,h2,h3,h4,h5,p,ul,li,form,label,input,button,span".split(",").map(t => window[t] = (props, ...args) => h(t, props, ...args))

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

let Router = (state, actions, routes) => h("div", {
  id: "router"
})

let routes = {
  "/": div(null, "Hi!"),
  "*": div(null, "404")
}

function logger(app) {
  return props => {
    return app(enhance(props))
  }
  function enhance(props) {
    proxy(props.actions)
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

logger(app)({
  init(state, actions) {
    window.addEventListener("hashchange", actions.route)
    actions.route()
  },
  state: {
    route: [""],
    count: 0
  },
  actions: {
    route: () => ({ route: location.hash.slice(1).split("/") }),
    down: state => ({ count: state.count - 1 }),
    up: state => ({ count: state.count + 1 })
  },
  view: (state, actions) => h("div", { class: "conatiner" },
    button({ onclick: actions.up }, "+"),
    span(null, state.count),
    button({ onclick: actions.down }, "-"),
    Router(state, actions, routes)
  )
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