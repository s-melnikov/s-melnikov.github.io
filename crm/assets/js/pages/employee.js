define("pages/employee", ["utils", "components"], (Utils, Components) => {
  const { h, Component } = preact;
  const { db } = Utils;
  const { Link, Loader, DescriptionList } = Components;

  class PageEmployee extends Component {
    componentWillMount() {
      let { uid } = this.props.params;
      db.collection("employees").find(uid).then(([employee]) => {
        this.setState({ employee });
        db.collection("companies")
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
  }

  return PageEmployee;
});