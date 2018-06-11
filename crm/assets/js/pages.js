define("pages", [
  "components",
  "pages/leads",
  "pages/lead",
  "pages/lead-form",
  "pages/delete",
  ], (
    Components,
    PageLeads,
    PageLead,
    PageLeadForm,
    PageDelete
    ) => {
  const { h, Component } = preact;
  const { Redirect } = Components;

  const PageNotFound = () => h("div", { class: "view" }, "404! Page not found");

  return {
    PageNotFound,
    PageLeads,
    PageLeadForm,
    PageLead,
    PageDelete
  };
});