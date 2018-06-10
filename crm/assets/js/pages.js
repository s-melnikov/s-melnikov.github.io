define("pages", [
  "components",
  "pages/projects",
  "pages/project",
  "pages/project-form",
  "pages/employees",
  "pages/employee",
  "pages/employee-form",
  "pages/delete",
  ], (
    Components,
    PageProjects,
    PageProject,
    PageProjectForm,
    PageEmployees,
    PageEmployee,
    PageEmployeeForm,
    PageDelete
    ) => {
  const { h, Component } = preact;
  const { Redirect } = Components;

  const PageNotFound = () => h("div", { class: "view" }, "404! Page not found");

  const PageIndex  = () => h(Redirect, { to: "/projects" });

  const PageTasks = () => h("div", { class: "view" }, "Tasks");
  const PageTask = () => h("div", { class: "view" }, "Task");
  const PageTaskForm = () => h("div", { class: "view" }, "Task form");

  return {
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
  };
});