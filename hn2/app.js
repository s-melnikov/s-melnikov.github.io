const { h, app } = hyperapp
const now = Date.now()
const pp = 30
const ttl = 1000 * 60 * 15
const types = ["top", "new", "best", "show", "ask", "job"]
let db = firebase.database().ref("/v0")
let cache = {
  stories: {},
  users: {}
}

const capitalize = str => str[0].toUpperCase() + str.slice(1)

const MainView = (state, actions) => h("div", {},
  ItemsListView(state, actions),
  h("header", {},
    h("div", { "class": "container" },
      types.map(type => h("a", {
          href: "#/" + type,
          "class": type == state.route[0] ? "active" : ""
        }, capitalize(type))
      )
    )
  ),
  state.loader && h("div", { class: "overlay" }, h("div", { class: "loader" }, h("span")))
)

const ItemsListView = (state, actions) => h("div", {
    class: "item-list",
    key: "list-" + state.route[0],
    oncreate: () => {
      console.log("onCreate:", state.route[0])
    }
  },
  state.route.join(" / ")
)

app({
  init: (_, actions) => {
    addEventListener("hashchange", actions.route)
    actions.route()
    actions.loader(false)
  },
  state: {
    route: [],
    loader: true
  },
  actions: {
    route: () => ({
      route: location.hash.slice(2).split("/")
    }),
    loader: (state, actions, show) => ({ loader: show })
  },
  view: MainView
}, document.querySelector("#root"))