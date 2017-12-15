let { h, app } = hyperapp

let storage = new Storage("my_app")

let model = {
  state: {
    route: location.hash.slice(3)
  },
  actions: {
    router: () => () => ({ route: location.hash.slice(3) })
  }
}

let layout = ({ state, actions }) => h("main", null, "Layout", h("p", null, state.route))
let blog = ({ state, actions }) => h("main", null, "Blog")
let post = ({ state, actions }) => h("main", null, "Post")

let { actions } = app(model, layout, document.body)
addEventListener("hashchange", () => {
  actions.router()
})