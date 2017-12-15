let { h, app } = hyperapp

let storage = new Storage("my_app")

let model = {
  state: {
    route: location.hash.slice(3)
  },
  actions: {
    router: () => () => ({ route: location.hash.slice(3) })
  }
}

let Layout = ({ state, actions }) => h("main", null, "Layout",
  h("p", null,
    h(Link, { to: "/" }, "Home"),
    " ",
    h(Link, { to: "/blog" }, "Blog"),
    " ",
    h(Link, { to: "/post/1" }, "Post 1"),
    " ",
    h(Link, { to: "/post/2" }, "Post 2"),
    " ",
    h(Link, { to: "/post/3" }, "Post 3"),
  ),
  h("p", null,
    h(Router, { state, actions },
      h(Route, { path: "/", component: Home }),
      h(Route, { path: "/blog", component: Blog }),
      h(Route, { path: "/post/:id", component: Post }),
    )
  )
)

let Home = ({ state, actions }) => h("main", null, "Home")
let Blog = ({ state, actions }) => h("main", null, "Blog")
let Post = ({ state, actions, params }) => h("main", null, "Post " + params.id)

let { actions } = app(model, Layout, document.body)
addEventListener("hashchange", () => {
  actions.router()
})