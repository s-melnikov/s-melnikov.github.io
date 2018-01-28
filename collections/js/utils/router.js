const createRouter = routes => {
  routes = Object.keys(routes).map(path => {
    let keys = [],
      regex = RegExp(path === "*" ? ".*" :
        "^" + path.replace(/:([\w]+)/g, function(_, key) {
          keys.push(key.toLowerCase())
          return "([-\\.%\\w\\(\\)]+)"
        }) + "$")
    return { regex, keys, component: routes[path] }
  })
  return (state, actions) => {
    return routes.map(({ regex, keys, component }) => {
      let route = state.route || "/"
      let match, params = {}
      if (match = regex.exec(route)) {
        keys.map((key, i) => params[key] = (match[i + 1] || "").toLowerCase())
        return component(state, actions, params)
      }
      return null
    })
  }
}
