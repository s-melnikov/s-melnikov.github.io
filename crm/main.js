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
  employees: db.collection("employees"),
  tasks: db.collection("tasks"),
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
    let { uid } = this.props.params;
    db.refs.companies.find(uid).then(([company]) => {
      this.setState({ company });
    });
  }
  render() {
    let { uid } = this.props.params;
    let { company } = this.state;
    if (!company) {
      return h(Loader);
    }
    return h("div", { key: "page-company-" + uid, class: "view" },
      h("div", { class: "controls" },
        h(Link, { class: "btn link", to: "/companies/" + uid + "/edit" }, "eEit"),
        h(Link, { class: "btn link red", to: "/companies/" + uid + "/delete" }, "Delete")
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
  render() {
    let { uid } = this.props;
    let { company } = this.state;
    return h("div", { key: "page-company-" + (uid || "new"), class: "view" },
      h("div", { class: "controls" },
        h(Link, { class: "btn link", to: "/" }, "Save"),
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