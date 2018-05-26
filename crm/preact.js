(function (global) {
  "use strict";
  class VNode {};
  const options = {
    //syncComponentUpdates: true,
    //vnode(vnode) { }
    // afterMount(component) { }
    // afterUpdate(component) { }
    // beforeUnmount(component) { }
  };
  const stack = [];
  const EMPTY_CHILDREN = [];
  function h(nodeName, attributes) {
    let children = EMPTY_CHILDREN;
    let lastSimple;
    let child;
    let simple;
    let i;
    for (i = arguments.length; i-- > 2;) {
      stack.push(arguments[i]);
    }
    if (attributes && attributes.children != null) {
      if (!stack.length) stack.push(attributes.children);
      delete attributes.children;
    }
    while (stack.length) {
      if ((child = stack.pop()) && child.pop !== undefined) {
        for (i = child.length; i--;) {
          stack.push(child[i]);
        }
      } else {
        if (typeof child === "boolean") child = null;
        if (simple = typeof nodeName !== "function") {
          if (child == null) child = "";
          else if (typeof child === "number") child = String(child);
          else if (typeof child !== "string") simple = false;
        }
        if (simple && lastSimple) {
          children[children.length - 1] += child;
        } else if (children === EMPTY_CHILDREN) {
          children = [child];
        } else {
          children.push(child);
        }
        lastSimple = simple;
      }
    }
    let p = new VNode();
    p.nodeName = nodeName;
    p.children = children;
    p.attributes = attributes == null ? undefined : attributes;
    p.key = attributes == null ? undefined : attributes.key;
    if (options.vnode !== undefined) options.vnode(p);
    return p;
  };
  const cloneElement = ({ nodeName, attributes, children }, props, ...rest) => h(
    nodeName,
    Object.assign({}, attributes, props),
    rest.length ? rest : children
  );
  const queueItems = [];
  const enqueueRender = component => {
    if (!component._dirty && (component._dirty = true) && queueItems.push(component) == 1) {
      (options.debounceRendering || Promise.resolve().then.bind(Promise.resolve()))(rerender);
    }
  };
  const rerender = () => {
    let component;
    while (component = queueItems.pop()) {
      if (component._dirty) renderComponent(component);
    }
    queueItems.length = 0;
  };
  const isSameNodeType = (node, vnode, hydrating) => {
    if (typeof vnode === "string" || typeof vnode === "number") {
      return node.splitText !== undefined;
    }
    if (typeof vnode.nodeName === "string") {
      return !node._componentConstructor && isNamedNode(node, vnode.nodeName);
    }
    return hydrating || node._componentConstructor === vnode.nodeName;
  };
  const isNamedNode = (node, nodeName) => {
    return node.normalizedNodeName === nodeName || node.nodeName.toLowerCase() === nodeName.toLowerCase();
  };
  const getNodeProps = vnode => {
    let props = Object.assign({}, vnode.attributes);
    props.children = vnode.children;
    let defaultProps = vnode.nodeName.defaultProps;
    if (defaultProps) {
      for (let i in defaultProps) {
        if (props[i] != undefined) {
          props[i] = defaultProps[i];
        }
      }
    }
    return props;
  };
  const createNode = (nodeName, isSvg) => {
    let node = isSvg ? document.createElementNS("http://www.w3.org/2000/svg", nodeName) : document.createElement(nodeName);
    node.normalizedNodeName = nodeName;
    return node;
  };
  const removeNode = node => {
    var parentNode = node.parentNode;
    if (parentNode) parentNode.removeChild(node);
  };
  const setAccessor = (node, name, old, value, isSvg) => {
    if (name === "key") {
    } else if (name === "ref") {
      if (old) old(null);
      if (value) value(node);
    } else if (name === "class" && !isSvg) {
      node.className = value || "";
    } else if (name === "style") {
      if (!value || typeof value === "string" || typeof old === "string") {
        node.style.cssText = value || "";
      }
      if (value && typeof value === "object") {
        if (typeof old !== "string") {
          for (var i in old) {
          if (!(i in value)) node.style[i] = "";
          }
        }
        for (var i in value) {
          node.style[i] = value[i];
        }
      }
    } else if (name[0] == "o" && name[1] == "n") {
      var useCapture = name !== (name = name.replace(/Capture$/, ""));
      name = name.toLowerCase().substring(2);
      if (value) {
        if (!old) node.addEventListener(name, eventProxy, useCapture);
      } else {
        node.removeEventListener(name, eventProxy, useCapture);
      }
      (node._listeners || (node._listeners = {}))[name] = value;
    } else if (name !== "list" && name !== "type" && !isSvg && name in node) {
      setProperty(node, name, value == null ? "" : value);
      if (value == null || value === false) node.removeAttribute(name);
    } else {
      var ns = isSvg && name !== (name = name.replace(/^xlink:?/, ""));
      if (value == null || value === false) {
        if (ns) node.removeAttributeNS("http://www.w3.org/1999/xlink", name.toLowerCase());else node.removeAttribute(name);
      } else if (typeof value !== "function") {
        if (ns) node.setAttributeNS("http://www.w3.org/1999/xlink", name.toLowerCase(), value);else node.setAttribute(name, value);
      }
    }
  };
  const setProperty = (node, name, value) => {
    try { node[name] = value; } catch (e) {}
  };
  const eventProxy = event => this._listeners[event.type](options.event && options.event(event) || event);
  let mounts = [];
  let diffLevel = 0;
  let isSvgMode = false;
  let hydrating = false;
  const PREACT_ATTR = "__preactattr__";
  const flushMounts = () => {
    let component;
    while (component = mounts.pop()) {
      if (options.afterMount) options.afterMount(component);
      if (component.componentDidMount) component.componentDidMount();
    }
  };
  const diff = (dom, vnode, context, mountAll, parent, componentRoot) => {
    if (!diffLevel++) {
      isSvgMode = parent != null && parent.ownerSVGElement !== undefined;
      hydrating = dom != null && !(PREACT_ATTR in dom);
    }
    let ret = idiff(dom, vnode, context, mountAll, componentRoot);
    if (parent && ret.parentNode !== parent) {
      parent.appendChild(ret);
    }
    if (!--diffLevel) {
      hydrating = false;
      if (!componentRoot) flushMounts();
    }
    return ret;
  };
  const idiff = (dom, vnode, context, mountAll, componentRoot) => {
    let out = dom;
    let prevSvgMode = isSvgMode;
    if (vnode == null || typeof vnode === "boolean") vnode = "";
    if (typeof vnode === "string" || typeof vnode === "number") {
      if (dom && dom.splitText !== undefined && dom.parentNode && (!dom._component || componentRoot)) {
        if (dom.nodeValue != vnode) {
          dom.nodeValue = vnode;
        }
      } else {
        out = document.createTextNode(vnode);
        if (dom) {
          if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
          recollectNodeTree(dom, true);
        }
      }
      out[PREACT_ATTR] = true;
      return out;
    }
    let vnodeName = vnode.nodeName;
    if (typeof vnodeName === "function") {
      return buildComponentFromVNode(dom, vnode, context, mountAll);
    }
    isSvgMode = vnodeName === "svg" ? true : vnodeName === "foreignObject" ? false : isSvgMode;
    vnodeName = String(vnodeName);
    if (!dom || !isNamedNode(dom, vnodeName)) {
      out = createNode(vnodeName, isSvgMode);
      if (dom) {
        while (dom.firstChild) {
          out.appendChild(dom.firstChild);
        }
        if (dom.parentNode) {
          dom.parentNode.replaceChild(out, dom);
        }
        recollectNodeTree(dom, true);
      }
    }
    let fc = out.firstChild;
    let props = out[PREACT_ATTR];
    let vchildren = vnode.children;
    if (props == null) {
      props = out[PREACT_ATTR] = {};
      for (var a = out.attributes, i = a.length; i--;) {
        props[a[i].name] = a[i].value;
      }
    }
    if (!hydrating &&
      vchildren &&
      vchildren.length === 1 &&
      typeof vchildren[0] === "string" &&
      fc != null &&
      fc.splitText !== undefined &&
      fc.nextSibling == null) {
      if (fc.nodeValue != vchildren[0]) {
        fc.nodeValue = vchildren[0];
      }
    } else if (vchildren && vchildren.length || fc != null) {
      innerDiffNode(out, vchildren, context, mountAll, hydrating);
    }
    diffAttributes(out, vnode.attributes, props);
    isSvgMode = prevSvgMode;
    return out;
  };
  const innerDiffNode = (dom, vchildren, context, mountAll, isHydrating) => {
    let originalChildren = dom.childNodes;
    let children = [];
    let keyed = {};
    let keyedLen = 0;
    let min = 0;
    let len = originalChildren.length;
    let childrenLen = 0;
    let vlen = vchildren ? vchildren.length : 0;
    let vchild;
    let child;
    let j;
    let c;
    let f;
    if (len !== 0) {
      for (let i = 0; i < len; i++) {
        let _child = originalChildren[i];
        let props = _child[PREACT_ATTR];
        let key = vlen && props ? _child._component ? _child._component.__key : props.key : null;
        if (key != null) {
          keyedLen++;
          keyed[key] = _child;
        } else if (props || (_child.splitText !== undefined ? isHydrating ?
          _child.nodeValue.trim() : true : isHydrating)) {
          children[childrenLen++] = _child;
        }
      }
    }
    if (vlen !== 0) {
      for (let i = 0; i < vlen; i++) {
        vchild = vchildren[i];
        child = null;
        let key = vchild.key;
        if (key != null) {
          if (keyedLen && keyed[key] !== undefined) {
            child = keyed[key];
            keyed[key] = undefined;
            keyedLen--;
          }
        } else if (!child && min < childrenLen) {
          for (j = min; j < childrenLen; j++) {
            if (children[j] !== undefined && isSameNodeType(c = children[j], vchild, isHydrating)) {
              child = c;
              children[j] = undefined;
              if (j === childrenLen - 1) childrenLen--;
              if (j === min) min++;
              break;
            }
          }
        }
        child = idiff(child, vchild, context, mountAll);
        f = originalChildren[i];
        if (child && child !== dom && child !== f) {
          if (f == null) {
            dom.appendChild(child);
          } else if (child === f.nextSibling) {
            removeNode(f);
          } else {
            dom.insertBefore(child, f);
          }
        }
      }
    }
    if (keyedLen) {
      for (var i in keyed) {
        if (keyed[i] !== undefined) recollectNodeTree(keyed[i], false);
      }
    }
    while (min <= childrenLen) {
      if ((child = children[childrenLen--]) !== undefined) recollectNodeTree(child, false);
    }
  };
  const recollectNodeTree = (node, unmountOnly) => {
    let component = node._component;
    if (component) {
      unmountComponent(component);
    } else {
      if (node[PREACT_ATTR] != null && node[PREACT_ATTR].ref) {
        node[PREACT_ATTR].ref(null);
      }
      if (unmountOnly === false || node[PREACT_ATTR] == null) {
        removeNode(node);
      }
      removeChildren(node);
    }
  };
  const removeChildren = node => {
    node = node.lastChild;
    while (node) {
      let next = node.previousSibling;
      recollectNodeTree(node, true);
      node = next;
    }
  };
  const diffAttributes = (dom, attrs, old) => {
    let name;
    for (name in old) {
      if (!(attrs && attrs[name] != null) && old[name] != null) {
        setAccessor(dom, name, old[name], old[name] = undefined, isSvgMode);
      }
    }
    for (name in attrs) {
      if (name !== "children" && (!(name in old) || attrs[name] !==
        (name === "value" || name === "checked" ? dom[name] : old[name]))) {
        setAccessor(dom, name, old[name], old[name] = attrs[name], isSvgMode);
      }
    }
  };
  let components = {};
  const collectComponent = component => {
    let name = component.constructor.name;
    (components[name] || (components[name] = [])).push(component);
  };
  const createComponent = (Ctor, props, context) => {
    let list = components[Ctor.name];
    let inst;
    if (Ctor.prototype && Ctor.prototype.render) {
      inst = new Ctor(props, context);
      Component.call(inst, props, context);
    } else {
      inst = new Component(props, context);
      inst.constructor = Ctor;
      inst.render = doRender;
    }
    if (list) {
      for (var i = list.length; i--;) {
        if (list[i].constructor === Ctor) {
          inst.nextBase = list[i].nextBase;
          list.splice(i, 1);
          break;
        }
      }
    }
    return inst;
  };
  function doRender(props, state, context) {
    return this.constructor(props, context);
  };
  const setComponentProps = (component, props, opts, context, mountAll) => {
    if (component._disable) return;
    component._disable = true;
    if (component.__ref = props.ref) delete props.ref;
    if (component.__key = props.key) delete props.key;
    if (!component.base || mountAll) {
      if (component.componentWillMount) {
        component.componentWillMount();
      }
    } else if (component.componentWillReceiveProps) {
      component.componentWillReceiveProps(props, context);
    }
    if (context && context !== component.context) {
      if (!component.prevContext) {
        component.prevContext = component.context;
      }
      component.context = context;
    }
    if (!component.prevProps) {
      component.prevProps = component.props;
    }
    component.props = props;
    component._disable = false;
    if (opts !== 0) {
      if (opts === 1 || options.syncComponentUpdates !== false || !component.base) {
        renderComponent(component, 1, mountAll);
      } else {
        enqueueRender(component);
      }
    }
    if (component.__ref) {
      component.__ref(component);
    }
  };
  function renderComponent(component, opts, mountAll, isChild) {
    if (component._disable) return;
    let props = component.props;
    let state = component.state;
    let context = component.context;
    let previousProps = component.prevProps || props;
    let previousState = component.prevState || state;
    let previousContext = component.prevContext || context;
    let isUpdate = component.base;
    let nextBase = component.nextBase;
    let initialBase = isUpdate || nextBase;
    let initialChildComponent = component._component;
    let skip = false;
    let rendered;
    let inst;
    let cbase;
    if (isUpdate) {
      component.props = previousProps;
      component.state = previousState;
      component.context = previousContext;
      if (opts !== 2 && component.shouldComponentUpdate &&
        component.shouldComponentUpdate(props, state, context) === false) {
        skip = true;
      } else if (component.componentWillUpdate) {
        component.componentWillUpdate(props, state, context);
      }
      component.props = props;
      component.state = state;
      component.context = context;
    }
    component.prevProps = component.prevState = component.prevContext = component.nextBase = null;
    component._dirty = false;
    if (!skip) {
      rendered = component.render(props, state, context);
      if (component.getChildContext) {
        context = Object.assign({}, context, component.getChildContext());
      }
      let childComponent = rendered && rendered.nodeName;
      let toUnmount;
      let base;
      if (typeof childComponent === "function") {
        let childProps = getNodeProps(rendered);
        inst = initialChildComponent;
        if (inst && inst.constructor === childComponent && childProps.key == inst.__key) {
          setComponentProps(inst, childProps, 1, context, false);
        } else {
          toUnmount = inst;
          component._component = inst = createComponent(childComponent, childProps, context);
          inst.nextBase = inst.nextBase || nextBase;
          inst._parentComponent = component;
          setComponentProps(inst, childProps, 0, context, false);
          renderComponent(inst, 1, mountAll, true);
        }
        base = inst.base;
      } else {
        cbase = initialBase;
        toUnmount = initialChildComponent;
      if (toUnmount) {
        cbase = component._component = null;
      }
      if (initialBase || opts === 1) {
        if (cbase) cbase._component = null;
          base = diff(cbase, rendered, context, mountAll || !isUpdate, initialBase && initialBase.parentNode, true);
        }
      }
      if (initialBase && base !== initialBase && inst !== initialChildComponent) {
        let baseParent = initialBase.parentNode;
        if (baseParent && base !== baseParent) {
          baseParent.replaceChild(base, initialBase);
          if (!toUnmount) {
            initialBase._component = null;
            recollectNodeTree(initialBase, false);
          }
        }
      }
      if (toUnmount) {
        unmountComponent(toUnmount);
      }
      component.base = base;
      if (base && !isChild) {
        let componentRef = component;
        let t = component;
        while (t = t._parentComponent) {
          (componentRef = t).base = base;
        }
        base._component = componentRef;
        base._componentConstructor = componentRef.constructor;
      }
    }
    if (!isUpdate || mountAll) {
      mounts.unshift(component);
    } else if (!skip) {
      if (component.componentDidUpdate) {
        component.componentDidUpdate(previousProps, previousState, previousContext);
      }
      if (options.afterUpdate) options.afterUpdate(component);
    }
    if (component._renderCallbacks != null) {
      while (component._renderCallbacks.length) {
        component._renderCallbacks.pop().call(component);
      }
    }
    if (!diffLevel && !isChild) flushMounts();
  };
  const buildComponentFromVNode = (dom, vnode, context, mountAll) => {
    let c = dom && dom._component;
    let originalComponent = c;
    let oldDom = dom;
    let isDirectOwner = c && dom._componentConstructor === vnode.nodeName;
    let isOwner = isDirectOwner;
    let props = getNodeProps(vnode);
    while (c && !isOwner && (c = c._parentComponent)) {
      isOwner = c.constructor === vnode.nodeName;
    }
    if (c && isOwner && (!mountAll || c._component)) {
      setComponentProps(c, props, 3, context, mountAll);
      dom = c.base;
    } else {
      if (originalComponent && !isDirectOwner) {
        unmountComponent(originalComponent);
        dom = oldDom = null;
      }
      c = createComponent(vnode.nodeName, props, context);
      if (dom && !c.nextBase) {
        c.nextBase = dom;
        oldDom = null;
      }
      setComponentProps(c, props, 1, context, mountAll);
      dom = c.base;
      if (oldDom && dom !== oldDom) {
        oldDom._component = null;
        recollectNodeTree(oldDom, false);
      }
    }
    return dom;
  };
  function unmountComponent(component) {
    let base = component.base;
    if (options.beforeUnmount) {
      options.beforeUnmount(component);
    }
    component._disable = true;
    if (component.componentWillUnmount) {
      component.componentWillUnmount();
    }
    component.base = null;
    var inner = component._component;
    if (inner) {
      unmountComponent(inner);
    } else if (base) {
      if (base[PREACT_ATTR] && base[PREACT_ATTR].ref) {
        base[PREACT_ATTR].ref(null);
      }
      component.nextBase = base;
      removeNode(base);
      collectComponent(component);
      removeChildren(base);
    }
    if (component.__ref) component.__ref(null);
  };
  function Component(props, context) {
    this._dirty = true;
    this.context = context;
    this.props = props;
    this.state = this.state || {};
  };
  Component.prototype.setState = function setState(state, callback) {
    let s = this.state;
    if (!this.prevState) {
      this.prevState = Object.assign({}, s);
    }
    Object.assign(s, typeof state === "function" ? state(s, this.props) : state);
    if (callback) {
      (this._renderCallbacks = this._renderCallbacks || []).push(callback);
    }
    enqueueRender(this);
  };
  Component.prototype.forceUpdate = function forceUpdate(callback) {
    if (callback) {
      (this._renderCallbacks = this._renderCallbacks || []).push(callback);
    }
    renderComponent(this, 2);
  };
  Component.prototype.render = function render() {};
  const render = (vnode, parent, merge) => diff(merge, vnode, {}, false, parent, false);
  global.preact = {
    createElement: h,
    cloneElement,
    Component,
    rerender,
    options,
    render,
    h
  };
}(this));