class Link extends Component {
  render({ to, children }) {
    return h("a", { href: "#!" + to }, children)
  }
}

class Route extends Component {
  constructor(props) {
    super(props)
    this.handleHashChange = this.handleHashChange.bind(this)
  }

  handleHashChange() {
    this.forceUpdate()
  }

  componentWillMount() {
    console.log(this.props)
    addEventListener("hashchange", this.handleHashChange)
  }

  componentWillUnmount() {
    removeEventListener("hashchange", this.handleHashChange)
  }

  matchPath(hash, { exact = false, path }) {
    hash = hash.slice(2) || "/"
    if (!path) {
      return {
        path: null,
        url: pathname,
        isExact: true,
      }
    }
    let match = new RegExp("^" + path).exec(hash)
    if (!match) {
      return null
    }
    let url = match[0]
    let isExact = hash === url
    if (exact && !isExact) {
      return null
    }
    return { path, url, isExact }
  }

  render({ path, exact, component, render }) {

    let match = this.matchPath(location.hash, { path, exact })

    if (match) {
      if (component) {
        return h(component, { match })
      }

      if (render) {
        return render({ match })
      }
    }

    return null
  }
}