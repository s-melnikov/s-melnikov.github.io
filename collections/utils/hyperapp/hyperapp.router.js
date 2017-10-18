const Router = options => {
  options = options || {}
  return app => {
    return (props, root) => {
      let actions = app(enhance(props), root)
      addEventListener("hashchange", () => {
        actions.router.set()
      })
      actions.router.set()
      return actions
    }
  }
  function enhance(props) {
    let routes = []
    if (!props.state) props.state = {}
    if (!props.actions) props.actions = {}
    props.state.router = {}
    props.actions.router = {
      set() {
        let pathname = location.hash.slice(1) || "/",
          params = {}, match
        for (let i = 0; (i < routes.length); i++) {
          if (match = routes[i].rgx.exec(pathname)) {
            routes[i].keys.map((key, i) => params[key] = match[i + 1])
            props.view = routes[i].view
            return { params, pathname }
          }
        }
      },
      go() {}
    }
    Object.keys(props.view).map(path => {
      let keys = []
      routes.push({
        rgx: RegExp(path === "*" ? ".*" : "^" +
          path.replace(/\//g, "\\/").replace(/:([\w]+)/g, function(_, key) {
            keys.push(key)
            return "([-\\.%\\w\\(\\)]+)"
          }) + "/?$"),
        view: props.view[path],
        keys
      })
    })
    return props
  }
}