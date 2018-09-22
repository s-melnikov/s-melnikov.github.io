class Riotux {
  constructor(initialState = {}) {
    this.state = initialState
    this.actions = {}
    this.components = []
  }
  subscribe(component, handler) {
    this.components.push({
      component: component,
      handler: handler
    })
  }
  unsubscribe(component) {
    this.components.forEach((item, index) => {
      if (item.component === component) {
        this.components.splice(index, 1)
      }
    })
  }
  dispatch: function(action, data) {
    let value = this.actions[action](this.state, data),
      state = { action: action, value: value }
    this.components.forEach(item => {
      if (item.component !== undefined && typeof item.handler === "function") {
        item.handler(state)
      }
    })
  }
  setState(state) {
    return Object.assign(this.state, state)
  }
  getState(name) {
    return this.state[name]
  }
  setActions(action) {
    return Object.assign(this.actions, action)
  }
}

let riotux = new Riotux({})
