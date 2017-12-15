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
