;(function(global) {
const { h, Component, createElement } = preact;
const getCurrentPath = () => location.hash.replace(/^#!|\/$/g, "") || "/";
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
  }
  componentWillUnmount() {
    removeEventListener("hashchange", this.handleHashChangeBinded);
  }
  handleHashChange() {
    this.forceUpdate();
  }
  render() {
    const { path, exact, component, render } = this.props;
    const match = matchPath(getCurrentPath(), { path, exact });
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
const links = [];
class Link extends Component {
  constructor(props) {
    super(props);
    this.hashChangeHandlerBinded = this.hashChangeHandler.bind(this);
  }
  componentWillMount() {
    addEventListener("hashchange", this.hashChangeHandlerBinded);
  }
  componentWillUnmount() {
    removeEventListener("hashchange", this.hashChangeHandlerBinded);
  }
  hashChangeHandler() {
    this.forceUpdate();
  }
  render() {
    let { children, to, activeClass, onclick } = this.props;
    let href = "#!" + to;
    let _active = to == getCurrentPath() ? (activeClass || "active ") : "";
    return h("a", { href, onclick, class: _active + this.props.class }, children);
  }
}
class Redirect extends Component {
  componentDidMount() {
    const { to } = this.props;
    setTimeout(() => location.hash = to);
  }
  render() {
    return null;
  }
}
global.router = { Route, Link, Redirect }
})(this);