require.vendors = {
  "hyperapp": "https://unpkg.com/hyperapp@1.0.1/dist/hyperapp.js"
}

if (location.search.indexOf("install") != -1) {
  require(["utils/install"], () => {})
} else {
  require([
    "hyperapp",
    "utils/logger",
    "actions",
    "components/layout"
  ], ({ h, app }, Logger, actions, Layout) => {

    let state = {
      route: location.hash.slice(2),
      user: { first_name: "Jonh", last_name: "Doe" },
      collections: null,
      collection: null,
      entries: null
    }

    let main = Logger(app)(state, actions, Layout, document.body)
    addEventListener("hashchange", () => {
      main.actions.setRoute(location.hash.slice(2))
    })
  })

}
