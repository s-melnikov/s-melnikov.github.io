!function(exports) {

  let Router = (props, children) => {
    return children.map(route => route(props))
  }

  let Route = (props) => {
    return ({ state, actions }) => {
      let params = Route.match(state.route, props.path)
      return params ? props.component({ state, actions, params }) : null
    }
  }

  Route.match = (route, path) => {
    let params = {},
      keys = [],
      regex = RegExp(path === "*" ? ".*" :
        "^" + path.replace(/:([\w]+)/g, function(_, key) {
          keys.push(key.toLowerCase())
          return "([-\\.%\\w\\(\\)]+)"
        }) + "$"),
      match = regex.exec(route || "/")
    if (match) {
      keys.map((key, i) => params[key] = (match[i + 1] || "").toLowerCase())
      return params
    }
    return null
  }

  let Link = (props, children) => {
    let hash = "#!" + props.to
    if (hash === location.hash) {
      props.class = (props.class ? props.class + " " : "") + Link.activeClass
    }
    props.href = hash
    delete props.to
    return h("a", props, children)
  }

  Link.activeClass = "active"

  exports.hyperrouter = {
    Router,
    Route,
    Link
  }

} (this)
