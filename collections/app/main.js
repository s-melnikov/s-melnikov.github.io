const { h, app } = hyperapp
let state = {
  count: 0
}
let actions = {
  down: state => ({ count: state.count - 1 }),
  up: state => ({ count: state.count + 1 })
}
let view = (state, actions) => h("main", null,
  h("h1", null, state.count),
  h("button", { onclick: actions.down }, "-"),
  h("button", { onclick: actions.up }, "+")
)
app({
  state,
  actions,
  view
})