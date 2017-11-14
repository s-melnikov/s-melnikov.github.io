function createStore(reducer, initialState) {

  var store = {
    state: initialState || {},
    subscribers: []
  }

  return {

    subscribe: function(name, handler) {
      store.subscribers.push({
        name: name,
        handler: handler
      })
    },

    unsubscribe: function(name) {
      store.subscribers.forEach(function(el, index) {
        if (el.name === name) {
          store.subscribers.splice(index, 1)
        }
      })
    },

    dispatch: function(action) {
      store.state = reducer(store.state, action)
      store.subscribers.forEach(function(el) {
        el.handler(store.state, action)
      })
    },

    getState: function() {
      return store.state
    },

    setState: function(state) {
      store.state = state
    }

  }

}
