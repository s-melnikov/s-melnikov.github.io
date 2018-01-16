define("components/layout", [
  "hyperapp",
  "components/router",
  "components/page.home",
  "components/page.collection",
  "components/page.collection.entries"
], (
  { h },
  { Router, Route, Link },
  PageHome,
  PageCollection,
  PageCollectionEntries) => {

  let Layout = (state, actions) => {
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

  return Layout
})
