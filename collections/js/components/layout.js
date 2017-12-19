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

  let FieldForm = params => {
    return h(Modal, {
      title: "Edit field",
      content: h("div", null, "Lorem ipsum dolor sit amet!"),
      footer: [h("button", null, "Send"), h("button", { class: "red" }, "Cancel")]
    })
  }

  let FormInput = props => h("input", props)

  return Layout
})
