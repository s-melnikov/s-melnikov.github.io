define("pages/leads", ["utils", "components"], (Utils, Components) => {
  const { h, Component } = preact;
  const { db } = Utils;
  const { Link, Loader } = Components;

  class PageEmployees extends Component {
    constructor(props) {
      super(props);
      this.state.leads = null;
    }
    componentWillMount() {
      db.collection("leads").find().then(leads => {
        this.setState({ leads });
      });
    }
  }
  return PageEmployees;
});