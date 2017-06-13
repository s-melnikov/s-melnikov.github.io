let store = createStore((state, action) => ({
  alerts: alertsReducer(state.alerts, action)
}), { alerts: [] })

firebase.initializeApp({
  apiKey: "AIzaSyC3aIrFmOUuS5uUl81TbOL39maUW2ITSX8",
  databaseURL: "https://content-system.firebaseio.com",
})

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      alerts: []
    }
  }

  componentWillMount(state, props) {
    // firebase.auth().onAuthStateChanged(user => this.setState({ user }))
    store.subscribe(this, ({ action, value: alerts }) => {
      switch (action) {
        case "ALERT_ADD":
        case "ALERT_REMOVE":
        case "ALERT_RESET":
          this.setState({ alerts })
          break;
      }
    })
  }

  render(props, { alerts, user }) {
    return h("div", { id: "layout" },
      alerts.length ?
        h("div", { id: "alerts" },
          alerts.map(alert => Components.Toast(alert, () => {
            alerts.remove(alert.id)
          }))
        ) : null,
      user ? h(Layout) : h(SignIn)
    )
  }
}

class SignIn extends Component {
  constructor(props) {
    super(props)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit() {
    let { email, password } = this.state
    if (email && password) {
      firebase.auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => { alerts.reset() })
        .catch(({ message: text }) => alerts.add({text, type: "error"}));
    }
  }

  handleInputChange({ target }) {
    let value = target.type === "checkbox" ? target.checked : target.value
    let name = target.name
    this.setState({ [name]: value })
  }

  render(props, state) {
    return h("div", { class: "auth-form" },
      h("h3", { class: "text-center" }, "Sign in to System"),
      h("form", {
          class: "card",
          onsubmit: this.handleSubmit,
          action: "javascript:"
        },
        h("div", { class: "card-body" },
          h("div", { class: "form-group" },
            h("label", {
              class: "form-label",
              for: "input-1"
            }, "Email address"),
            h("input", {
              class: "form-input",
              type: "email",
              name: "email",
              oninput: this.handleInputChange
            })
          ),
          h("div", { class: "form-group" },
            h("label", {
              class: "form-label",
              for: "input-2"
            }, "Password"),
            h("input", {
              class: "form-input",
              type: "password",
              name: "password",
              oninput: this.handleInputChange
            })
          )
        ),
        h("div", { class: "card-footer" },
          h("button", { class: "btn btn-block" }, "Sign in")
        )
      )
    )
  }
}

class Layout extends Component {
  render(props, state) {
    return h("div", null,
      h("div", { class: "main-header" },
        h("div", { class: "container" },
          h("div", { class: "navbar" },
            h("div", { class: "navbar-section" },
              h("a", { class: "navbar-brand", href: "#" }, "Content System")
            ),
            h("div", { class: "navbar-section" },
              h("a", { class: "btn btn-link", href: "#" }, "Logout")
            )
          )
        )
      ),
      h("div", { class: "container" },
        h("div", { class: "columns" },
          h("div", { class: "column col-3" },
            h("div", { class: "nav" },
              h("li", { class: "nav-item" },
                h("a", { href: "#!/users" }, "Users")
              )
            )
          ),
          h("div", { class: "column col-9" }, props.children)
        )
      )
    )
  }
}

render(h(App), document.querySelector("#main"))

/*
let Error404 = (state, actions) => h("div", { class: "container" },
  h("h1", { class: "text-center mt-10" }, "Error 404! Page not found.")
)

let Dashboard = (state, actions) => Layout(state, actions)

let Users = (state, actions) => Layout(state, actions,
  h("div", null, "Users Page")
)

app({
  state: {
    user: null,
    alerts: [],
    auth: {
      email: null,
      password: null
    }
  },
  actions: {
    logout: (state, actions) => {
      log("actions.logout")
      firebase.auth().signOut().then(_ => actions.user(null))
    },
    alerts: {
      add: (state, actions, alert) => {
        state.alerts.push(alert)
        return state
      },
      remove: (state, actions, alert) => {
        let index = state.alerts.indexOf(alert)
        state.alerts.splice(index, 1)
        return state
      },
      reset: state => ({ alerts: [] })
    }
  },
  view: {
    "/": Dashboard,
    "/users": Users,
    "*": Error404,
  },
  events: {
    loaded: (state, actions) => {
      log("events.loaded")

    }
  },
  plugins: [Router]
})
*/