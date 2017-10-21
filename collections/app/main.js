const { h, app } = hyperapp
const { header, section, div, h1, h2, h3, h4, h5, p, ul, li, table, th, tr, td, tbody, thead, a } = html

const Layout = child => {
  return (state, actions) => {
    return div({ class: "container" }, [
      Header(state, actions),
      div({ class: "columns" }, [
        div({ class: "column col-2" }, [
          Panel({
            title: "Tables",
            body: ul({ class: "nav" }, [
              state.tables.map(name => li({ class: "nav-item" },
                a({ href: "#/table/" + name }, name)
              ))
            ])
          })
        ]),
        div({ class: "column col-10" }, [
          child(state, actions)
        ])
      ])
    ])
  }
}

const Header = (state, actions) => header({ class: "navbar"}, [
  section({ class: "navbar-section" }, [
    a({ href: "#", class: "navbar-brand mr-2" }, "Collections")
  ]),
  section({ class: "navbar-section" })
])

const Page404 = (state, actions) => div({ class: "page", key: "page-404" }, [
  h3("404")
])

const PageIndex = (state, actions) => div({ class: "page", key: "page-index" }, [
  h3("Index Page")
])

const PageTable = (state, actions) => div({
    class: "page",
    key: "page-table-" + state.router.params.table,
    oncreate: () => actions.table.get(state.router.params.table)
  },
  Panel({
    title: h5("Table \"" + state.router.params.table + "\""),
    body: ItemsTable(state, actions, state.table[state.router.params.table])
  })
)

const Panel = opts => div({ class: "panel"}, [
  opts.title && div({ class: "panel-header" }, div({ class: "panel-title" }, opts.title)),
  opts.nav && div({ class: "panel-nav "}, opts.nav),
  opts.body && div({ class: "panel-body" }, opts.body),
  opts.footer && div({ class: "panel-footer" }, opts.footer)
])

const ItemsTable = (state, actions, items) => {
  if (!items) {
    return p("Nothing")
  }
  let uids = Object.keys(items)
  let cols = Object.keys(items[uids[0]])
  return table({ class: "table table-striped table-hover" }, [
    thead(
      cols.map( col => th(null, col) )
    ),
    tbody(
      uids.map(
        uid => tr(null,
          cols.map(
            col => td({ title: items[uid][col] }, items[uid][col])
          )
        )
      )
    )
  ])
}

Router({})(Logger({})(app))({
  init(state, actions) {
    db.tables().then(tables => actions.tables(tables))
  },
  state: {
    tables: []
  },
  actions: {
    tables: (state, actions, tables) => ({ tables }),
    table: {
      get: (state, actions, name) => {
        db.table(name).get().then(items => {
          actions.set({ [name]: items })
        })
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