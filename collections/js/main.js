let { h, app } = hyperapp
let storage = new Storage("my_app")

let model = {
  state: {
    route: location.hash.slice(3),
    user: { first_name: "Jonh", last_name: "Doe" },
    tables: []
  },
  actions: {
    router: () => () => ({ route: location.hash.slice(3) })
  }
}

let Layout = ({ state, actions }) => h("div", { "class": "layout" },
  h(state.user ? Main : SignIn, { state, actions })
)

let SignIn = ({ state, actions }) => h("div", { "class": "sign-in" }, "Sign In")

let Main = ({ state, actions }) => h("div", {
    "class": "container",
    oncreate: (...args) => {
      return console.log(args)
      storage.table("tables").find().then(result => {
        this.setState({ tables: result.toArray() })
      })
    }
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
    h("menu", null,
      state.tables.map(table =>
        h( "a", { href: "#/table/" + table.slug  }, table.title)
      )
    )
  )
)

let Home = ({ state, actions }) => h("p", null, "Home")
let Table = ({ state, actions }) => h("p", null, "Table")

let { actions } = app(model, Layout, document.body)
addEventListener("hashchange", () => {
  actions.router()
})