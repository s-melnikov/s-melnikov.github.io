const { h } = hyperapp;
const ITEMS_PER_PAGE = 7;
const Page = ({ name }, children) => (state, actions) => {
  return h("div", { class: "main" },
    h("div", { class: "container"},
      h("div", {
        key: "page-" + name,
        oncreate: actions[`page-${name}-oncreate`],
        onupdate: actions[`page-${name}-onupdate`],
        onremove: actions[`page-${name}-onremove`],
        ondestroy: actions[`page-${name}-ondestroy`]
      }, children)
    ),
    h("div", { id: "header" },
      h("div", { class: "top-section" },
        h("div", { class: "container" },
          h("div", { class: "navbar" },
            h("div", { class: "navbar-section" },
              h(Link, { to: "/" },
                h("span", { class: "logo va-m" }),
                h("span", { class: "va-m" }, "SimpleCRM")
              )
            )
          )
        )
      ),
      h("div", { class: "bottom-section" },
        h("div", { class: "container" },
          h("div", { class: "navbar" },
            h("div", { class: "navbar-section nav" },
              h(Link, { to: "/accounts" }, "Accounts")
            )
          )
        )
      ),
    )
  );
}

const PageAccounts = (state, actions) => {
  let slice_end = (state.route.params.page || 1) * ITEMS_PER_PAGE;
  let slice_start = slice_end - ITEMS_PER_PAGE;
  return h(Page, { name: "accounts" },
    h("div", { class: "page-header" },
      h("h1", { class: "page-title" }, "Accounts")
    ),
    h("div", { class: "card" },
      h("div", { class: "card-header" },
        h("div", { class: "card-title" }),
        h("div", { class: "card-header-control" },
          h(Link, { class: "btn", to: "/accounts/new" }, "Add")
        )
      ),
      state.items.accounts ?
        h("table", { class: "table card-table" },
          h("thead", null,
            h("tr", null,
              h("th", null, "Name"),
              h("th", null, "Type"),
              h("th", null, "Owner"),
              h("th", null, "Source"),
              h("th", null, "Sector"),
              h("th", null, "Actions")
            )
          ),
          h("tbody", null,
            state.items.accounts.slice(slice_start, slice_end).map(account =>
              h("tr", null,
                h("td", null, h(Link, { to: "/accounts/" + account.uid }, account.name)),
                h("td", null, account.type),
                h("td", null, account.owner),
                h("td", null, account.source),
                h("td", null, account.sector),
                h("td", null,
                  h(Link, { class: "link", to: "/accounts/" + account.uid + "/edit" }, "Edit"),
                  h(Link, { class: "link", to: "/accounts/" + account.uid + "/delete" }, "Delete"),
                )
              )
            )
          )
        ) :
        h(Loader),
      h("div", { class: "card-footer centered" },
        state.items.accounts ? h(Pagination, {
          path: "/accounts/page/",
          current: state.route.params.page,
          length: state.items.accounts.length,
          per_page: ITEMS_PER_PAGE
        }) : null
      )
    )
  )
};

const PageAccountForm = (state, actions) => h(Page, { name: "lead-form" },
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

const PageAccount = () => h("div", null, "PageLead");
const PageDelete = () => h("div", null, "PageDelete");
const PageNotFound = () => h("div", null, "PageNotFound");