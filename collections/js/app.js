const { app, h } = hyperapp
const { Router, Route, Link } = router
const db = database("my_app")

let state = {
  route: location.hash.slice(2),
  user: { first_name: "Jonh", last_name: "Doe" },
  collections: null,
  collection: null,
  entries: null
}

let actions = {
  setRoute: route => ({ route: route }),
  getCollections: () => (state, actions) => {
    db.collection("collections").find().then(result => {
      let collections = result.data()
      actions.setCollections(collections.length ? collections : null)
    })
    return { collections: null }
  },
  setCollections: collections => ({ collections }),
  getCollection: slug => (state, actions) => {
    db.collection("collections").find({ slug: slug }).then(result => {
      let first = result.first()
      actions.setCollection(first && first.data())
    })
    return { collection: null }
  },
  setCollection: collection => ({ collection }),
  getCollectionEntries: slug => (state, actions) => {
    db.collection(slug).find().then(result =>
      actions.setCollectionEntries(result.data())
    )
    return { entries: [] }
  },
  setCollectionEntries: entries => ({ entries })
}

let main = logger(app)(state, actions, Layout, document.body)

addEventListener("hashchange", () => {
  main.setRoute(location.hash.slice(2))
})

function Layout(state, actions) {
  return state.user ?
    h("div", {
        class: "container",
        oncreate: () => actions.getCollections()
      },
      h("main", null,
        h(Router, { state, actions },
          h(Route, { path: "/", component: PageHome }),
          h(Route, { path: "/collection/:slug", component: PageCollection }),
          h(Route, { path: "/collection/:slug/field/:field", component: PageCollection }),
          h(Route, { path: "/collection/:slug/entries", component: PageCollectionEntries }),
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
        state.collections ? h("menu", null,
          state.collections.map(collection =>
            Link({ to: "/collection/" + collection.slug + "/entries" }, collection.title)
          )
        ) : null
      )
    ) :
    h("div", { class: "sign-in" }, "Sign In")
}

function PageHome({ state, actions }) {
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

function PageCollection({ state, actions, params }) {
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
        h("span", null, "Collection " + state.collection.title + " "),
        Link({ to: "/collection/" + params.slug + "/entries"},
          h("button", { class: "link" }, h("small", null, "Return"))
        )
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

function PageCollectionEntries({ state, actions, params }) {
  return h("div", {
      key: "collection-" + params.slug + "-entries",
      oncreate: () => {
        actions.getCollection(params.slug)
        actions.getCollectionEntries(params.slug)
      }
    },
    state.collection ? [
      h("h3", null,
        h("span", null, "Collection " + state.collection.title + " "),
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

function Modal(params) {
  return h("div", { class: "modal" },
    h("div", { class: "modal-body" },
      h("div", { class: "modal-header" },
        h("div", { class: "modal-title" }, params.title || null),
        h("div", {
          class: "modal-close",
          onclick: params.close || null
         }, "×")
      ),
      h("div", { class: "modal-content" }, params.content || null),
      h("div", { class: "modal-footer" }, params.footer || null)
    )
  )
}

function EditFieldForm(params) {

  console.log(params)

  return h("div", null, "Lorem ipsum dolor")

  return h(Modal, {
    title: "Edit field",
    content: h("div", null, "Lorem ipsum dolor sit amet!"),
    footer: [h("button", null, "Send"), h("button", { class: "red" }, "Cancel")]
  })
}
