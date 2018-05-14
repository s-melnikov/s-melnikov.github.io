// fetch("dump.json").then(resp => resp.text()).then(text => db.restore(text));

const { h, render, Component, Router, Link } = gooact;
const db = database("hypercrm");

db.refs = {
  companies: db.collection("companies"),
  employees: db.collection("employees"),
  tasks: db.collection("tasks"),
}

const Loader = () => h("div", { class: "loader" });

const NotFoundPage = () => {
  return h(Layout, null,
    h("div", { class: "view" }, "404! Page not found")
  );
}

const PageIndex = (state, actions) => {
  setTimeout(() => location.hash = "#!/companies", 0);
  return null;
}

class Main extends Component {
  render() {
    return h("div", { class: "main" },
      h("div", { class: "header" },
        h("div", { class: "tabs" },
          h(Link, { class: "tab", to: "/companies" }, "Companies"),
          h(Link, { class: "tab", to: "/employees" }, "Employees")
        )
      ),
      h("div", { class: "content" },
        h(Router, null,
          h(PageIndex, { path: "/" }),
          h(PageCompanies, { path: "/companies" }),
        )
      )
    );
  }
}

class PageCompanies extends Component {
  constructor(props) {
    super(props);
    this.state = { companies: null };
  }
  componentWillMount() {
    db.refs.companies.find().then(companies => {
      this.setState({ companies });
    });
  }
  render() {
    console.log(this.state.companies)
    return h("div", { class: "view" },
      h("div", { class: "text-right" },
        h(Link, { class: "btn",
          to: "/companies/new" }, "new company")
      ),
      this.state.companies ? h("table", null,
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
      ) : h(Loader)
    )
  }
}

render(h(Main), document.body.querySelector("#main"));

if (!localStorage.hypercrm) {
  fetch("dump.json").then(resp => resp.json()).then(data => {
    database("hypercrm").restore(data);
  });
  location.reload();
}