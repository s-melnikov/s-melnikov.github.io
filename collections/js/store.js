const createStore = (reducer, initialState = {}) => {
  let state = initialState;
  let subscribers = [];
  return {
    subscribe(listener) {
      subscribers.push(listener);
      return () => subscribers = subscribers.slice(subscribers.indexOf(listener) + 1, 1);
    },
    dispatch(action) {
      state = reducer(state, action);
      subscribers.forEach(subscriber => subscriber(state, action));
      return action;
    },
    getState() {
      return state;
    },
    setState(newSatet) {
      state = newState;
    }
  }
}

let initialState = {
  users: [
    { id: 1, name: "Ivan Dorn" },
    { id: 2, name: "John Dave" },
    { id: 3, name: "Davi Juce" }
  ]
};

let actions = {
  ADD_USER: ({ user }, { users }) => {
    users.push(user);
    return { users };
  }
};

let myReducer = (state, action) => {
  let newState = Object.assign({}, state);
  if (actions[action.type]) {
    Object.assign(newState, actions[action.type](action, newState));
  }
  return newState;
}

const store = createStore(myReducer, initialState);
