define("views.navbar", () => {
  const { h } = hyperapp;
  const Navbar = (state, actions) => {
    return h("header", { class: "navbar" },
      h("section", { class: "navbar-section" }),
      h("section", { class: "navbar-section" },
        h("a", { href: "#", class: "btn btn-link" }, "Sign-out")
      )
    );
  };

  return Navbar;
});