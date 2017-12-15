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
      "^" + path.slice(1).replace(/\//g, "\\/").replace(/:([\w]+)/g, function(_, key) {
        keys.push(key.toLowerCase())
        return "([-\\.%\\w\\(\\)]+)"
      }) + "$"),
    match = regex.exec(route)
  if (match) {
    keys.map((key, i) => params[key] = match[i + 1].toLowerCase())
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