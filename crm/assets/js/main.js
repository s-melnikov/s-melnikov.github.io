define("main", ["components", "pages"], (Components, Pages) => {
  const { h, Component } = preact;
  const { Link, Router } = Components;
  const {
    PageNotFound,
    PageLeads,
    PageLeadForm,
    PageLead,
    PageDelete
  } = Pages;

  class Main extends Component {
    render() {
      return h("div", { class: "main" },
        h(Router, {
          routes: {
            "/": PageLeads,
            "/leads": PageLeads,
            "/leads/new": PageLeadForm,
            "/leads/:uid": PageLead,
            "/leads/:uid/edit": PageLeadForm,
            "/leads/:uid/delete": PageDelete,
            "*": PageNotFound
          }
        }),
        h("div", { id: "header" })
      );
    }
  }

  return Main;
});