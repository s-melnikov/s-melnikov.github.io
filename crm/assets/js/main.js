define("main", ["components", "pages"], (Components, Pages) => {
  const { h, Component } = preact;
  const { Link, Router } = Components;
  const {
    PageNotFound,
    PageIndex,
    PageProjects,
    PageProject,
    PageProjectForm,
    PageEmployees,
    PageEmployeeForm,
    PageEmployee,
    PageTasks,
    PageTask,
    PageTaskForm,
    PageDelete
  } = Pages;

  class Main extends Component {
    render() {
      return h("div", { class: "main" },
        h(Router, {
          routes: {
            "/": PageIndex,
            "/projects": PageProjects,
            "/projects/new": PageProjectForm,
            "/projects/:uid": PageProject,
            "/projects/:uid/edit": PageProjectForm,
            "/employees": PageEmployees,
            "/employees/new": PageEmployeeForm,
            "/employees/:uid": PageEmployee,
            "/employees/:uid/edit": PageEmployeeForm,
            "/tasks": PageTasks,
            "/tasks/new": PageTaskForm,
            "/tasks/:uid": PageTask,
            "/tasks/:uid/edit": PageTaskForm,
            "/:type/:uid/delete": PageDelete,
            "*": PageNotFound
          }
        }),
        h("div", { id: "header" }),
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
        )
      );
    }
  }

  return Main;
});