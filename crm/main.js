// fetch("dump.json").then(resp => resp.text()).then(text => db.restore(text));
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
        h(Route, { exact: true, path: "/companies/:uid", component: PageCompany })
      )
    );
  }
};
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
    this.state = {
      company: null,
      isEdit: false
    };
  }
  componentWillMount() {
    let uid = this.props.match.params.uid;
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
  render() {
    let { uid, action } = this.props.match.params;
    let isEdit = action == "edit";
    return h("div", { key: "page-company-" + uid, class: "view" },
      this.state.company ? [
        isEdit ? h("div", null,
          h(Link, { to: "/companies/" + key, class: "btn",
            onclick: event => {
              if (isNew) {
                event.preventDefault();
                db.refs.companies.push(company, entry => {
                  location.hash = "!/companies/" + entry.$key;
                });
                setEntries({ name: "companies", entries: null });
              } else {
                db.refs.companies.find(key).then(result => {
                  let entry = result.first();
                  if (entry) entry.update(company);
                });
              }
            },
          }, "save"),
          h(Link, { class: "btn red", to: "/companies/" + this.props.params.uid }, "cancel")
        ) : h("div", null,
          h(Link, { class: "btn link", to: "/companies/" + uid + "/edit" }, "edit"),
          h(Link, { class: "btn link red", to: "/companies/" + uid + "/delete" }, "delete")
        ),
        h(DescriptionList, { list: isEdit ? [
            ["Name", h("input", { value: this.state.company.name,
                onchange: event => this.state.company.name = event.target.value })],
            ["Industry", h("input", { value: this.state.company.industry,
                onchange: event => this.state.company.industry = event.target.value })],
            ["Phone", h("input", { value: this.state.company.phone,
                onchange: event => this.state.company.phone = event.target.value })],
            ["Country", h("input", { value: this.state.company.country,
                onchange: event => this.state.company.country = event.target.value })],
            ["City", h("input", { value: this.state.company.city,
                onchange: event => this.state.company.city = event.target.value })],
            ["Address", h("input", { value: this.state.company.address,
                onchange: event => this.state.company.address = event.target.value })]
          ] : [
            ["Name", this.state.company.name],
            ["Industry", this.state.company.industry],
            ["Phone", this.state.company.phone],
            ["Country", this.state.company.country],
            ["City", this.state.company.city],
            ["Address", this.state.company.address],
            ["Emploees", h(ItemsList, { items: this.state.employees,
                iterator: emploee => h("div", null,
                  h(Link, { to: "/employees/" + emploee.$key },
                    emploee.first_name + " " + emploee.last_name
                  )
                )
              })],
            ["Tasks", h(ItemsList, { items: this.state.tasks,
                iterator: task => h("div", null, task.content) })]
          ]
        })
      ] : h(Loader)
    );
  }
};
// let { companies, employees, tasks, route } = state;
// let { getEntries, setEntries } = actions;
// let { key, action } = route.params;
// let company = isNew ? {} : companies ? Object.assign({}, companies[0]) : null;
render(h(Main), document.body.querySelector("#root"));
if (!localStorage.hypercrm) {
  fetch("dump.json").then(resp => resp.json()).then(data => {
    database("hypercrm").restore(data);
  });
  location.reload();
}