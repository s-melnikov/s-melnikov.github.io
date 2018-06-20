const PageAccount = (state, actions) => {
  let types = {};
  let sources = {};
  let sectors = {};
  (state.items.account_types || []).forEach(type => types[type.name] = type.title);
  (state.items.account_sources || []).forEach(type => sources[type.name] = type.title);
  (state.items.account_sectors || []).forEach(type => sectors[type.name] = type.title);
  return h(Page, { name: "account"},
    h("div", { class: "page-header" },
      h("h1", { class: "page-title" }, "Account")
    ),
    h("div", { class: "card" },
      h("div", { class: "card-header" },
        h("div", { class: "card-title" }),
        h("div", { class: "card-header-control" },
          h(Link, { class: "btn btn-primary", to: "/accounts/" }, "Edit")
        )
      ),
      state.item.accounts ?
        h("div", { class: "p-m" },
          h("div", { class: "columns" },
            h("div", { class: "column col-4" },
              h("div", { class: "columns p-s" },
                h("div", { class: "column col-4 text-right" }, "Name"),
                h("div", { class: "column col-8" }, state.item.accounts.name),
              ),
              h("div", { class: "columns p-s" },
                h("div", { class: "column col-4 text-right" }, "Owner"),
                h("div", { class: "column col-8" }, state.item.accounts.owner || "None"),
              ),
              h("div", { class: "columns p-s" },
                h("div", { class: "column col-4 text-right" }, "Type"),
                h("div", { class: "column col-8" }, types[state.item.accounts.type]),
              ),
              h("div", { class: "columns p-s" },
                h("div", { class: "column col-4 text-right" }, "Source"),
                h("div", { class: "column col-8" }, sources[state.item.accounts.source]),
              ),
              h("div", { class: "columns p-s" },
                h("div", { class: "column col-4 text-right" }, "Sector"),
                h("div", { class: "column col-8" }, sectors[state.item.accounts.sector]),
              ),
              h("div", { class: "columns p-s" },
                h("div", { class: "column col-4 text-right" }, "Web Site"),
                h("div", { class: "column col-8" }, state.item.accounts.site),
              )
            ),
            h("div", { class: "column col-4" },
              h("div", { class: "columns p-s" },
                h("div", { class: "column col-4 text-right" }, "Phone"),
                h("div", { class: "column col-8" }, state.item.accounts.phone),
              ),
              h("div", { class: "columns p-s" },
                h("div", { class: "column col-4 text-right" }, "Address Line"),
                h("div", { class: "column col-8" }, state.item.accounts.line),
              ),
              h("div", { class: "columns p-s" },
                h("div", { class: "column col-4 text-right" }, "City"),
                h("div", { class: "column col-8" }, state.item.accounts.city),
              ),
              h("div", { class: "columns p-s" },
                h("div", { class: "column col-4 text-right" }, "County/State"),
                h("div", { class: "column col-8" }, state.item.accounts.state),
              ),
              h("div", { class: "columns p-s" },
                h("div", { class: "column col-4 text-right" }, "Postcode/Zip"),
                h("div", { class: "column col-8" }, state.item.accounts.zip),
              )
            )
          ),
          h("div", {}, "Notes"),
          h("div", {}, state.item.accounts.notes)
        ) :
        h(Loader)
    )
  );
};