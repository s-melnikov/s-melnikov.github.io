const Layout = (state, actions) => {
  return h("div", { class: "main" },
    h("div", { class: "container"},
      "!!!!"
    ),
    h("div", { id: "header" })
  );
}

const PageLeads = (state, actions) => {
  console.log(1, state, actions)
  return h(Views.Main, { state, actions },
    h("div", { class: "page page-leads" },
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
          this.state.leads ?
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
                this.state.leads.slice(0, 30).map(lead =>
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
      )
  );
}

/*

*/