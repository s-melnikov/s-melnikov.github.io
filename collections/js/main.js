let { h, app } = hyperapp
let storage = new Storage("my_app")

let model = {
  state: {
    route: location.hash.slice(2) || "/",
    user: { first_name: "Jonh", last_name: "Doe" },
    tables: null,
    table: null,
    items: null
  },
  actions: {
    setRoute: route => ({ route: route }),
    getTables: () => {
      storage.table("tables").find().then(result => {
        actions.setTables(result.toArray())
      })
      return { tables: [] }
    },
    setTables: tables => ({ tables }),
    getTable: slug => (state, actions) => {
      Promise.all([
        storage.table(slug).find(),
        storage.table("tables").where({ slug: slug }).findOne()
      ]).then(function([ itemsReult, tableResult ]) {
        actions.setTable({
          table: tableResult.toArray(),
          items: itemsReult.toArray()
        })
      })
      return { table: null, items: null }
    },
    setTable: ({ table, items }) => ({ table, items })
  }
}

let Layout = ({ state, actions }) => {
  log("Layout", "view()")
  return h("div", { class: "layout" },
    h(state.user ? Main : SignIn, { state, actions })
  )
}

let SignIn = ({ state, actions }) => {
  log("SignIn", "view()")
  return h("div", { class: "sign-in" }, "Sign In")
}

let Main = ({ state, actions }) => {
  log("Main", "view()")
  return h("div", {
      class: "container",
      oncreate: () => actions.getTables()
    },
    h("main", null,
      h(Router, { state, actions },
        h(Route, { path: "/", component: Home }),
        h(Route, { path: "/table/:slug", component: Table })
      )
    ),
    h("header", null,
      h("a", { href: "#" }, "Sign out")
    ),
    h("aside", null,
      h("menu", null,
        h( "a", { href: "#" }, "Home")
      ),
      h("p", null, "Collections"),
      state.tables ? h("menu", null,
        state.tables.map(table =>
          Link({ to: "/table/" + table.slug }, table.title)
        )
      ) : null
    )
  )
}

let Home = ({ state, actions }) => {
  log("Home", "view()")
  return h("div", null,
    h("h3", null, "Home"),
    h("h4", null, "Choose a table"),
    h("div", { class: "row"},
      state.tables ? state.tables.map(table =>
        h("div", { class: "col" },
          h("div", { class: "card" },
            Link({ to: "/table/" + table.slug }, table.title)
          )
        )
      ) : null
    )
  )
}

let Table = ({ state, actions, params }) => {
  log("Table", "view()")
  return h("div", {
      key: params.slug,
      oncreate: () => actions.getTable(params.slug)
    },
    h("h3", null, `Tabel "${params.slug}"`),
    state.table ? h("table", null,
      h("thead", null,
        h("tr", null,
          state.table.fields.map(field =>
            field.display ? h("th", null, field.title) : null
          )
        )
      ),
      h("tbody", null,
        state.items.map(item =>
          h("tr", null,
            state.table.fields.map(field =>
              field.display ? h("td", null, item[field.slug]) : null
            )
          )
        )
      )
    ) : null
  )
}

let { actions } = Logger(app)(model, Layout, document.body)
addEventListener("hashchange", () => {
  actions.setRoute(location.hash.slice(2) || "/")
})
