define("pages/delete", ["utils", "components"], (Utils, Components) => {
  const { h, Component } = preact;
  const { db } = Utils;
  const { Loader, Link } = Components;

  class PageDelete extends Component {
    componentWillMount() {
      let { type, uid } = this.props.params;
      db.collection(type).find(uid).then(([entry]) => {
        this.setState({ entry });
      });
    }
    deleteItem() {
      let { type, uid } = this.props.params;
      db.collection(type).delete(uid);
    }
    render() {
      let { type, uid } = this.props.params;
      let { entry } = this.state;
      return h("div", { key: "page-delete-" + type + "-" + uid, class: "view delete-view" },
        h("p", null, `Are you sure to delete this entry: ${type} - ${uid}?`),
        h("div", { class: "controls" },
          h(Link, { class: "btn link", onclick: () => this.deleteItem(), to: "/" + type }, "Yes"),
          h(Link, { class: "btn link red", to: "/" + type + "/" + uid }, "No")
        )
      );
    }
  }

  return PageDelete;
});