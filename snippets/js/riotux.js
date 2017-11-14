var riotux = {

  _store: {
    state: {},

    actions: {},

    components: []
  },

  subscribe: function(component, handler) {
    riotux._store.components.push({
      component: component,
      handler: handler
    })
  },

  unsubscribe: function(component) {
    riotux._store.components.forEach(function(el, index) {
      if (el.component === component) {
        riotux._store.components.splice(index, 1)
      }
    })
  },

  dispatch: function(action, data) {
    var
      args = [].slice.call(arguments, 1),
      value = riotux._store.actions[action](riotux._store.state, data),
      state = { action: action, value: value }
    riotux._store.components.forEach(function(el, i) {
      if (el.component !== undefined && typeof el.handler === "function") {
        el.handler(state)
      }
    })
  },

  setState: function(data) {
    return Object.assign(riotux._store.state, data)
  },

  getState: function(stateName) {
    return riotux._store.state[stateName]
  },

  setActions: function(data) {
    return Object.assign(riotux._store.actions, data)
  }
}
