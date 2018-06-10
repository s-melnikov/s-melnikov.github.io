define("pages/employees", ["utils", "components"], (Utils, Components) => {
  const { h, Component } = preact;
  const { db } = Utils;
  const { Link, Loader } = Components;

  class PageEmployees extends Component {
    constructor(props) {
      super(props);
      this.state.employees = null;
    }
    componentWillMount() {
      db.collection("employees").find().then(employees => {
        this.setState({ employees });
      });
    }
    render() {
      return h("div", { key: "page-employees", class: "view" },
        h("div", { class: "controls" },
          h(Link, { class: "btn btn-link", to: "/employees/new" }, "New employee")
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
  }
  return PageEmployees;
});