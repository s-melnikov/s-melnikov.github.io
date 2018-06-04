define("pages/company", ["utils", "components"], (Utils, Components) => {
  const { h, Component } = preact;
  const { db } = Utils;
  const { Link, Loader, DescriptionList, EmployeesShortList } = Components;

  class PageCompany extends Component {
    componentWillMount() {
      let { uid } = this.props.params;
      db.collection("companies").find(uid).then(([company]) => {
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
  }

  return PageCompany;
});