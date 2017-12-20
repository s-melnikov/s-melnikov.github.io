define("components/page.home", [
  "hyperapp",
  "components/router"
], ({ h }, { Link }) => {

  let PageHome = ({ state, actions }) => {
    return h("div", null,
      h("h3", null, "Home"),
      state.collections ? [
        h("p", null, "Collections"),
        h("div", { class: "row"}, state.collections.map(collection =>
            h("div", { class: "col" },
              h("div", { class: "card" },
                Link({ to: "/collection/" + collection.slug + "/entries"}, collection.title)
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
