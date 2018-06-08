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
          h("ul", { class: "nav" },
            h("li", { class: "nav-item" },
              h(Link, { to: "/projects" }, "Projects")
            ),
            h("li", { class: "nav-item" },
              h(Link, { to: "/tasks" }, "Tasks")
            ),
            h("li", { class: "nav-item" },
              h(Link, { to: "/employees" }, "Employees")
            )
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
            "/:type/:uid/delete": PageDelete,
            "*": PageNotFound
          }
        }),
        h("div", { id: "header" })
      );
    }
  }

  return Main;
});