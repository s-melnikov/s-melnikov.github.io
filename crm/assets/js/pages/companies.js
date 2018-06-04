define("pages/companies", ["utils", "components"], (Utils, Components) => {
  const { h, Component } = preact;
  const { db } = Utils;
  const { Link, Loader } = Components;

  class PageCompanies extends Component {
    constructor(props) {
      super(props);
      this.state.companies = null;
    }
    componentWillMount() {
      db.collection("companies").find().then(companies => {
        this.setState({ companies });
      });
    }
    render() {
      return h("div", { key: "page-companies", class: "view" },
        h("div", { class: "controls" },
          h(Link, { class: "btn link", to: "/companies/new" }, "New company")
        ),
        this.state.companies ?
          h("table", null,
            h("thead", null,
              h("tr", null,
                h("th", null, "Name"),
                h("th", null, "Industry"),
                h("th", null, "Phone")
              )
            ),
            h("tbody", null,
              this.state.companies.map(company =>
                h("tr", null,
                  h("td", null, h(Link, { to: "/companies/" + company.uid }, company.name)),
                  h("td", null, company.industry),
                  h("td", null, company.phone)
                )
              )
            )
          ) :
          h(Loader)
      )
    }
  }

  return PageCompanies;
});