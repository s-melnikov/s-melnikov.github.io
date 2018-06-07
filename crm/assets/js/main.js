define("main", ["components", "pages"], (Components, Pages) => {
  const { h, Component } = preact;
  const { Link, Router } = Components;
  const {
    PageNotFound,
    PageIndex,
    PageCompanies,
    PageCompany,
    PageCompanyForm,
    PageEmployees,
    PageEmployeeForm,
    PageEmployee,
    PageDelete
  } = Pages;

  class Main extends Component {
    render() {
      return h("div", { class: "main" },
        h("div", { id: "sidebar" },
          h(Link, { class: "btn btn-link btn-block text-left", to: "/companies" }, "Companies"),
          h(Link, { class: "btn btn-link btn-block text-left", to: "/employees" }, "Employees")
        ),
        h(Router, {
          routes: {
            "/": PageIndex,
            "/companies": PageCompanies,
            "/companies/new": PageCompanyForm,
            "/companies/:uid": PageCompany,
            "/companies/:uid/edit": PageCompanyForm,
            "/employees": PageEmployees,
            "/employees/new": PageEmployeeForm,
            "/employees/:uid": PageEmployee,
            "/employees/:uid/edit": PageEmployeeForm,
            "/:type/:uid/delete": PageDelete,
            "*": PageNotFound
          }
        })
      );
    }
  }

  return Main;
});