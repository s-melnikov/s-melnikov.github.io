const { h, app } = hyperapp

const ls = {
  tables() {
    let names = []
    Object.keys(localStorage).map(name => {
      if (name.indexOf("Table") === 0) {
        names.push(name.slice(5))
      }
    })
    return names
  },
  table(name) {
    name = "Table" + name
    return {
      add(item) {
        let items = ls.getItems(name)
        let uid = ls.uniqid()
        if (items[uid]) {
          throw Error("LS Error #1")
        }
        items[uid] = item
        ls.save(items, name)
        return uid
      },
      put(uid, item) {
        let items = ls.getItems(name)
        if (!items[uid]) {
          throw Error("LS Error #2")
        }
        Object.assign(items[uid], item)
        ls.save(items, name)
      },
      get(uid) {
        if (uid) {
          return ls.getItems(name)[uid]
        }
        return ls.getItems(name)
      },
      del(uid) {
        let items = ls.getItems(name)
        delete items[uid]
        ls.save(items, name)
      },
      drop() { return ls.save({}, name) }
    }
  },
  getItems(name) {
    if (localStorage[name] == null) {
      localStorage[name] = "{}"
    }
    return JSON.parse(localStorage[name])
  },
  save(items, name) {
    localStorage[name] = JSON.stringify(items)
  }
}

"header,section,div,h1,h2,h3,h4,h5,p,ul,li,table,th,tr,td,tbody,thead,form,label,input,button,a,span".split(",").map(t => window[t] = (props, ...args) => h(t, props, ...args))

function Logger(app) {
  return (props, root) => {
    return app(enhance(props), root)
  }
  function enhance(props) {
    if (props.actions) {
      proxy(props.actions, "")
    }
    return props
  }
  function proxy(actions, path) {
    for (let prop in actions) {
      if (actions.hasOwnProperty(prop)) {
        if (typeof actions[prop] == "function") {
          actions[prop] = new Proxy(actions[prop], {
            apply(target, self, args) {
              let prevState = Object.assign({}, args[0])
              let newState = target.apply(self, args)
              log(prevState, { name: path + prop, data: args[2] }, newState)
              return newState
            }
          })
        } else {
          proxy(actions[prop], path + prop + ".")
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
    let actions = app(enhance(props), root)
    addEventListener("hashchange", () => {
      actions.router.set()
    })
    actions.router.set()
    return actions
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
    return div({ class: "container" },
      Header(state, actions),
      div({ class: "columns" },
        div({ class: "column col-2" },
          ul({ class: "nav" },
            state.tables.map(name => li({ class: "nav-item" },
              a({ href: "#/table/" + name }, name)
            ))
          )
        ),
        div({ class: "column col-10" },
          child(state, actions)
        )
      )
    )
  }
}

const Header = (state, actions) => header({ class: "navbar"},
  section({ class: "navbar-section" },
    a({ href: "#", class: "navbar-brand mr-2" }, "Collections")
  ),
  section({ class: "navbar-section" })
)

const Page404 = (state, actions) => div({ class: "page", key: "page-404" },
  h3(null, "404")
)

const PageIndex = (state, actions) => div({ class: "page", key: "page-index" },
  h3(null, "Index Page")
)

const PageTable = (state, actions) => div({
    class: "page",
    key: "page-table-" + state.router.params.table,
    oncreate: () => actions.table.get(state.router.params.table)
  },
  h3(null, "Page Table " + state.router.params.table),
  ItemsTable(state, actions, state.table[state.router.params.table])
)

const ItemsTable = (state, actions, items) => {
  if (!items) {
    return p(null, "Nothing")
  }
  let uids = Object.keys(items)
  let cols = Object.keys(items[uids[0]])
  return table({ class: "table table-striped table-hover" },
    thead(null,
      cols.map(col => th(null, col))
    ),
    tbody(null,
      uids.map(uid => tr(null,
        cols.map(col => td({ title: items[uid][col] }, items[uid][col]  ))
      ))
    )
  )
}

Router(Logger(app))({
  init(state, actions) {
    actions.tables(ls.tables())
  },
  state: {
    tables: []
  },
  actions: {
    tables: (state, actions, tables) => ({ tables }),
    table: {
      get: (state, actions, name) => {
        return {
          [name]: ls.table(name).get()
        }
      }
    }
  },
  view: {
    "/": Layout(PageIndex),
    "/table/:table": Layout(PageTable),
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