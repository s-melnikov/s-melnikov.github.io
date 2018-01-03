/*
* The reason for this is just a thought exercise
* often people(myself super included) are so confused
* when trying something new, but breaking it down
* to it's simplest existence can be the best way to understand
*/
const createStore = (reducer, initialState = {}) => {
	let state = initialState
	let subscribers = []
	return {
    subscribe(listener) {
  		subscribers.push(listener)
  		return () => subscribers = subscribers.slice(subscribers.indexOf(listener) + 1, 1)
  	},
    dispatch(action) {
  		state = reducer(state, action)
  		subscribers.forEach(subscriber => subscriber(state, action))
  		return action
  	},
		getState() {
      return state
    },
    setState(newSatet) {
      state = newState
    }
	}
}


let initialState = {
	name: "Conor",
	redux: "awesome"
}

let myReducer = (state, action) => {
	let newState = Object.assign({}, state)
	switch (action.type) {
		case "CHANGE_NAME":
			newState.name = action.name
			break
		case "CHANGE_REDUX_ADJECTIVE":
			newState.redux = action.adjective
			break
		default:
			// do nothing
	}
	return newState
}

let store = createStore(myReducer, initialState)

console.log(store.getState(), "initial state")

let unsubscribe = store.subscribe(() => {
	console.log("i'll console state changes twice then unsubscribe so you will not be notified of the third dispatch", store.getState())
})

store.dispatch({
	type: "CHANGE_NAME",
	name: "Conor Hastings"
})

store.dispatch({
	type: "CHANGE_REDUX_ADJECTIVE",
	adjective: "great"
})

unsubscribe()

store.dispatch({
	type: "CHANGE_NAME",
	name: "Conor Cool Guy"
})

console.log("the state changed but since we unsubscribed the listener above was not notified o the final dispatch", store.getState())
