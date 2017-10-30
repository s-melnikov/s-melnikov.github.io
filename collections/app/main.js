const { h, app } = hyperapp
const db = Database("test")

const Layout = child => {
  return (state, actions) => {
    return h("div", { class: "container" },
      Header(state, actions),
      h("div", { class: "columns" },
        h("div", { class: "column col-2" },
          Panel({
            title: "Tables",
            body: h("ul", { class: "nav" },
              Object.keys(state.tables).map(uid => h("li", { class: "nav-item" },
                h("a", { href: "#/table/" + state.tables[uid].slug }, state.tables[uid].title)
              ))
            ),
            footer: true
          })
        ),
        h("div", { class: "column col-10" },
          child(state, actions)
        )
      )
    )
  }
}

const Header = (state, actions) => h("header", { class: "navbar"},
  h("section", { class: "navbar-section" },
    h("a", { href: "#", class: "navbar-brand mr-2" }, "Collections")
  ),
  h("section", { class: "navbar-section" })
)

const Page404 = (state, actions) => h("div", { class: "page", key: "page-404" },
  h("h3", {}, "404")
)

const PageIndex = (state, actions) => h("div", { class: "page", key: "page-index" },
  h("h3", {}, "Index Page")
)

const PageTable = (state, actions) => h("div", {
    class: "page",
    key: "page-table-" + state.router.params.table,
    oncreate: () => actions.table.get(state.router.params.table)
  },
  Panel({
    title: h("h5", {}, "Table \"" + state.router.params.table + "\""),
    body: ItemsTable(state, actions, state.table[state.router.params.table])
  })
)

const Panel = opts => h("div", { class: "panel"},
  h("div", { class: "panel-header" },
    h("div", { class: "panel-title" }, opts.title)
  ),
  h("div", { class: "panel-nav "}, opts.nav),
  h("div", { class: "panel-body" }, opts.body),
  h("div", { class: "panel-footer" }, opts.footer)
)

const ItemsTable = (state, actions, items) => {
  let schema = db.table("schema").get()[state.router.params.table],
    fields = schema.fields.filter(item => item.display),
    uids, cols
  if (!items) {
    return h("p", {}, "Nothing")
  }
  console.log(fields)
  uids = Object.keys(items)
  if (!uids.length) {
    return h("p", {}, "Nothing")
  }
  return h("table", { class: "table table-striped table-hover" },
    h("thead", {}, fields.map(item => h("th", {}, item.title))),
    h("tbody", {},
      uids.map(uid => h("tr", {},
        fields.map(item => h("td", { title: items[uid][item.slug] }, items[uid][item.slug]))
      ))
    )
  )
}

Router({})(Logger({})(app))({
  init(state, actions) {
    actions.tables(db.table("schema").get())
  },
  state: {
    tables: null
  },
  actions: {
    tables: (state, actions, tables) => ({ tables }),
    table: {
      get: (state, actions, name) => {
        actions.set({ [name]: db.table(name).get() })
      },
      set: (state, actions, table) => table
    }
  },
  view: {
    "/": Layout(PageIndex),
    "/table/:table": Layout(PageTable),
    "*": Layout(Page404)
  }
}, document.querySelector("#root"))