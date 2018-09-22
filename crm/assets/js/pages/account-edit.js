const PageAccountEdit = ({ account, account_types, account_sources, account_sectors, route }, actions) => {
  let { uid } = route.params;

  return h(Page, { name: "lead-form" },
    h("div", { class: "page-header" },
      h("h1", { class: "page-title" }, "Create new lead")
    ),
    h("div", { class: "card" },
      h("div", { class: "card-header" },
        h("div", { class: "card-title" }),
        h("div", { class: "card-header-control" },
          h(Link, { class: "btn btn-primary" }, "Save"),
          h(BackLink, { class: "btn", }, "Cancel"),
        )
      ),
      h(Loader)
    )
  );
}