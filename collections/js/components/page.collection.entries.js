define("components/page.collection.entries", [
  "hyperapp",
  "components/router"
], ({ h }, { Link }) => {

  let PageCollectionEntries = ({ state, actions, params }) => {
    return h("div", {
        key: "collection-" + params.slug + "-entries",
        oncreate: () => {
          actions.getCollection(params.slug)
          actions.getCollectionEntries(params.slug)
        }
      },
      state.collection ? [
        h("h3", null,
          "Collection " + state.collection.title + " ",
          h("small", null, Link({ to: "/collection/" + params.slug },
            h("button", { class: "link" }, "Edit")
          ))
        ),
        h("table", null,
          h("thead", null,
            h("tr", null, state.collection.fields.map(field =>
              field.display ? h("th", null, field.title) : null
            ))
          ),
          h("tbody", null,
            state.entries ? state.entries.map(entry => h("tr", null,
              state.collection.fields.map(field =>
                field.display ? h("td", null, Link(
                  { to: "/collection/" + params.slug + "/entry/" + entry.uid },
                  entry[field.slug]
                )) : null
              )
            )) : h("p", null, "Loading collection entries...")
          )
        )
      ] : h("p", null, "Loading collection...")
    )
  }

  return PageCollectionEntries
})
