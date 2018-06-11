define("pages/leads", ["utils", "components"], (Utils, Components) => {
  const { h, Component } = preact;
  const { db } = Utils;
  const { Link, Loader } = Components;

  class PageEmployees extends Component {
    constructor(props) {
      super(props);
      this.state.leads = null;
    }
    componentWillMount() {
      db.collection("leads").find().then(leads => {
        this.setState({ leads });
      });
    }
    render() {
      return h("div", { key: "page-leads", class: "view" },
        h("div", { class: "controls" },
          h(Link, { class: "btn btn-link", to: "/leads/new" }, "New lead")
        ),
        this.state.leads ?
          h("table", { class: "table table-striped table-hover" },
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
                    h(Link, { class: "btn btn-sm btn-link", to: "/leads/" + lead.uid + "/edit" }, "Edit"),
                    h(Link, { class: "btn btn-sm btn-link", to: "/leads/" + lead.uid + "/delete" }, "Delete"),
                  )
                )
              )
            )
          ) :
          h(Loader)
      )
    }
  }
  return PageEmployees;
});