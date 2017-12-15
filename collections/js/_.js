


let { h, render, Component } = preact
let { Router, Link } = preactRouter
let storage = new Storage("my_app")

class App extends Component {
  componentWillMount() {
    this.setState({ user: { first_name: "Jonh", last_name: "Doe" } })
  }
  render() {
    return this.state.user ? h(Main) : h(SignIn)
  }
}

class SignIn extends Component {
  render() {
    return h("div", { "class": "sign-in" }, "Sign In")
  }
}

class Main extends Component {
  constructor() {
    super()
    this.state.tables = []
  }
  componentWillMount() {
    storage.table("tables").find().then(result => {
      this.setState({ tables: result.toArray() })
    })
  }
  render() {
    return h("div", { "class": "container" },
      h("main", null,
        h(Router, { history: getHistory() },
          h(Home, { path: "/"}),
          h(Table, { path: "/table/:slug"}),
        )
      ),
      h("header", null,
        h("a", { href: "#" }, "Sign out")
      ),
      h("aside", null,
        h("menu", null,
          h( "a", { href: "#" }, "Home")
        ),
        h("p", null, "Collections"),
        h("menu", null,
          this.state.tables.map(table =>
            h( "a", { href: "#/table/" + table.slug  }, table.title)
          )
        )
      )
    )
  }
}

class Home extends Component {
  render() {
    return h("div", null,
      h("h1", null, "Lorem ipsum dolor sit amet."),
      h("h2", null, "Lorem ipsum dolor sit amet."),
      h("h3", null, "Lorem ipsum dolor sit amet."),
      h("h4", null, "Lorem ipsum dolor sit amet."),
      h("h5", null, "Lorem ipsum dolor sit amet."),
      h("p", null, "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error enim sunt, molestiae quod deleniti ipsam nemo, id rem, commodi, unde consectetur porro quasi provident deserunt distinctio. Quas modi tempora suscipit?")
    )
  }
}

class Table extends Component {
  constructor() {
    super()
    this.state.items = []
  }
  componentDidMount() {
    this.getItems(this.props.slug)
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.slug !== nextProps.slug) {
      this.getItems(nextProps.slug)
    }
  }
  getItems(slug) {
    let self = this
    Promise.all([
      storage.table(slug).find(),
      storage.table("tables").where({ slug: slug }).findOne()
    ]).then(function([ itemsReult, tableResult ]) {
      self.setState({
        items: itemsReult.toArray(),
        table: tableResult.toArray()
      })
    })
  }
  render(props, state) {
    let keys = Object.keys(state.items[0] || {})
    return h("div", null,
      h("h4", null, "Table '" + this.props.slug + "'"),
      h("table", null,
        h("thead",
          h("tr", null,
            keys.map(key => h("th", null, key))
          )
        ),
        h("tbody", null,
          state.items.map(item => h("tr", null,
            keys.map(key => h("td", null, item[key]))
          ))
        )
      )
    )
  }
}

function getHistory() {
  function getCurrentLocation() {
    return {
      pathname: window.location.hash.slice(2)
    }
  }
  return {
    getCurrentLocation,
    listen: listener => {
      function onchange() { listener(getCurrentLocation()) }
      addEventListener("hashchange", onchange)
      return () => {
        removeEventListener("hashchange", onchange)
      }
    }
  }
}

render(h(App), document.querySelector("#root"))
