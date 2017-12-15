function Logger(app) {
  return (model, view, container) => {
    model.actions = enhance(model.actions)
    return app(model, view, container)
    function enhance(actions, prefix) {
      let namespace = prefix ? prefix + "." : ""
      return Object.keys(actions || {}).reduce((otherActions, name) => {
        let namedspacedName = namespace + name, action = actions[name]
        otherActions[name] = typeof action === "function" ? data => (state, actions) => {
          let result = action(data)
          result = typeof result === "function" ? result(state, actions) : result
          log(state,{ name: namedspacedName, data: data }, result)
          return result
        } : enhance(action, namedspacedName)
        return otherActions
      }, {})
    }
    function log(prevState, action, nextState) {
      console.groupCollapsed("%c action", "color: gray; font-weight: lighter;", action.name)
      console.log("%c prev state", "color: #9E9E9E; font-weight: bold;", prevState)
      console.log("%c data", "color: #03A9F4; font-weight: bold;", action.data)
      console.log("%c next state", "color: #4CAF50; font-weight: bold;", nextState)
      console.groupEnd()
    }
  }
}

const Router1 = options => {
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
            routes[i].keys.map((key, i) => params[key] = match[i + 1].toLowerCase())
            props.view = routes[i].view
            return { params, pathname }
          }
        }
      },
      go() {}
    }
    if (props.view.length) {
      Object.keys(props.view).map(path => {
        let keys = []
        routes.push({
          rgx: RegExp(path === "*" ? ".*" : "^" +
            path.replace(/\//g, "\\/").replace(/:([\w]+)/g, function(_, key) {
              keys.push(key.toLowerCase())
              return "([-\\.%\\w\\(\\)]+)"
            }) + "/?$"),
          view: props.view[path],
          keys
        })
      })
    }
    return props
  }
}