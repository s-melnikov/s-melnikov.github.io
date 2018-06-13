const { h, app } = hyperapp;
const routes =  {
  "/": Views.Pages.Leads,
  "/leads": Views.Pages.Leads,
  "/leads/new": Views.Pages.LeadForm,
  "/leads/:uid": Views.Pages.Lead,
  "/leads/:uid/edit": Views.Pages.Form,
  "/leads/:uid/delete": Views.Pages.Delete,
  "*": Views.Pages.NotFound
}
Router(Logger(app))(State, Actions, routes, document.body);