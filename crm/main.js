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
        h(Route, { exact: true, path: "/", component: PageIndex }),
        h(Route, { exact: true, path: "/companies", component: PageCompanies }),
        h(Route, { exact: true, path: "/companies/:uid", component: PageCompany }),
        h(Route, { exact: true, path: "/companies/:uid/:action", component: PageCompany })
      )
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
  constructor(props) {
    super(props);
    this.state.company = null;
    this.state.isEdit = null;
  }
  componentWillMount() {
    let { uid } = this.props.match.params;
    if (uid == "new") {
      this.setState({
        company: {},
        employees: [],
        tasks: []
      });
    } else {
      db.refs.companies.find(uid).then(([company]) => {
        this.setState({ company });
      });
      db.refs.employees.find({ company: uid }).then(employees => {
        this.setState({ employees });
      });
      db.refs.tasks.find({ company: uid }).then(tasks => {
        this.setState({ tasks });
    });
    }
  }
  componentWillReciveProps() {

  }
  saveForm() {
    let { uid } = this.props.match.params;
    if (uid == "new") {
      db.refs.companies.push(company, entry => {
        // location.hash = "!/companies/" + entry.uid;
      });
    } else {
      db.refs.companies.update(company, uid).then(result => {});
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
    let { uid, action } = this.props.match.params;
    let { company, employees, tasks } = this.state;
    let isNew = uid == "new";
    let isEdit = action == "edit" || isNew;
    company = company ? Object.assign({}, company) : null;
    return h("div", { key: "page-company-" + uid, class: "view" },
      company ? [
        isEdit ? h("div", { class: "controls" },
          h(Link, { class: "btn link", to: "/companies/" + uid, onclick: this.saveForm }, "save"),
          h(Link, { class: "btn link red", to: "/companies/" + (isNew ? "" : uid) }, "cancel")
        ) : h("div", { class: "controls" },
          h(Link, { class: "btn link", to: "/companies/" + uid + "/edit" }, "edit"),
          h(Link, { class: "btn link red", to: "/companies/" + uid + "/delete" }, "delete")
        ),
        h(DescriptionList, { list: isEdit ? [
            ["Name", this.inputElement("name")],
            ["Industry", this.inputElement("industry")],
            ["Phone", this.inputElement("phone")],
            ["Country", this.inputElement("country")],
            ["City", this.inputElement("city")],
            ["Address", this.inputElement("address")]
          ] : [
            ["Name", company.name],
            ["Industry", company.industry],
            ["Phone", company.phone],
            ["Country", company.country],
            ["City", company.city],
            ["Address", company.address],
            ["Emploees", h(ItemsList, {
              items: employees,
              iterator: emploee => h("div", null,
                h(Link, { to: "/employees/" + emploee.$key },
                  emploee.first_name + " " + emploee.last_name)
              )
            })],
            ["Tasks", h(ItemsList, {
              items: tasks,
              iterator: task => h("div", null, task.content)
            })]
          ]
        })
      ] : h(Loader)
    );
  }
};
render(h(Main), document.body.querySelector("#root"));