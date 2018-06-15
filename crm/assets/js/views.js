const { h } = hyperapp;

const Page = ({ name }, children) => (state, actions) => {
  return h("div", { class: "main" },
    h("div", { class: "container"},
      h("div", {
        key: "page-" + name,
        oncreate: actions.pages[name].create,
        onupdate: actions.pages[name].update,
        onremove: actions.pages[name].remove,
        ondestroy: actions.pages[name].destroy
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
              h(Link, { to: "/leads" }, "Leads")
            )
          )
        )
      ),
    )
  );
}

const PageLeads = (state, actions) => h(Page, { name: "leads" },
  h("div", { class: "page-header" },
    h("h1", { class: "page-title" }, "Leads")
  ),
  h("div", { class: "card" },
    h("div", { class: "card-header" },
      h("div", { class: "card-title" }),
      h("div", { class: "card-header-control" },
        h(Link, { class: "btn", to: "/leads/new" }, "New lead")
      )
    ),
    state.leads ?
      h("table", { class: "table card-table" },
        h("thead", null,
          h("tr", null,
            h("th", null, "First name"),
            h("th", null, "Last name"),
            h("th", null, "Phone"),
            h("th", null, "Email"),
            h("th", null, "Birthday"),
            h("th", null, "Gender"),
            h("th", null, "Status"),
            h("th", null, "Action")
          )
        ),
        h("tbody", null,
          state.leads.slice(0, 30).map(lead =>
            h("tr", null,
              h("td", null, h(Link, { to: "/leads/" + lead.uid }, lead.first_name)),
              h("td", null, h(Link, { to: "/leads/" + lead.uid }, lead.last_name)),
              h("td", null, lead.phone),
              h("td", null, lead.email),
              h("td", null, lead.birthdate),
              h("td", null, lead.gender),
              h("td", null, lead.status),
              h("td", null,
                h(Link, { class: "link", to: "/leads/" + lead.uid + "/edit" }, "Edit"),
                h(Link, { class: "link", to: "/leads/" + lead.uid + "/delete" }, "Delete"),
              )
            )
          )
        )
      ) :
      h(Loader)
  )
);

const PageLeadForm = (state, actions) => h(Page, { name: "lead-form" },
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

const PageLead = () => h("div", null, "PageLead");
const PageDelete = () => h("div", null, "PageDelete");
const PageNotFound = () => h("div", null, "PageNotFound");