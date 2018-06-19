const { app } = hyperapp;
const db = database("simplecrm");
const Routes =  {
  "/": PageAccounts,
  "/accounts": PageAccounts,
  "/accounts/page/:page": PageAccounts,
  "/accounts/new": PageAccountForm,
  "/accounts/:uid": PageAccount,
  "/accounts/:uid/edit": PageAccountForm,
  "/accounts/:uid/delete": PageDelete,
  "*": PageNotFound
}
Router(Logger(app))(State, Actions, Routes, document.body);