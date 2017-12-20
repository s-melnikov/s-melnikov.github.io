define("components/page.collection", [
  "hyperapp",
  "components/router",
  "components/edit_field_form"
], ({ h }, { Link }, EditFieldForm) => {

  let PageCollection = ({ state, actions, params }) => {
    return h("div", {
        key: "table-" + params.slug + "-items",
        oncreate: () => {
          if (!state.collection || state.collection.slug !== params.slug) {
            actions.getCollection(params.slug)
          }
        }
      },
      state.collection ? [
        h("h3", null,
          "Collection " + state.collection.title + " ",
          h("small", null, Link({ to: "/collection/" + params.slug + "/entries"},
            h("button", { class: "link" }, "Return")
          ))
        ),
        h("div", { class: "row" },
          h("div", { class: "col" },
            state.collection.fields.map(field =>
              h("div", { class: "card mb-1"},
                h("div", { class: "row" },
                  h("div", { class: "col" },
                    Link(
                      { to: "/collection/" + params.slug + "/field/" + field.slug },
                      field.slug
                    )
                  ),
                  h("div", { class: "col" })
                )
              )
            )
          ),
          h("div", { class: "col" },
            params.field ?
              h(EditFieldForm, { state, actions, field: params.field })
              : null
          ),
          h("div", { class: "col" })
        )
      ] : null,
    )
  }

  return PageCollection
})
