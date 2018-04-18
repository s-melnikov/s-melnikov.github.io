let { h, app } = hyperapp;
let db = database("hypercrm");
let state = {
  companies: null,
  employees: null,
  tasks: null
};

let actions = {
  getEntries: ({ name, where }) => (_, { setEntries }) => {
    db.refs[name].find(where).then(result => {
      setEntries({ name, entries: result.data() });
    });
    return { [name]: null }
  },
  setEntries: ({ name, entries }) => ({ [name]: entries })
};

let routes = {
  "*": NotFoundView,
  "/": IndexView,
  "/companies": CompaniesView,
  "/companies/:key": CompanyView,
  "/companies/:key/:action": CompanyView,
  "/employees": EmployeesView,
  "/employees/:key": EmployeeView
};

db.refs = {
  companies: db.collection("companies"),
  employees: db.collection("employees"),
  tasks: db.collection("tasks"),
}

Router(Logger(app))(state, actions, routes, document.body);

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

function Logger(app) {
  return (state, actions, view, container) => {
    actions = enhance(actions);
    return app(state, actions, view, container);
  }
  function log(prevState, action, nextState) {
    console.groupCollapsed("%c action", "color: gray", action.name);
    console.log("%c prev state", "color:#9E9E9E", prevState);
    console.log("%c data", "color: #03A9F4", action.data);
    console.log("%c next state", "color:#4CAF50", nextState);
    console.groupEnd();
  }
  function enhance(actions, prefix) {
    let namespace = prefix ? prefix + "." : ""
    return Object.keys(actions || {}).reduce((otherActions, name) => {
      let namedspacedName = namespace + name, action = actions[name];
      otherActions[name] = typeof action === "function" ? data => (state, actions) => {
        let result = action(data);
        result = typeof result === "function" ? result(state, actions) : result;
        log(state,{ name: namedspacedName, data: data }, result);
        return result;
      } : enhance(action, namedspacedName);
      return otherActions;
    }, {});
  }
}

function Loader() {
  return h("div", { class: "loader" });
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

function Descriptions({ list }) {
  return list.map(item => item && h("dl", null,
    h("dt", null, item[0]),
    h("dd", null, item[1])
  ));
}

function ItemsList({ items, iterator }) {
  if (!items) return h(Loader);
  if (!items.length) return h("span", null, "no items");
  return items.map(iterator);
}

function CompanyLinkView({ company: key }) {
  return ({ companies }, { getEntries }) => {
    let company = companies ? companies[0] : null;
    return h("div", {
      oncreate: () => getEntries({
        name: "companies",
        where: key
      })
    }, company ? h(Link, { to: "/companies/" + company.$key }, company.name) : null);
  }
}

function Layout(props, children) {
  return h("div", { class: "main", ...props },
    h("div", { class: "header" },
      h("div", { class: "tabs" },
        h(Link, { class: "tab", to: "/companies" }, "Companies"),
        h(Link, { class: "tab", to: "/employees" }, "Employees")
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
        oncreate: el => getEntries({ name: "companies" }) },
      companies ? h("table", null,
        h("thead", null,
          h("tr", null,
            h("th", null, "Name"),
            h("th", null, "Industry"),
            h("th", null, "Phone"),
            h("th", null, "actions"),
          )
        ),
        h("tbody", null,
          companies.map(company =>
            h("tr", null,
              h("td", null, h(Link, { to: "/companies/" + company.$key }, company.name)),
              h("td", null, company.industry),
              h("td", null, company.phone),
              h("td", null,
                h(Link, { to: "/companies/" + company.$key + "/edit" }, "edit"),
                " ",
                h(Link, { to: "/companies/" + company.$key + "/delete" }, "delete")
              ),
            )
          )
        )
      ) : h(Loader)
    )
  );
}

function CompanyView(actions, actions) {
  let { companies, employees, tasks, route } = state;
  let { getEntries, setEntries } = actions;
  let company = companies ? companies[0] : null;
  let { key, action } = route.params;
  let isEdit = action == "edit";
  return h(Layout, null,
    h("div", {
        class: "item_view",
        key: "companies:" + key,
        oncreate: el => {
          getEntries({
            name: "companies",
            where: key
          });
          getEntries({
            name: "employees",
            where: { company: key }
          });
          getEntries({
            name: "tasks",
            where: { company: key }
          });
        }
      },

      company ? h(Descriptions, {
        list: [
          [" ", isEdit ?
            h(Link, {
              to: "/companies/" + key,
              onclick: event => db.refs.
            }, "save") :
            h(Link, { to: "/companies/" + key + "/edit"}, "edit")
          ],
          [ "Name",
            isEdit ? h("input", {
              value: company.name,
              onchange: event => company.name = event.target.value
            }) : company.name],
          [ "Industry",
            isEdit ? h("input", {
              value: company.industry,
              onchange: event => company.industry = event.target.value
            }) : company.industry],
          [ "Phone",
            isEdit ? h("input", {
              value: company.phone,
              onchange: event => company.phone = event.target.value
            }) : company.phone],
          [ "Country",
            isEdit ? h("input", {
              value: company.country,
              onchange: event => company.country = event.target.value
            }) : company.country],
          [ "City",
            isEdit ? h("input", {
              value: company.city,
              onchange: event => company.city = event.target.value
            }) : company.city],
          [ "Address",
            isEdit ? h("input", {
              value: company.address,
              onchange: event => company.address = event.target.value
            }) : company.address],
          isEdit || [ "Emploees", h(ItemsList, { items: employees,
              iterator: emploee => h("p", null,
                h(Link, { to: "/employees/" + emploee.$key },
                  emploee.first_name + " " + emploee.last_name
                )
              )
            })],
          isEdit || [ "Tasks", h(ItemsList, { items: tasks,
              iterator: task => h("p", null, task.content)
            })],
        ]
      }) : h(Loader)
    )
  );
}

function EmployeesView({ employees }, { getEntries }) {
  return h(Layout, null,
    h("div", { key: "employees",
        oncreate: el => getEntries({ name: "employees" }) },
      employees ? h("table", null,
        h("thead", null,
          h("tr", null,
            h("th", null, "Name"),
            h("th", null, "Email"),
            h("th", null, "Phone"),
          )
        ),
        h("tbody", null,
          employees.map(employee =>
            h("tr", null,
              h("td", null, h(Link, { to: "/employees/" + employee.$key },
                employee.first_name + " " + employee.last_name
              )),
              h("td", null, employee.email),
              h("td", null, employee.phone),
            )
          )
        )
      ) : h(Loader)
    )
  );
}

function EmployeeView({ employees, route }, { getEntries, setEntries }) {
  let key = route.params.key;
  let employee = employees ? employees[0] : null;
  return h(Layout, null,
    h("div", {
        key: "emploee:" + key,
        oncreate: el => {
          getEntries({
            name: "employees",
            where: key
          });
          setEntries({ name: "companies", entries: null });
        }
      },
      employee ? h(Descriptions, {
        list: [
          [ "First name", employee.first_name],
          [ "Last name", employee.last_name],
          [ "Phone", employee.phone],
          [ "Email", employee.email],
          [ "Country", employee.country],
          [ "City", employee.city],
          [ "Street", employee.street],
          [ "Gender", employee.gender],
          [ "Company", h(CompanyLinkView, { company: employee.company })]
        ]
      }) : h(Loader)
    )
  );
}

function NotFoundView(state, actions) {
  return h("div", null, "404! Page not found");
}

if (!localStorage.hypercrm) {
  fetch("dump.json").then(resp => resp.json()).then(data => {
    database("hypercrm").restore(data);
  });
  location.reload();
}