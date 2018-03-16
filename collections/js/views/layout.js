define("views.layout", () => {
  const { h } = hyperapp;
  const Navbar = require("views.navbar");
  const Aside = require("views.aside");
  const Layout = (state, actions) => {
    return state.user ?
      h("div", {
          class: "container",
          oncreate: () => actions.getCollections()
        },
        Navbar(state, actions),
        Aside(state, actions),
        h("main", { class: "page-main" }, router(state, actions))
      ) :
      h("div", { class: "sign-in" }, "Sign In");
  };

  return Layout;
});