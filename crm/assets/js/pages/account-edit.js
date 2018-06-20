const PageAccountEdit = (state, actions) => h(Page, { name: "lead-form" },
  h("div", { class: "page-header" },
    h("h1", { class: "page-title" }, "Create new lead")
  ),
  h("div", { class: "card" },
    h("div", { class: "card-header" },
      h("div", { class: "card-title" }),
      h("div", { class: "card-header-control" },
        h(Link, { class: "btn", to: "/" }, "Save"),
        h(Link, { class: "btn", to: "/" }, "Cancel"),
      )
    ),
    h(Loader)
  )
);