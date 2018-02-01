const { app, h } = hyperapp
const db = database("my_app")
const route = path => location.hash = "#!/" + path

const state = {
  route: location.hash.slice(2),
  user: { first_name: "Jonh", last_name: "Doe" },
  collections: null,
  collection: null,
  entries: null
}

const actions = {
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
  setCollectionEntries: entries => ({ entries }),
  editFieldFormSubmit: (collection, field) => {

  }
}

const router = createRouter({
  "/": Collections,
  "/collections": Collections,
  "/collection/:slug": Collection,
  "/collection/:slug/field/:field": Collection,
  "/collection/:slug/entries": CollectionEntries
})

const main = logger(app)(state, actions, Layout, document.body)

addEventListener("hashchange", () => {
  main.setRoute(location.hash.slice(2))
})

function Layout(state, actions) {
  return state.user ?
    h("div", {
        class: "container",
        oncreate: () => actions.getCollections()
      },
      Navbar(state, actions),
      Aside(state, actions),
      h("main", { class: "page-main" }, router(state, actions))
    ) :
    h("div", { class: "sign-in" }, "Sign In")
}

function Navbar(state, actions) {
  return h("header", { class: "navbar" },
    h("section", { class: "navbar-section" }),
    h("section", { class: "navbar-section" },
      h("a", { href: "#", class: "btn btn-link" }, "Sign-out")
    )
  )
}

function Aside(state, actions) {
  return h("div", { class: "page-aside" },
    h("ul", { class: "nav" },
      h("li", { class: "nav-item" },
        h("a", { href: "#" }, "Home")
      ),
      h("li", { class: "nav-item" },
        h("a", { href: "#!/collections" }, "Collections"),
        state.collections ? h("ul", { class: "nav" },
          state.collections.map(collection =>
            h("li", { class: "nav-item" },
              Link({ to: "/collection/" + collection.slug + "/entries" },
                collection.title)
            )
          )
        ) : null
      )
    )
  )
}

function Collections(state, actions) {
  return h("div", null,
    h("ul", { class: "breadcrumb" },
      h("li", { class: "breadcrumb-item" },
        h("span", null, "Collections")
      )
    ),
    state.collections ? [
      h("div", { class: "columns" },
        state.collections.map(collection => h("div", { class: "column col-3" },
          Link({
            to: "/collection/" + collection.slug + "/entries",
            class: "card mb-2"
          }, h("div", { class: "card-body" }, collection.title))
        ))
      )
    ] :
    h("div", { class: "empty" },
      h("div", { class: "empty-icon" },
        h("i", { class: "icon icon-people" })
      ),
      h("p", { class: "empty-title h5" }, "You have no collections"),
      h("p", { class: "empty-subtitle" },
        "Click the button to install demo data."),
      h("div", { class: "empty-action" },
        h("a", { href: "?install", class: "btn btn-primary" }, "Install")
      )
    )
  )
}

function Collection(state, actions, params) {
  return h("div", {
      key: "table-" + params.slug + "-items",
      oncreate: () => {
        if (!state.collection || state.collection.slug !== params.slug) {
          actions.getCollection(params.slug)
        }
      }
    },
    state.collection ? [
      h("ul", { class: "breadcrumb" },
        h("li", { class: "breadcrumb-item" },
          h("a", { href: "#!/collections" }, "Collections")
        ),
        h("li", { class: "breadcrumb-item" },
          h("a", { href: "#!/collection/" + state.collection.slug + "/entries" },
            state.collection.title)
        ),
        h("li", { class: "breadcrumb-item" },
          h("span", null, "Editing")
        )
      ),
      h("div", { class: "columns" },
        h("div", { class: "column entries" },
          h("div", { class: "columns p-2" },
            h("div", { class: "column" }, "Label"),
            h("div", { class: "column" }, "Slug")
          ),
          state.collection.fields.map(field =>
            Link({
                to: "/collection/" + params.slug + "/field/" + field.slug,
                class: "entry columns p-2"
              },
              h("div", { class: "column" }, field.label),
              h("div", { class: "column" }, field.slug)
            )
          )
        ),
        h("div", { class: "column" },
          params.field ?
            h(EditFieldForm, { state, actions, slug: params.field })
            : null
        ),
        h("div", { class: "col" })
      )
    ] : null,
  )
}

function CollectionEntries(state, actions, params) {
  let key = "collection-" + params.slug + "-entries entries"
  return h("div", {
      key,
      class: key,
      oncreate: () => {
        actions.getCollection(params.slug)
        actions.getCollectionEntries(params.slug)
      }
    },
    state.collection ? [
      h("ul", { class: "breadcrumb" },
        h("li", { class: "breadcrumb-item" },
          h("a", { href: "#!/collections" }, "Collections")
        ),
        h("li", { class: "breadcrumb-item" },
          h("span", null, state.collection.title)
        )
      ),
      Link({ to: "/collection/" + params.slug, class: "btn btn-sm" }, "edit"),
      h("div", { class: "columns p-3" },
        state.collection.fields.map(field =>
          field.display ? h("div", { class: "column" }, field.label) : null
        )
      ),
      state.entries ? state.entries.map(entry => Link({
            to: "/collection/" + params.slug,
            class: "columns entry p-3"
          }, state.collection.fields.map(field => field.display ? h("div", { class: "column" }, entry[field.slug]) : null)
        )
      ) : h("p", null, "Loading collection entries...")
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

function EditFieldForm({ state, actions, slug }) {
  console.log(state, actions, slug)
  let field = state.collection.fields.find(field => field.slug === slug)
  let oninput = event => console.log(submitBtn)
  let submitBtn
  return h("div", null, "Edit field",
    h("form", {
        onsubmit(event) {
          event.preventDefault()
          let update = {}
          for (let key in field) {
            if (event.target.elements[key]) {
              console.log(value in event.target.elements[key])
            }
            // if (field[key]) {}
          }
          // event.target.elements
          // state.editFieldFormSubmit()
        }
      },
      h("label", null,
        h("span", null, "Label"),
        h("input", { type: "text", name: "label", value: field.label, oninput })
      ),
      h("label", null,
        h("span", null, "Slug"),
        h("input", { type: "text", name: "slug", value: field.slug })
      ),
      h("label", null,
        h("span", null, "Type"),
        h("select", { name: "type", value: field.type },
          h("option", { value: "text" }, "Text"),
          h("option", { value: "text_large" }, "Large text"),
          h("option", { value: "list" }, "Options list"),
          h("option", { value: "list" }, "Checkbox"),
          h("option", { value: "list" }, "Collection")
        )
      ),
      h("div", { class: "row mt-2" },
        h("label", { class: "col" },
          h("span", null, "Display"),
          h("input", { name: "display", type: "checkbox", checked: field.display })
        ),
        h("label", { class: "col" },
          h("span", null, "Required"),
          h("input", { name: "required", type: "checkbox", checked: field.required })
        )
      ),
      h("label", null,
        h("span", null, "Description"),
        h("textarea", { name: "info" }, field.info)
      ),
      h("div", { class: "mt-2" },
        h("button", null, "Submit")
      )
    )
  )
}

function Link(props, ...childrens) {
  let hash = "#!" + props.to
  if (hash === location.hash) {
    props.class = (props.class ? props.class + " " : "") + "active"
  }
  props.href = hash
  delete props.to
  return h("a", props, childrens)
}
