const createStore = (reducer, state = {}) => {
  let subscribers = []
  return {
    subscribe(name, handler) {
      subscribers.push({ name, handler })
    },
    unsubscribe(name) {
      subscribers.forEach((el, index) => {
        if (el.name === name) {
          subscribers.splice(index, 1)
        }
      })
    },
    dispatch(action) {
      state = reducer(state, action)
      subscribers.forEach((el) => {
        el.handler(state, action)
      })
    },
    getState() {
      return state
    },
    setState(_state) {
      state = _state
    }
  }
}