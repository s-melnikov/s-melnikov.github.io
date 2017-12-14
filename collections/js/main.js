let { h, render, Component } = preact
let { Router, Link } = preactRouter
let storage = new Storage("my_app")

class App extends Component {
  componentWillMount() {
    this.setState({ user: { first_name: "Jonh", last_name: "Doe" } })
  }
  render() {
    return h("div", { "class": "main-wrapper" },
      this.state.user && h("div", { "class": "user-authorised" },
        h("header", { "class": "navbar" },
          h("section",{ "class": "navbar-section logo" },
            h("a", { href: "#", "class": "btn btn-link" }, "Dashboard")
          ),
          h("section", { "class": "navbar-section" },
            h("a", { href: "#", "class": "btn btn-link" }, "Sign out")
          )
        ),
        h("div", { "class": "sidebar" },
          h("ul", { "class": "nav" },
            h("li", { "class": "nav-item" },
              h( "a", { href: "#/tables" }, "Collections")
            )
          )
        ),
        h("div", { "class": "main-container" },
          h("div", { "class": "container" },
            h(Router, { history: getHistory() },
              h(Home, { path: "/"}),
              h(Tables, { path: "/tables"}),
              h(Table, { path: "/table/:slug"}),
            )
          )
        )
      ),
      !this.state.user && h("div",{ "class": "user-not-authorised" }, "Sign In")
    )
  }
}

class Home extends Component {
  render() {
    return h("h3", null, "Home")
  }
}

class Tables extends Component {
  componentWillMount() {
    storage.table("tables").find().then(result => {
      this.setState({ tables: result.toArray() })
    })
  }
  render(props, state) {
    return h(Card, {
        title: "Tables",
        subtitle: "Lorem ipsum dolor",
        footer: h("button", { "class": "btn btn-primary" }, "Do something")
      },
      h("div", { "class": "columns" },
        state.tables ? state.tables.map(table =>
          h("div", { "class": "column col-3"},
            h(Card, { "class": "mb-2" },
              h("a", { href: "#!/table/" + table.slug }, table.title)
            )
          )
        ) : null
      )
    )
  }
}

class Table extends Component {
  componentDidMount() {
    this.getItems(this.props.slug)
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.slug === nextProps.slug) {
      this.getItems(nextProps.slug)
    }
  }
  getItems(slug) {

  }
  render(props, state) {
    return h("h3", null, "Table")
  }
}

function Card(props) {
  return h("div", { "class": "card" + (props.class ? " " + props.class : "")  },
    props.title || props.subtitle ? h("div", { "class": "card-header" },
      props.title ? h("div", { "class": "card-title h5" }, props.title) : null,
      props.subtitle ? h("div", { "class": "card-subtitle text-gray" }, props.subtitle) : null
    ) : null,
    h("div", { "class": "card-body" }, props.children),
    props.footer ? h("div", { "class": "card-footer" }, props.footer) : null
  )
}

render(h(App), document.querySelector("#root"))

/*


  Moon.component("Table", {
    props: ["route"],
    template: template("table"),
    hooks: {}
  })

  Moon.component("items-list", {
    props: ["slug"],
    template: template("items-list"),
    hooks: {
      mounted: function() {
        storage.table(this.get("slug")).find().then(result => {
          this.set("items", result.toArray())
        })
      }
    },
    computed: {
      getItems: {
        get: function() {
          console.log("@" + this.get("slug"))
          return "@" + this.get("slug")
        }
      }
    },
    data: function(a) {
      return {
        items: []
      }
    }
  })

  let app = new Moon({
    router,
    el: "#root",
    data: {
      authorised: true,
      tables: null
    }
  })
  */