const PageAccount = ({ account, account_types, account_sources, account_sectors, route }, actions) => {
  let { uid } = route.params;
  let types = {};
  let sources = {};
  let sectors = {};
  (account_types || []).forEach(type => types[type.name] = type.title);
  (account_sources || []).forEach(type => sources[type.name] = type.title);
  (account_sectors || []).forEach(type => sectors[type.name] = type.title);
  return h(Page, { name: "account"},
    h("div", { class: "page-header" },
      h("h1", { class: "page-title" }, "Account")
    ),
    h("div", { class: "card" },
      h("div", { class: "card-header" },
        h("div", { class: "card-title" }),
        h("div", { class: "card-header-control" },
          h(Link, { class: "btn btn-primary", to: `/accounts/${uid}/edit` }, "Edit")
        )
      ),
      account ?
        h("div", { class: "p-m" },
          h("div", { class: "columns" },
            h("div", { class: "column col-4" },
              h("div", { class: "columns p-s" },
                h("div", { class: "column col-4 text-right" }, "Name"),
                h("div", { class: "column col-8" }, account.name),
              ),
              h("div", { class: "columns p-s" },
                h("div", { class: "column col-4 text-right" }, "Owner"),
                h("div", { class: "column col-8" }, account.owner || "None"),
              ),
              h("div", { class: "columns p-s" },
                h("div", { class: "column col-4 text-right" }, "Type"),
                h("div", { class: "column col-8" }, types[account.type]),
              ),
              h("div", { class: "columns p-s" },
                h("div", { class: "column col-4 text-right" }, "Source"),
                h("div", { class: "column col-8" }, sources[account.source]),
              ),
              h("div", { class: "columns p-s" },
                h("div", { class: "column col-4 text-right" }, "Sector"),
                h("div", { class: "column col-8" }, sectors[account.sector]),
              ),
              h("div", { class: "columns p-s" },
                h("div", { class: "column col-4 text-right" }, "Web Site"),
                h("div", { class: "column col-8" }, account.site),
              )
            ),
            h("div", { class: "column col-4" },
              h("div", { class: "columns p-s" },
                h("div", { class: "column col-4 text-right" }, "Phone"),
                h("div", { class: "column col-8" }, account.phone),
              ),
              h("div", { class: "columns p-s" },
                h("div", { class: "column col-4 text-right" }, "Address Line"),
                h("div", { class: "column col-8" }, account.line),
              ),
              h("div", { class: "columns p-s" },
                h("div", { class: "column col-4 text-right" }, "City"),
                h("div", { class: "column col-8" }, account.city),
              ),
              h("div", { class: "columns p-s" },
                h("div", { class: "column col-4 text-right" }, "County/State"),
                h("div", { class: "column col-8" }, account.state),
              ),
              h("div", { class: "columns p-s" },
                h("div", { class: "column col-4 text-right" }, "Postcode/Zip"),
                h("div", { class: "column col-8" }, account.zip),
              )
            )
          ),
          h("div", {}, "Notes"),
          h("div", {}, account.notes)
        ) :
        h(Loader)
    )
  );
};