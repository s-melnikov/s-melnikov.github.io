define("components/modal", ["hyperapp"], ({ h }) => {

  let Modal = params => {
    return h("div", { class: "modal" },
      h("div", { class: "modal-body" },
        h("div", { class: "modal-header" },
          h("div", { class: "modal-title" }, params.title || null),
          h("div", {
            class: "modal-close",
            onclick: params.close || null
           }, "×")
        ),
        h("div", { class: "modal-content" }, params.content || null),
        h("div", { class: "modal-footer" }, params.footer || null)
      )
    )
  }

  return Modal

})
