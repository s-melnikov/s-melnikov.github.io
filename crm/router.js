;(function(global) {

const { h, Component, createElement } = preact;
let instances = [];
const register = component => instances.push(component);
const unregister = component => instances.splice(instances.indexOf(component), 1);
const historyPush = path => {
  instances.forEach(instance => instance.forceUpdate());
}
const historyReplace = path => {
  instances.forEach(instance => instance.forceUpdate());
}
const matchPath = (pathname, options) => {
  const { exact = false, path } = options;
  if (!path) {
    return {
      path: null,
      url: pathname,
      isExact: true
    }
  }
  let keys = [];
  let regex = RegExp(path === "*" ? ".*" :
    "^" + path.replace(/:([\w]+)/g, function(_, key) {
      keys.push(key.toLowerCase());
      return "([-\\.%\\w\\(\\)]+)";
    }) + "$");
  let match, params = {};
  if (match = regex.exec(pathname)) {
    keys.map((key, i) => params[key] = match[i + 1] || "");
  }
  if (!match) return null;
  const url = match[0];
  const isExact = pathname === url;
  if (exact && !isExact) return null;
  return { path, url, isExact, params };
}
class Route extends Component {
  constructor(props) {
    super(props);
    this.handleHashChangeBinded = this.handleHashChange.bind(this);
  }
  componentWillMount() {
    addEventListener("hashchange", this.handleHashChangeBinded);
    register(this);
  }
  componentWillUnmount() {
    unregister(this);
    removeEventListener("popstate", this.handleHashChangeBinded);
  }
  handleHashChange() {
    this.forceUpdate();
  }
  render() {
    const { path, exact, component, render } = this.props;
    const match = matchPath(location.hash.slice(2) || "/", { path, exact });
    if (!match) return null;
    if (component) {
      return createElement(component, { match });
    }
    if (render) {
      return render({ match });
    }
    return null
  }
}
class Link extends Component {
  render() {
    let props = this.props;
    props.href = "#!" + props.to;
    return h("a", props, props.children);
  }
}
class Redirect extends Component {
  componentDidMount() {
    const { to } = this.props;
    setTimeout(() => { location.hash = to });
  }
  render() {
    return null
  }
}

global.router = { Route, Link }

})(this);