define("pages/lead", ["utils", "components"], (Utils, Components) => {
  const { h, Component } = preact;
  const { db } = Utils;
  const { Link, Loader, DescriptionList } = Components;

  class PageLead extends Component {
    componentWillMount() {
      let { uid } = this.props.params;
      db.collection("leads").find(uid).then(([lead]) => {
        this.setState({ lead });
        db.collection("companies")
          .find({ uid: lead.company })
          .then(([company = { name: "[ empty ]" }]) => {
            this.setState({ company });
          })
      });
    }
    render() {
      let { uid } = this.props.params;
      let { lead, company = {} } = this.state;
      return h("div", { key: "page-company-" + uid, class: "view" },
        h("div", { class: "controls" },
          h(Link, { class: "btn link", to: "/leads/" + uid + "/edit" }, "Edit"),
          h(Link, { class: "btn link red", to: "/leads/" + uid + "/delete" }, "Delete")
        ),
        lead ?
          h(DescriptionList, {
            list: [
              ["First name", lead.first_name],
              ["Last name", lead.last_name],
              ["Gender", lead.gender],
              ["Email", lead.email],
              ["Phone", lead.phone],
              ["Country", lead.country],
              ["City", lead.city],
              ["Street", lead.street],
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

  return PageLead;
});