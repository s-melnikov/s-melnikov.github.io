define("components/layout", [
  "hyperapp",
  "components/router",
  "components/main"
], ({ h }, { Link }, Main) => {

  let Layout = ({ state, actions }) => {
    return h("div", { class: "layout" },
      h(state.user ? Main : SignIn, { state, actions })
    )
  }

  let SignIn = ({ state, actions }) => {
    return h("div", { class: "sign-in" }, "Sign In")
  }

  return Layout
})
