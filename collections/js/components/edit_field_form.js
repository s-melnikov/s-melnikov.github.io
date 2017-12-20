define("components/edit_field_form", [
  "hyperapp",
  "components/modal"
], ({ h }, Modal) => {

  let EditFieldForm = params => {

    console.log(params)

    return h("div", null, "Lorem ipsum dolor")

    return h(Modal, {
      title: "Edit field",
      content: h("div", null, "Lorem ipsum dolor sit amet!"),
      footer: [h("button", null, "Send"), h("button", { class: "red" }, "Cancel")]
    })
  }

  return EditFieldForm

})
