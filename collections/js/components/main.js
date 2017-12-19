define("components/main", [
  "hyperapp",
  "components/router",
  "components/home",
  "components/table"
], ({ h }, { Router, Route, Link }, Home, Table) => {

  let Main = ({ state, actions }) => {
    return h("div", {
        class: "container",
        oncreate: () => actions.getTables()
      },
      h("main", null,
        h(Router, { state, actions },
          h(Route, { path: "/", component: Home }),
          h(Route, { path: "/table/:slug", component: Table }),
          h(Route, { path: "/table/:slug/fields(/:field)?", component: Fields })
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

  return Main

})
