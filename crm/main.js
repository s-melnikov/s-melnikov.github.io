if (!localStorage.hypercrm) {
  fetch("dump.json").then(resp => resp.text()).then(text => {
    db.restore(text);
    location.reload();
  });
}
const { h, render, Component } = preact;
const getCurrentPath = () => location.hash.replace(/^#!|\/$/g, "") || "/";
const db = database("hypercrm");
db.refs = {
  companies: db.collection("companies"),
  employees: db.collection("employees")
};
const Loader = () => h("div", { class: "loader" });
const DescriptionList = props => {
  return h("div", {
      class: "description-list" + (props.class ? (" " + props.class) : "")
    },
    props.list.map(item => item && h("dl", null,
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
class Router extends Component {
  constructor(props) {
    super(props);
    this.prepareRoutes();
    this.hashChangeHandler = this.hashChangeHandler.bind(this);
  }
  componentWillMount() {
    this.state.path = getCurrentPath();
    addEventListener("hashchange", this.hashChangeHandler);
  }
  componentWillUnmount() {
    removeEventListener("hashchange", this.hashChangeHandler);
  }
  hashChangeHandler() {
    this.setState({ path: getCurrentPath() });
  }
  prepareRoutes() {
    let { routes } = this.props;
    let paths = Object.keys(routes);
    this.routes = paths.map(path => {
      let keys = [];
      let component = routes[path];
      let regexp = RegExp(path === "*" ? ".*" :
        "^" + path.replace(/:([\w]+)/g, (_, key) => {
          keys.push(key);
          return "([-\\.%\\w\\(\\)]+)";
        }) + "$");
      return { regexp, keys, component };
    });
  }
  render() {
    let { path } = this.state;
    let match, params = {};
    for (let i = 0; i < this.routes.length; i++) {
      let { regexp, keys, component } = this.routes[i];
      if (match = regexp.exec(path)) {
        keys.map((key, i) => params[key] = match[i + 1] || "");
        return h(component, { params });
      }
    }
    return null;
  }
}
class Link extends Component {
  constructor(props) {
    super(props);
    this.hashChangeHandlerBinded = this.hashChangeHandler.bind(this);
  }
  componentWillMount() {
    addEventListener("hashchange", this.hashChangeHandlerBinded);
  }
  componentWillUnmount() {
    removeEventListener("hashchange", this.hashChangeHandlerBinded);
  }
  hashChangeHandler() {
    this.forceUpdate();
  }
  render() {
    let { children, to, activeClass, onclick } = this.props;
    let href = "#!" + to;
    let _active = to == getCurrentPath() ? (activeClass || "active ") : "";
    return h("a", { href, onclick, class: _active + this.props.class }, children);
  }
}
class Redirect extends Component {
  componentDidMount() {
    setTimeout(() => location.hash = "!" + this.props.to);
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
          "/companies/new": PageCompanyForm,
          "/companies/:uid": PageCompany,
          "/companies/:uid/edit": PageCompanyForm,
          "/employees": PageEmployees,
          "/employees/new": PageEmployeeForm,
          "/employees/:uid": PageEmployee,
          "/employees/:uid/edit": PageEmployeeForm,
          "*": PageNotFound
        }
      })
    );
  }
};
const PageNotFound = () => h("div", { class: "view" }, "404! Page not found");
class PageIndex extends Component {
  render() {
    return h(Redirect, { to: "/companies" });
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
};
class PageCompany extends Component {
  componentWillMount() {
    let { uid } = this.props.params;
    db.refs.companies.find(uid).then(([company]) => {
      this.setState({ company });
    });
  }
  render() {
    let { uid } = this.props.params;
    let { company } = this.state;
    return h("div", { key: "page-company-" + uid, class: "view" },
      h("div", { class: "controls" },
        h(Link, { class: "btn link", to: "/companies/" + uid + "/edit" }, "Edit"),
        h(Link, { class: "btn link red", to: "/companies/" + uid + "/delete" }, "Delete")
      ),
      company ?
        h(DescriptionList, {
          list: [
            ["Name", company.name],
            ["Industry", company.industry],
            ["Phone", company.phone],
            ["Country", company.country],
            ["City", company.city],
            ["Address", company.address],
            ["Employees", h(EmployeesShortList, { where: { company: uid } })]
          ]
        }) :
        h(Loader)
    );
  }
};
class PageCompanyForm extends Component {
  componentWillMount() {
    let { uid } = this.props.params;
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
      onchange: ({ target }) => {
        let company = Object.assign({}, this.state.company, { [name]: target.value });
        this.setState({ company });
      }
    })
  }
  saveEntry() {
    let { uid } = this.props.params;
    let { company } = this.state;
    if (uid) {
      db.refs.companies.update(company, uid).then(() => {
        location.hash = "!/companies/" + uid
      });
    } else {
      db.refs.companies.push(company, ({ uid }) => {
        location.hash = "!/companies/" + uid
      });
    }
  }
  render() {
    let { uid } = this.props;
    let { company } = this.state;
    return h("div", { key: "page-company-" + (uid || "new"), class: "view" },
      h("div", { class: "controls" },
        h("span", { class: "btn link", onClick: () => { this.saveEntry() } }, "Save"),
        h(Link, { class: "btn link red", to: "/" }, "Cancel")
      ),
      company ?
        h(DescriptionList, {
          class: "edit-form",
          list: [
            ["Name", this.inputElement("name")],
            ["Industry", this.inputElement("industry")],
            ["Phone", this.inputElement("phone")],
            ["Country", this.inputElement("country")],
            ["City", this.inputElement("city")],
            ["Address", this.inputElement("address")]
          ]
        }) :
        h(Loader)
    );
  }
}
class PageEmployees extends Component {
  constructor(props) {
    super(props);
    this.state.employees = null;
  }
  componentWillMount() {
    db.refs.employees.find().then(employees => {
      this.setState({ employees });
    });
  }
  render() {
    return h("div", { key: "page-employees", class: "view" },
      h("div", { class: "controls" },
        h(Link, { class: "btn link", to: "/employees/new" }, "New employee")
      ),
      this.state.employees ?
        h("table", null,
          h("thead", null,
            h("tr", null,
              h("th", null, "Name"),
              h("th", null, "Phone"),
              h("th", null, "Email")
            )
          ),
          h("tbody", null,
            this.state.employees.map(employee =>
              h("tr", null,
                h("td", null, h(Link, { to: "/employees/" + employee.uid },
                  employee.first_name + " " + employee.last_name)),
                h("td", null, employee.phone),
                h("td", null, employee.email)
              )
            )
          )
        ) :
        h(Loader)
    )
  }
};
class PageEmployee extends Component {
  componentWillMount() {
    let { uid } = this.props.params;
    db.refs.employees.find(uid).then(([employee]) => {
      this.setState({ employee });
      db.refs.companies
        .find({ uid: employee.company })
        .then(([company = { name: "[ empty ]" }]) => {
          this.setState({ company });
        })
    });
  }
  render() {
    let { uid } = this.props.params;
    let { employee, company = {} } = this.state;
    return h("div", { key: "page-company-" + uid, class: "view" },
      h("div", { class: "controls" },
        h(Link, { class: "btn link", to: "/employees/" + uid + "/edit" }, "Edit"),
        h(Link, { class: "btn link red", to: "/employees/" + uid + "/delete" }, "Delete")
      ),
      employee ?
        h(DescriptionList, {
          list: [
            ["First name", employee.first_name],
            ["Last name", employee.last_name],
            ["Gender", employee.gender],
            ["Email", employee.email],
            ["Phone", employee.phone],
            ["Country", employee.country],
            ["City", employee.city],
            ["Street", employee.street],
            ["Company", company.uid ?
              h(Link, { to: "/companies/" + company.uid }, company.name) :
              company.name
            ]
          ]
        }) :
        h(Loader)
    );
  }
};
class PageEmployeeForm extends Component {
  componentWillMount() {
    let { uid } = this.props.params;
    if (uid) {
      db.refs.employees.find(uid).then(([employee]) => {
        this.setState({ employee });
      });
    } else {
      this.setState({ employee: {} });
    }
  }
  inputElement(name) {
    return h("input", {
      value: this.state.employee[name],
      onchange: ({ target }) => {
        let employee = Object.assign({}, this.state.employee, { [name]: target.value });
        this.setState({ employee });
      }
    })
  }
  saveEntry() {
    let { uid } = this.props.params;
    let { employee } = this.state;
    if (uid) {
      db.refs.employees.update(employee, uid).then(() => {
        location.hash = "!/employees/" + uid
      });
    } else {
      db.refs.employees.push(employee, ({ uid }) => {
        location.hash = "!/employees/" + uid
      });
    }
  }
  render() {
    let { uid } = this.props;
    let { employee } = this.state;
    return h("div", { key: "page-employee-" + (uid || "new"), class: "view" },
      h("div", { class: "controls" },
        h("span", { class: "btn link", onClick: () => { this.saveEntry() } }, "Save"),
        h(Link, { class: "btn link red", to: "/" }, "Cancel")
      ),
      employee ?
        h(DescriptionList, {
          class: "edit-form",
          list: [
            ["First name", this.inputElement("first_name")],
            ["Last name", this.inputElement("last_name")],
            ["Gender", this.inputElement("gender")],
            ["Email", this.inputElement("email")],
            ["Phone", this.inputElement("phone")],
            ["Country", this.inputElement("country")],
            ["City", this.inputElement("city")],
            ["Street", this.inputElement("street")]
          ]
        }) :
        h(Loader)
    );
  }
}
class EmployeesShortList extends Component {
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
        iterator: employee => h("div", null,
          h(Link, { to: "/employees/" + employee.uid },
            employee.first_name + " " + employee.last_name)
        )
      }) :
      h(Loader);
  }
}
render(h(Main), document.body.querySelector("#root"));