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
  "/": IndexView,
  "/:type/:key/delete": DeleteItemView,
  "/companies": CompaniesView,
  "/companies/new": CompanyView,
  "/companies/:key": CompanyView,
  "/companies/:key/:action": CompanyView,
  "/employees": EmployeesView,
  "/employees/:key": EmployeeView,
  "/employees/:key/:action": EmployeeView,
  "*": NotFoundView
};

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

function EmployeesView({ employees }, { getEntries }) {
  return h(Layout, null,
    h("div", { key: "employees", class: "view",
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

function EmployeeView(state, actions) {
  let { employees, route } = state;
  let { getEntries, setEntries } = actions;
  let { key, action } = route.params;
  let employee = employees ? Object.assign(employees[0]) : null;
  let isEdit = action == "edit";
  return h(Layout, null,
    h("div", {
        class: "view",
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
          ["", h("div", { style: { textAlign: "right" } },
            isEdit ? [
                h(Link, {
                  to: "/employees/" + key,
                  class: "btn",
                  onclick: event => db.refs.employees.find(key).then(result => {
                    let entry = result.first();
                    if (entry) entry.update(employee);
                  }),
                }, "save"),
                h(Link, {
                  class: "btn red",
                  to: "/employees/" + key
                }, "cancel")
              ] : [
                h(Link, {
                  class: "btn",
                  to: "/employees/" + key + "/edit"
                }, "edit"),
                h(Link, {
                  class: "btn red",
                  to: "/employees/" + key + "/delete"
                }, "delete")
              ]
            )],
          [ "First name", isEdit ? h("input", {
              value: employee.first_name,
              onchange: event => employee.first_name = event.target.value
            }) : employee.first_name],
          [ "Last name", isEdit ? h("input", {
              value: employee.last_name,
              onchange: event => employee.last_name = event.target.value
            }) : employee.last_name],
          [ "Phone", isEdit ? h("input", {
              value: employee.phone,
              onchange: event => employee.phone = event.target.value
            }) : employee.phone],
          [ "Email", isEdit ? h("input", {
              value: employee.email,
              onchange: event => employee.email = event.target.value
            }) : employee.email],
          [ "Country", isEdit ? h("input", {
              value: employee.country,
              onchange: event => employee.country = event.target.value
            }) : employee.country],
          [ "City", isEdit ? h("input", {
              value: employee.city,
              onchange: event => employee.city = event.target.value
            }) : employee.city],
          [ "Street", isEdit ? h("input", {
              value: employee.street,
              onchange: event => employee.street = event.target.value
            }) : employee.street],
          [ "Gender", isEdit ? h("input", {
              value: employee.gender,
              onchange: event => employee.gender = event.target.value
            }) : employee.gender],
          isEdit || [ "Company", h(CompanyLinkView, { company: employee.company })]
        ]
      }) : h(Loader)
    )
  );
}

function DeleteItemView(state, { getEntries, setEntries }) {
  let { type, key } = state.route.params;
  let entry = state[type] ? state[type][0] : null;
  return h(Layout, null,
      h("div", {
        key: "delete_view:" + type + ":" + key,
        class: "view",
        oncreate: el => getEntries({
          name: type,
          where: key
        })
      },
      entry ? h("div", null,
        h("p", null,
          "Are you sure you want to delete entry:",
          h("br"),
          h("br"),
          h("i", null, (entry.name || (entry.first_name + " " + entry.last_name))
            + " (" + type + ")"),
          h("br"),
          h("br"),
          h(Link, { class: "btn", to: "/" + type,
            onclick: event => {
              event.preventDefault();
              setEntries({ name: type, entries: null });
              db.refs[type].find(key).then(result => {
                let entry = result.first();
                if (entry) {
                  entry.delete().then(() => {
                    location.hash = "#!/" + type;
                  });
                } else {
                  location.hash = "#!/" + type;
                }
              });
            }
          }, "yes"),
          h(Link, { class: "btn red",
            to: "/" + type + "/" + key }, "no"),
        ),
      ) : h(Loader)
    )
  );
}

