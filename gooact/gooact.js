(function(global) {

function h(type, props, ...children) {
  props = props != null ? props : {};
  return { type, props, children };
}

function render(vdom, parent = null) {
  if (parent) parent.textContent = "";
  const mount = parent ? (el => parent.appendChild(el)) : (el => el);
  let type = typeof vdom;
  if (type == "string" || type == "number") {
    return mount(document.createTextNode(vdom));
  } else if (type == "boolean" || vdom === null) {
    return mount(document.createTextNode(""));
  } else if (type == "object" && typeof vdom.type == "function") {
    return mount(Component.render(vdom));
  } else if (type == "object" && typeof vdom.type == "string") {
    const dom = document.createElement(vdom.type);
    for (const child of [].concat(...vdom.children)) {
      dom.appendChild(render(child));
    }
    for (const prop in vdom.props) {
      setAttribute(dom, prop, vdom.props[prop]);
    }
    return mount(dom);
  } else {
    throw new Error(`Invalid VDOM: ${vdom}.`);
  }
}

function setAttribute(dom, key, value) {
  if (typeof value == "function" && key.startsWith("on")) {
    const eventType = key.slice(2).toLowerCase();
    dom.__gooactHandlers = dom.__gooactHandlers || {};
    dom.removeEventListener(eventType, dom.__gooactHandlers[eventType]);
    dom.__gooactHandlers[eventType] = value;
    dom.addEventListener(eventType, dom.__gooactHandlers[eventType]);
  } else if (key == "checked" || key == "value" || key == "id") {
    dom[key] = value;
  } else if (key == "key") {
    dom.__gooactKey = value;
  } else if (typeof value != "object" && typeof value != "function") {
    dom.setAttribute(key, value);
  }
};

function patch(dom, vdom, parent = dom.parentNode) {
  const replace = parent ? el => (parent.replaceChild(el, dom) && el) : (el => el);
  let isObject = typeof vdom == "object";
  if (typeof vdom == "object" && typeof vdom.type == "function") {
    return Component.patch(dom, vdom, parent);
  } else if (typeof vdom != "object" && dom instanceof Text) {
    return dom.textContent != vdom ? replace(render(vdom)) : dom;
  } else if (typeof vdom == "object" && dom instanceof Text) {
    return replace(render(vdom));
  } else if (typeof vdom == "object" && dom.nodeName != vdom.type.toUpperCase()) {
    return replace(render(vdom));
  } else if (typeof vdom == "object" && dom.nodeName == vdom.type.toUpperCase()) {
    const pool = {};
    const active = document.activeElement;
    for (const index in Array.from(dom.childNodes)) {
      const child = dom.childNodes[index];
      const key = child.__gooactKey || index;
      pool[key] = child;
    }
    const vchildren = [].concat(...vdom.children);
    for (const index in vchildren) {
      const child = vchildren[index];
      const key = child.props && child.props.key || index;
      dom.appendChild(pool[key] ? patch(pool[key], child) : render(child));
      delete pool[key];
    }
    for (const key in pool) {
      if (pool[key].__gooactInstance)
        pool[key].__gooactInstance.componentWillUnmount();
      pool[key].remove();
    }
    for (const attr of dom.attributes) dom.removeAttribute(attr.name);
    for (const prop in vdom.props) setAttribute(dom, prop, vdom.props[prop]);
    active.focus();
    return dom;
  }
}

class Component {
  constructor(props) {
    this.props = props || {};
    this.state = null;
  }
  static render(vdom, parent = null) {
    const props = Object.assign({}, vdom.props, { children: vdom.children });
    if (Component.isPrototypeOf(vdom.type)) {
      const instance = new (vdom.type)(props);
      instance.componentWillMount();
      instance.base = render(instance.render(), parent);
      instance.base.__gooactInstance = instance;
      instance.base.__gooactKey = vdom.props.key;
      instance.componentDidMount();
      return instance.base;
    } else {
      return render(vdom.type(props), parent);
    }
  }
  static patch(dom, vdom, parent = dom.parentNode) {
    const props = Object.assign({}, vdom.props, { children: vdom.children });
    if (dom.__gooactInstance && dom.__gooactInstance.constructor == vdom.type) {
      dom.__gooactInstance.componentWillReceiveProps(props);
      dom.__gooactInstance.props = props;
      return patch(dom, dom.__gooactInstance.render());
    } else if (Component.isPrototypeOf(vdom.type)) {
      const ndom = Component.render(vdom);
      return parent ? (parent.replaceChild(ndom, dom) && ndom) : (ndom);
    } else if (!Component.isPrototypeOf(vdom.type)) {
      return patch(dom, vdom.type(props));
    }
  }
  setState(nextState) {
    if (this.base && this.shouldComponentUpdate(this.props, nextState)) {
      const prevState = this.state;
      this.componentWillUpdate(this.props, nextState);
      this.state = nextState;
      patch(this.base, this.render());
      this.componentDidUpdate(this.props, prevState);
    } else {
      this.state = nextState;
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps != this.props || nextState != this.state;
  }
  componentWillReceiveProps(nextProps) {
    return undefined;
  }
  componentWillUpdate(nextProps, nextState) {
    return undefined;
  }
  componentDidUpdate(prevProps, prevState) {
    return undefined;
  }
  componentWillMount() {
    return undefined;
  }
  componentDidMount() {
    return undefined;
  }
  componentWillUnmount() {
    return undefined;
  }
}

class Router extends Component {
  constructor(props) {
    super(props);
    this.state = { children: [] };
  }
  hashChangeHandler() {
    let hash = location.hash.slice(2) || "/";
    let children = [];
    this.props.children.forEach(child => {
      let keys = [];
      let regex = RegExp(child.props.path === "*" ? ".*" :
        "^" + child.props.path.replace(/:([\w]+)/g, function(_, key) {
          keys.push(key.toLowerCase());
          return "([-\\.%\\w\\(\\)]+)";
        }) + "$");
      let match, params = {};
      child.props.params = null;
      if (match = regex.exec(hash)) {
        keys.map((key, i) => params[key] = match[i + 1] || "");
        child.props.params = params;
        children = children.concat(child);
      }
    });
    this.setState({ children });
  }
  render() {
    return h("div", { class: "router" }, this.state.children);
  }
  componentWillMount() {
    this.hashChangeHandler = this.hashChangeHandler.bind(this);
    window.addEventListener("hashchange", this.hashChangeHandler);
    this.hashChangeHandler();
  }
  componentWillUnmount() {
    window.removeEventListener("hashchange", this.hashChangeHandler);
  }
}

class Link extends Component {
  constructor(props) {
    super(props);
    this.class = this.props.class || "";
    this.props.href = "#!" + this.props.to;
    this.state = { active: false };
  }
  hashChangeHandler() {
    this.setState({ active: this.props.href.slice(2) == (location.hash.slice(2) || "/") });
  }
  componentWillMount() {
    this.hashChangeHandler = this.hashChangeHandler.bind(this);
    window.addEventListener("hashchange", this.hashChangeHandler);
    this.hashChangeHandler();
  }
  componentWillUnmount() {
    window.removeEventListener("hashchange", this.hashChangeHandler);
  }
  render() {
    this.props.class = this.class;
    if (this.state.active) {
      this.props.class += (this.class ? " " : "") + "active";
    }
    return h("a", this.props, this.props.children);
  }
}

global.gooact = { h, render, Component, Router, Link }

})(this)