define("components/home", ["hyperapp"], ({ h }) => {

  let Home = ({ state, actions }) => {
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

  return Home

})
