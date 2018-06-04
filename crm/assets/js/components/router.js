define("components/router", ["utils"], (Utils) => {
  const { h, Component } = preact;
  const { getCurrentPath } = Utils;

  class Router extends Component {
    constructor(props) {
      super(props);
      this.prepareRoutes();
      this.hashChangeHandler = this.hashChangeHandler.bind(this);
    }
    componentWillMount() {
      this.state.path = getCurrentPath();
      addEventListener("hashchange", this.hashChangeHandler);
    }
    componentWillUnmount() {
      removeEventListener("hashchange", this.hashChangeHandler);
    }
    hashChangeHandler() {
      this.setState({ path: getCurrentPath() });
    }
    prepareRoutes() {
      let { routes } = this.props;
      let paths = Object.keys(routes);
      this.routes = paths.map(path => {
        let keys = [];
        let component = routes[path];
        let regexp = RegExp(path === "*" ? ".*" :
          "^" + path.replace(/:([\w]+)/g, (_, key) => {
            keys.push(key);
            return "([-\\.%\\w\\(\\)]+)";
          }) + "$");
        return { regexp, keys, component };
      });
    }
    render() {
      let { path } = this.state;
      let match, params = {};
      for (let i = 0; i < this.routes.length; i++) {
        let { regexp, keys, component } = this.routes[i];
        if (match = regexp.exec(path)) {
          keys.map((key, i) => params[key] = match[i + 1] || "");
          return h(component, { params });
        }
      }
      return null;
    }
  }

  return Router;
});