const PageAccounts = (state, actions) => {
  let slice_end = (state.route.params.page || 1) * ITEMS_PER_PAGE;
  let slice_start = slice_end - ITEMS_PER_PAGE;
  let types = {};
  let sources = {};
  let sectors = {};
  (state.items.account_types || []).forEach(type => types[type.name] = type.title);
  (state.items.account_sources || []).forEach(type => sources[type.name] = type.title);
  (state.items.account_sectors || []).forEach(type => sectors[type.name] = type.title);
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
                h("td", null, types[account.type]),
                h("td", null, account.owner || "none"),
                h("td", null, sources[account.source]),
                h("td", null, sectors[account.sector]),
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