let { h, app } = hyperapp;
let db = database("hypercrm");

let entryTypes = {
  companies: "company",
  employers: "employer",
  tasks: "task"
}

let state = {
  companies: null,
  company: null,
  employers: null,
  employer: null,
  tasks: null,
  task: null
};

let actions = {
  getEntries: name => (_, { setEntries }) => {
    db.refs[name].find().then(result => {
      setEntries({ name, data: result.data() });
    })
  },
  setEntries: ({ name, data }) => ({ [name]: data }),
  getEntry: ({ name, key }) => (_, { setEntry }) => {
    db.refs[name].find(key).then(result => {
      let data = result.data();
      setEntry({ name: entryTypes[name], data: data.length ? data[0] : null });
    })
  },
  setEntry: ({ name, data }) => ({ [name]: data })
};

let routes = {
  "*": NotFoundView,
  "/": IndexView,
  "/companies": CompaniesView,
  "/company/:key": CompanyView,
  "/employers": EmployersView
};

db.refs = {
  companies: db.collection("companies"),
  employers: db.collection("employers"),
  tasks: db.collection("tasks"),
}

Router(app)(state, actions, routes, document.body);

function Router(app) {
  return (state, actions, routes, container) => {
    let currentView = null;
    let hash = () => location.hash.slice(2);
    let preparedRoutes = Object.keys(routes).map(path => {
      let keys = [];
      let regex = RegExp(path === "*" ? ".*" :
        "^" + path.replace(/:([\w]+)/g, function(_, key) {
          keys.push(key.toLowerCase());
          return "([-\\.%\\w\\(\\)]+)";
        }) + "$");
      return { regex, keys, view: routes[path] };
    });
    actions.setRoute = path => {
      if (!path || path.type) {
        path = location.hash.slice(2) || "/";
      }
      let match, params = {};
      preparedRoutes.map(({ regex, keys, view }) => {
        if (match = regex.exec(path)) {
          keys.map((key, i) => params[key] = match[i + 1] || "");
          currentView = view;
        }
      });
      return { route: { path, params } }
    };
    state.route = actions.setRoute().route;
    let main = app(state, actions, (state, actions) => currentView(state, actions), container);
    window.addEventListener("hashchange", main.setRoute);
    return main;
  }
}

function Link(props, ...childrens) {
  let hash = "#!" + props.to;
  if (hash === location.hash) {
    props.class = (props.class ? props.class + " " : "") + "active";
  }
  props.href = hash;
  delete props.to;
  return h("a", props, childrens);
}

function Layout(props, children) {
  return h("div", { class: "main", ...props },
    h("div", { class: "header" },
      h("div", { class: "tabs" },
        h(Link, { class: "tab", to: "/companies" }, "Companies"),
        h(Link, { class: "tab", to: "/employers" }, "Employers")
      )
    ),
    h("div", { class: "content" }, children)
  );
}

function IndexView(state, actions) {
  setTimeout(() => location.hash = "#!/companies", 0);
  return null;
}

function CompaniesView({ companies }, { getEntries }) {
  return h(Layout, null,
    h("div", { key: "companies",
        oncreate: el => getEntries("companies") },
      h("table", null,
        h("thead", null,
          h("tr", null,
            h("th", null, "Name"),
            h("th", null, "Industry"),
            h("th", null, "Phone")
          )
        ),
        h("tbody", null,
          companies ? companies.map(company =>
            h("tr", null,
              h("td", null, h(Link, { to: "/company/" + company.$key }, company.name)),
              h("td", null, company.industry),
              h("td", null, company.phone)
            )
          ) : null
        )
      )
    )
  );
}

function CompanyView({ company }, { getEntry }) {
  let key = state.route.params.key;
  return h(Layout, null,
    h("div", { key: "company:" + key,
        oncreate: el => getEntry({ name: "companies", key }) },
      company ? h("dl", null,
        h("dt", null, "Name"),
        h("dd", null, company.name),
        h("dt", null, "Industry"),
        h("dd", null, company.industry),
        h("dt", null, "Phone"),
        h("dd", null, company.phone),
        h("dt", null, "Country"),
        h("dd", null, company.country),
        h("dt", null, "City"),
        h("dd", null, company.city),
        h("dt", null, "Address"),
        h("dd", null, company.address)
      ) : null
    )
  );
}

function EmployersView(state, actions) {
  return h(Layout, { class: "employers_view" },
    h("div", {
      key: "employers",
      oncreate: el => actions.getEmployers
    }, "Employers")
  );
}

function NotFoundView(state, actions) {
  return h("div", null, "404! Page not found");
}

if (!localStorage.hypercrm) {
  fetch("dump.json").then(resp => resp.json()).then(data => {
    database("hypercrm").restore(data);
  });
}