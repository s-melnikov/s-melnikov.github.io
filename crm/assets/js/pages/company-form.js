define("pages/company-form", ["utils", "components"], (Utils, Components) => {
  const { h, Component } = preact;
  const { db } = Utils;
  const { Link, DescriptionList, Loader } = Components;

  class PageCompanyForm extends Component {
    componentWillMount() {
      let { uid } = this.props.params;
      if (uid) {
        db.collection("companies").find(uid).then(([company]) => {
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
        db.collection("companies").update(company, uid).then(() => {
          location.hash = "!/companies/" + uid
        });
      } else {
        db.collection("companies").push(company, ({ uid }) => {
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

  return PageCompanyForm;
});