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

let Router = (props, children) => {
  return children.map(route => route(props))
}

let Route = (props) => {
  return ({ state, actions }) => {
    Route.match(state.route, props.path)
    return state.route === props.path.slice(1) ? props.component({ state, actions }) : null
  }
}

Route.match = (route, path) => {
  let params = {}, keys = []
  let regex = RegExp(path === "*" ? ".*" :
    "^" + path.replace(/\//g, "\\/").replace(/:([\w]+)/g, function(_, key) {
      keys.push(key.toLowerCase())
      return "([-\\.%\\w\\(\\)]+)"
    }) + "/?$")
  console.log(path, regex)
  let match = regex.exec(path)
  console.log(match, keys)
}

let Layout = ({ state, actions }) => h("main", null, "Layout",
  h("p", null,
    h("a", { href: "#" }, "Home"),
    " ",
    h("a", { href: "#!/blog" }, "Blog"),
    " ",
    h("a", { href: "#!/post/1" }, "Post 1"),
    " ",
    h("a", { href: "#!/post/2" }, "Post 2"),
    " ",
    h("a", { href: "#!/post/3" }, "Post 3"),
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
let Post = ({ state, actions }) => h("main", null, "Post")

let { actions } = app(model, Layout, document.body)
addEventListener("hashchange", () => {
  actions.router()
})