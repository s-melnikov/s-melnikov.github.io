!function(exports) {

  function log(prevState, action, nextState) {
    console.groupCollapsed("%c action", "color: gray", action.name)
    console.log("%c prev state", "color:#9E9E9E", prevState)
    console.log("%c data", "color: #03A9F4", action.data)
    console.log("%c next state", "color:#4CAF50", nextState)
    console.groupEnd()
  }

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

  function Logger(app) {
    return (state, actions, view, container) => {
      actions = enhance(actions)
      return app(state, actions, view, container)
    }
  }

  exports.Logger = Logger
} (this)
