if (!localStorage.hypercrm) {
  fetch("dump.json").then(resp => resp.text()).then(text => {
    db.restore(text);
    location.reload();
  });
}
const { h, render, Component } = preact;
const { Route, Link } = router;
const db = database("hypercrm");
db.refs = {
  companies: db.collection("companies"),
  employees: db.collection("employees"),
  tasks: db.collection("tasks"),
};
const Loader = () => h("div", { class: "loader" });
const DescriptionList = ({ list }) => {
  return h("div", { class: "description-list" },
    list.map(item => item && h("dl", null,
      h("dt", null, item[0]),
      h("dd", null, item[1])
    ))
  );
};
const ItemsList = ({ items, iterator }) => {
  if (!items) return h(Loader);
  if (!items.length) return h("span", null, "no items");
  return h("div", { class: "items-list" }, items.map(iterator));
};
const NotFoundPage = () => h(Layout, null,
  h("div", { class: "view" }, "404! Page not found")
);
const PageIndex = (state, actions) => {
  setTimeout(() => location.hash = "#!/companies", 0);
  return null;
};
class Router extends Component {
  constructor(props) {
    super(props);
    this.prepareRoutes();
  }
  prepareRoutes() {
    let { routes } = this.props;
    let paths = Object.keys(routes);
    this.routes = paths.map(path => {
      console.log(path)
      return {}
    });
  }
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
      h(Router, {
        routes: {
          "/": PageIndex,
          "/companies": PageCompanies,
          "/companies/:uid": PageCompany,
          "/companies/new": PageCompanyForm,
          "/companies/:uid/edit": PageCompanyForm
        }
      })
    );
  }
};
class PageCompanies extends Component {
  constructor(props) {
    super(props);
    this.state.companies = null;
  }
  componentWillMount() {
    db.refs.companies.find().then(companies => {
      this.setState({ companies });
    });
  }
  render() {
    return h("div", { key: "page-companies", class: "view" },
      h("div", { class: "controls" },
        h(Link, { class: "btn link", to: "/companies/new" }, "new company")
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
};
class PageCompany extends Component {
  componentWillMount() {
    let { uid } = this.props.match.params;
    db.refs.companies.find(uid).then(([company]) => {
      this.setState({ company });
    });
  }
  render() {
    let { uid } = this.props.match.params;
    let { company } = this.state;
    if (!company) {
      return h(Loader);
    }
    return h("div", { key: "page-company-" + uid, class: "view" },
      h("div", { class: "controls" },
        h(Link, { class: "btn link", to: "/companies/" + uid + "/edit" }, "edit"),
        h(Link, { class: "btn link red", to: "/companies/" + uid + "/delete" }, "delete")
      ),
      h(DescriptionList, {
        list: [
          ["Name", company.name],
          ["Industry", company.industry],
          ["Phone", company.phone],
          ["Country", company.country],
          ["City", company.city],
          ["Address", company.address],
          ["Emploees", h(EmploeesShortList, { where: { company: uid } })],
          ["Tasks", h(TasksShortList, { where: { company: uid } })]
        ]
      })
    );
  }
};
class PageCompanyForm extends Component {
  componentWillMount() {
    let { uid } = this.props.match.params;
    if (uid) {
      db.refs.companies.find(uid).then(([company]) => {
        this.setState({ company });
      });
    } else {
      this.setState({ company: {} });
    }
  }
  inputElement(name) {
    return h("input", {
      value: this.state.company[name],
      oninput: event => {
        let { company } = this.state;
        company[name] = event.target.value;
        this.setState({ company });
      }
    })
  }
  render() {
    let { company } = this.state;
    return company ?
      h(DescriptionList, {
        list: [
          ["Name", company.name],
          ["Industry", company.industry],
          ["Phone", company.phone],
          ["Country", company.country],
          ["City", company.city],
          ["Address", company.address]
        ]
      }) :
      h(Loader);
  }
}
class EmploeesShortList extends Component {
  componentWillMount() {
    let { where } = this.props;
    db.refs.employees.find(where).then(employees => {
      this.setState({ employees });
    });
  }
  render() {
    let { employees } = this.state;
    return employees ?
      h(ItemsList, {
        items: employees,
        iterator: emploee => h("div", null,
          h(Link, { to: "/employees/" + emploee.uid },
            emploee.first_name + " " + emploee.last_name)
        )
      }) :
      h(Loader);
  }
}
class TasksShortList extends Component {
  componentWillMount() {
    let { where } = this.props;
    db.refs.tasks.find(where).then(tasks => {
      this.setState({ tasks });
    });
  }
  render() {
    let { tasks } = this.state;
    return tasks ?
      h(ItemsList, {
        items: tasks,
        iterator: task => h("div", null, task.content)
      }) :
      h(Loader);
  }
}
render(h(Main), document.body.querySelector("#root"));