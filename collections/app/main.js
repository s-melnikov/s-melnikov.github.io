const { h, app } = hyperapp
const { header, section, div, h1, h2, h3, p, ul, li, table, th, tr, td, tbody, thead, a } = html

const Layout = child => {
  return (state, actions) => {
    return div({ class: "container" }, [
      Header(state, actions),
      div({ class: "columns" }, [
        div({ class: "column col-2" }, [
          ul({ class: "nav" }, [
            state.tables.map(name => li({ class: "nav-item" },
              a({ href: "#/table/" + name }, name)
            ))
          ])
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
  }, [
  h3("Page Table " + state.router.params.table),
  ItemsTable(state, actions, state.table[state.router.params.table])
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

Router(Logger()(app))({
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



