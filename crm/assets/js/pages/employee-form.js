define("pages/employee-form", ["utils", "components"], (Utils, Components) => {
  const { h, Component } = preact;
  const { db } = Utils;
  const { Link, Loader, DescriptionList } = Components;

  class PageEmployeeForm extends Component {
    componentWillMount() {
      let { uid } = this.props.params;
      if (uid) {
        db.collection("employees").find(uid).then(([employee]) => {
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
        db.collection("employees").update(employee, uid).then(() => {
          location.hash = "!/employees/" + uid
        });
      } else {
        db.collection("employees").push(employee, ({ uid }) => {
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

  return PageEmployeeForm;
});