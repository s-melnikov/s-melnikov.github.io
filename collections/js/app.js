require.vendors = {
  "hyperapp": "https://unpkg.com/hyperapp@0.17.1/dist/hyperapp.js"
}

require([
  "hyperapp",
  "utils/logger",
  "model",
  "components/layout"
], ({ h, app }, Logger, model, Layout) => {
  let { actions } = Logger(app)(model, Layout, document.body)
  addEventListener("hashchange", () => {
    actions.setRoute(location.hash.slice(2))
  })
})
