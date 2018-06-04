define("pages", [
  "components",
  "pages/companies",
  "pages/company",
  "pages/company-form",
  "pages/employees",
  "pages/employee",
  "pages/employee-form",
  ], (
    Components,
    PageCompanies,
    PageCompany,
    PageCompanyForm,
    PageEmployees,
    PageEmployee,
    PageEmployeeForm
    ) => {
  const { h, Component } = preact;
  const { Redirect } = Components;

  const PageNotFound = () => h("div", { class: "view" }, "404! Page not found");

  const PageIndex  = () => h(Redirect, { to: "/companies" });

  return {
    PageNotFound,
    PageIndex,
    PageCompanies,
    PageCompany,
    PageCompanyForm,
    PageEmployees,
    PageEmployeeForm,
    PageEmployee
  };
});