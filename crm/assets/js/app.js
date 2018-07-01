const { app } = hyperapp;
const db = database("simplecrm");
const Routes =  {
  "/": PageAccounts,
  "/accounts": PageAccounts,
  "/accounts/page/:page": PageAccounts,
  "/accounts/new": PageAccountEdit,
  "/accounts/:uid": PageAccount,
  "/accounts/:uid/edit": PageAccountEdit,
  "/accounts/:uid/delete": PageDelete,
  "*": PageNotFound
}
Router(Logger(app))(State, Actions, Routes, document.body);