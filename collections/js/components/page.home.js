define("components/page.home", [
  "hyperapp",
  "components/router"
], ({ h }, { Link }) => {

  let PageHome = ({ state, actions }) => {
    return h("div", null,
      h("h3", null, "Home"),
      state.tables && state.tables.length ? [
        h("p", null, "Collections"),
        h("div", { class: "row"}, state.tables.map(table =>
            h("div", { class: "col" },
              h("div", { class: "card" },
                Link({ to: "/collection/" + table.slug + "/entries"}, table.title)
              )
            )
          )
        )
      ] :
      h("p", null,
        "No collections found. Install demo data? ",
        h("a", { href: "?install"}, "Install")
      )
    )
  }

  return PageHome
})
