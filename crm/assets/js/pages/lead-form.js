define("pages/lead-form", ["utils", "components"], (Utils, Components) => {
  const { h, Component } = preact;
  const { db } = Utils;
  const { Link, Loader, DescriptionList } = Components;

  class PageLeadForm extends Component {
    componentWillMount() {
      let { uid } = this.props.params;
      if (uid) {
        db.collection("leads").find(uid).then(([lead]) => {
          this.setState({ lead });
        });
      } else {
        this.setState({ lead: {} });
      }
    }
    inputElement(name) {
      return h("input", {
        value: this.state.lead[name],
        onchange: ({ target }) => {
          let lead = Object.assign({}, this.state.lead, { [name]: target.value });
          this.setState({ lead });
        }
      })
    }
    saveEntry() {
      let { uid } = this.props.params;
      let { lead } = this.state;
      if (uid) {
        db.collection("leads").update(lead, uid).then(() => {
          location.hash = "!/leads/" + uid
        });
      } else {
        db.collection("leads").push(lead, ({ uid }) => {
          location.hash = "!/leads/" + uid
        });
      }
    }
    render() {
      let { uid } = this.props;
      let { lead } = this.state;
      return h("div", { key: "page-lead-" + (uid || "new"), class: "view" },
        h("div", { class: "controls" },
          h("span", { class: "btn link", onClick: () => { this.saveEntry() } }, "Save"),
          h(Link, { class: "btn link red", to: "/" }, "Cancel")
        ),
        lead ?
          h(DescriptionList, {
            class: "edit-form",
            list: [
              ["First name", this.inputElement("first_name")],
              ["Last name", this.inputElement("last_name")]
            ]
          }) :
          h(Loader)
      );
    }
  }

  return PageLeadForm;
});