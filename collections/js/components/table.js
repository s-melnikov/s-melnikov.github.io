define("components/table", [
  "hyperapp",
  "components/router"
], ({ h }, { Link }) => {

  let Table = ({ state, actions, params }) => {
    return h("div", {
        key: "table-" + params.slug,
        oncreate: () => {
          actions.getTable(params.slug)
          actions.getTableItems(params.slug)
        }
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
          state.items ? state.items.map(item =>
            h("tr", null,
              state.table.fields.map(field =>
                field.display ?
                  h("td", null,
                    Link(
                      { to: "/table/" + params.slug + "/fields" },
                      item[field.slug]
                    )
                  ) : null
              )
            )
          ) : null
        )
      ) : null
    )
  }

  return Table

})
