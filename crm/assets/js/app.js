const { app } = hyperapp;
const db = database("simplecrm");
const Routes =  {
  "/": PageLeads,
  "/leads": PageLeads,
  "/leads/new": PageLeadForm,
  "/leads/:uid": PageLead,
  "/leads/:uid/edit": PageLeadForm,
  "/leads/:uid/delete": PageDelete,
  "*": PageNotFound
}
Router(Logger(app))(State, Actions, Routes, document.body);