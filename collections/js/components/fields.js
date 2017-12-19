define("components/fields", [
  "hyperapp",
  "components/router"
], ({ h }, { Link }) => {

  let Fields = ({ state, actions, params }) => {
    return h("div", {
        key: "table-" + params.slug + "-items",
        oncreate: () => {
          if (!state.table || state.table.slug !== params.slug) {
            actions.getTable(params.slug)
          }
        }
      },
      state.table ? [
        h("h3", null, 'Table "' + state.table.title + '"'),
        h("div", { class: "row" },
          h("div", { class: "col" },
            state.table.fields.map(field =>
              h("div", { class: "card mb-1"},
                h("div", { class: "row" },
                  h("div", { class: "col" },
                    Link(
                      { to: "/table/" + params.slug + "/fields/" + field.slug },
                      field.slug
                    )
                  ),
                  h("div", { class: "col" })
                )
              )
            )
          ),
          h("div", { class: "col" })
        )
      ] : null,
      params.field ? h(FieldForm, { table: params.slug, field: params.field }) : null
    )
  }

  return Fields

})
