const Page = ({ name }, children) => (state, actions) => {
  return h("div", { class: "main" },
    h("div", { class: "container"},
      h("div", {
        key: "page-" + name,
        oncreate: actions[`page-${name}-oncreate`],
        onupdate: actions[`page-${name}-onupdate`],
        onremove: actions[`page-${name}-onremove`],
        ondestroy: actions[`page-${name}-ondestroy`]
      }, children)
    ),
    h("div", { id: "header" },
      h("div", { class: "top-section" },
        h("div", { class: "container" },
          h("div", { class: "navbar" },
            h("div", { class: "navbar-section" },
              h(Link, { to: "/" },
                h("span", { class: "logo va-m" }),
                h("span", { class: "va-m" }, "SimpleCRM")
              )
            )
          )
        )
      ),
      h("div", { class: "bottom-section" },
        h("div", { class: "container" },
          h("div", { class: "navbar" },
            h("div", { class: "navbar-section nav" },
              h(Link, { to: "/accounts" }, "Accounts")
            )
          )
        )
      ),
    )
  );
};