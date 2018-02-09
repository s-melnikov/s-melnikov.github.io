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
  editFieldFormSubmit: ({ index, update }) => (state, actions) => {
    state.collection.fields[index] = update
    db.collection("collections").find(state.collection.$key).then(result => {
      let collection = result.first()
      collection.update({ fields: state.collection.fields }, () => { /* TODO */})
    })
    return { collaction: state.collection }
  }
}

const router = createRouter({
  "/": Collections,
  "/collections": Collections,
  "/collection/:slug": Collection,
  "/collection/:slug/field/:id": Collection,
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
  return h("div", { class: "page-content" },
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
      class: "page-content",
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
                to: "/collection/" + params.slug + "/field/" + field.id,
                class: "entry columns p-2"
              },
              h("div", { class: "column" }, field.label),
              h("div", { class: "column" }, field.slug)
            )
          )
        ),
        h("div", { class: "divider-vert" }),
        h("div", { class: "column" },
          params.id ?
            h(EditFieldForm, { state, actions, id: params.id })
            : null
        ),
        h("div", { class: "col" })
      )
    ] : null,
  )
}

function CollectionEntries(state, actions, params) {
  let key = "collection-" + params.slug + "-entries"
  return h("div", {
      key,
      class: "page-content entries" + key,
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
      Link({ to: "/collection/" + params.slug, class: "btn btn-link" }, "edit"),
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

function EditFieldForm({ state, actions, id }) {
  let field = state.collection.fields.find(field => field.id == id)
  let index = state.collection.fields.indexOf(field)
  let oninput = () => submitButton.disabled = false
  let onupdate = el => submitButton = el
  let submitButton
  return h("div", {
      key: "edit-field-" + id,
      class: "edit-field-form"
    },
    h("div", { class: "p-2" }, field.label),
    h("form", {
        class: "form-horizontal",
        onsubmit(event) {
          event.preventDefault()
          let update = {}
          submitButton.disabled = true
          for (let key in field) {
            if (event.target.elements[key]) {
              switch (event.target.elements[key].type) {
                case "checkbox":
                  update[key] = event.target.elements[key].checked
                  break;
                case "radio":
                  if (event.target.elements[key].checked) {
                    update[key] = event.target.elements[key].value
                  }
                  break;
                default:
                  update[key] = event.target.elements[key].value
              }
            }
          }
          actions.editFieldFormSubmit({ index, update })
        }
      },
      h("label", { class: "form-group" },
        h("div", { class: "col-3" }, "Label"),
        h("div", { class: "col-9" },
          h("input", { class: "form-input", type: "text", name: "label",
            value: field.label, oninput })
        )
      ),
      h("label", { class: "form-group" },
        h("div", { class: "col-3" }, "Slug"),
        h("div", { class: "col-9" },
          h("input", { class: "form-input", type: "text", name: "slug",
            value: field.slug, oninput })
        )
      ),
      h("label", { class: "form-group" },
        h("div", { class: "col-3" }, "Type"),
        h("div", { class: "col-9" },
          h("select", { class: "form-select", name: "type",
            value: field.type, oninput },
            h("option", { value: "text" }, "Text"),
            h("option", { value: "text_large" }, "Large text"),
            h("option", { value: "list" }, "Options list"),
            h("option", { value: "list" }, "Checkbox"),
            h("option", { value: "list" }, "Collection")
          )
        )
      ),
      h("div", { class: "form-group" },
        h("div", { class: "col-9 col-ml-auto" },
          h("label", { class: "form-switch" },
            h("input", { type: "checkbox", name: "display",
              checked: field.display, onchange: oninput }),
            h("i", { class: "form-icon" }),
            h("span", null, "Display field in entries list")
          )
        )
      ),
      h("div", { class: "form-group" },
        h("div", { class: "col-9 col-ml-auto" },
          h("label", { class: "form-switch" },
            h("input", { type: "checkbox", name: "required",
              checked: field.required, onchange: oninput }),
            h("i", { class: "form-icon" }),
            h("span", null, "Is field required")
          )
        )
      ),
      h("label", { class: "form-group" },
        h("div", { class: "col-3" }, "Description"),
        h("div", { class: "col-9" },
          h("textarea", { class: "form-input", name: "info",
            oninput }, field.info)
        )
      ),
      h("div", { class: "text-right mt-2" },
        h("button", { class: "btn", disabled: true,
          oncreate: onupdate, onupdate }, "Submit")
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
