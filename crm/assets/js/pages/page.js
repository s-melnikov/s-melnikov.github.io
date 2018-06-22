const Page = ({ name }, children) => (state, actions) => {
  let upper = name.split("-").map(s => s[0].toUpperCase() + s.slice(1));
  return h("div", { class: "main" },
    h("div", { class: "container"},
      h("div", {
        key: "page-" + name,
        oncreate: actions[`page${upper}OnCreate`],
        onupdate: actions[`page${upper}OnUpdate`],
        onremove: actions[`page${upper}OnRemove`],
        ondestroy: actions[`page${upper}OnDestroy`]
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