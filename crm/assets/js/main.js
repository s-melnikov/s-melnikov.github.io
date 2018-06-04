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
    PageEmployee
  } = Pages;

  class Main extends Component {
    render() {
      return h("div", { class: "main" },
        h("div", { class: "header" },
          h("div", { class: "tabs" },
            h(Link, { class: "tab", to: "/companies" }, "Companies"),
            h(Link, { class: "tab", to: "/employees" }, "Employees")
          )
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
            "*": PageNotFound
          }
        })
      );
    }
  }

  return Main;
});