const preact = (() => {

const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;

function assign(obj, props) {
  for (let i in props) obj[i] = props[i];
  return obj;
}

function removeNode(node) {
  let parentNode = node.parentNode;
  if (parentNode) parentNode.removeChild(node);
}

function catchError(error, vnode) {
  let component, ctor, handled;
  const wasHydrating = vnode._hydrating;
  for (; (vnode = vnode._parent); ) {
    if ((component = vnode._component) && !component._processingException) {
      try {
        ctor = component.constructor;        
        if (handled) {
          vnode._hydrating = wasHydrating;
          return (component._pendingError = component);
        }
      } catch (e) {
        error = e;
      }
    }
  }
  throw error;
}

let virtualNodeId = 0;
const options = {};

function h(type, props, children) {
  let normalizedProps = {},
    key,
    ref,
    i;
  for (i in props) {
    if (i == "key") key = props[i];
    else if (i == "ref") ref = props[i];
    else normalizedProps[i] = props[i];
  }
  if (arguments.length > 3) {
    children = [children];
    for (i = 3; i < arguments.length; i++) {
      children.push(arguments[i]);
    }
  }
  if (children != null) {
    normalizedProps.children = children;
  }
  if (typeof type == "function" && type.defaultProps != null) {
    for (i in type.defaultProps) {
      if (normalizedProps[i] === undefined) {
        normalizedProps[i] = type.defaultProps[i];
      }
    }
  }
  return createVNode(type, normalizedProps, key, ref, null);
}

function createVNode(type, props, key, ref, original) {
  const vnode = {
    type,
    props,
    key,
    ref,
    _children: null,
    _parent: null,
    _depth: 0,
    _dom: null,
    _nextDom: undefined,
    _component: null,
    _hydrating: null,
    constructor: undefined,
    _original: original == null ? ++virtualNodeId : original
  };
  if (options.vnode != null) options.vnode(vnode);
  return vnode;
}

function createRef() {
  return { current: null };
}

function Fragment(props) {
  return props.children;
}

function Component(props, context) {
  this.props = props;
  this.context = context;
}

Component.prototype.render = Fragment;

function getDomSibling(vnode, childIndex) {
  if (childIndex == null) {
    return vnode._parent
      ? getDomSibling(vnode._parent, vnode._parent._children.indexOf(vnode) + 1)
      : null;
  }
  let sibling;
  for (; childIndex < vnode._children.length; childIndex++) {
    sibling = vnode._children[childIndex];
    if (sibling != null && sibling._dom != null) {
      return sibling._dom;
    }
  }
  return typeof vnode.type == "function" ? getDomSibling(vnode) : null;
}

function renderComponent(component) {
  let vnode = component._vnode,
    oldDom = vnode._dom,
    parentDom = component._parentDom;
  if (parentDom) {
    let commitQueue = [];
    const oldVNode = assign({}, vnode);
    oldVNode._original = vnode._original + 1;
    diff(
      parentDom,
      vnode,
      oldVNode,
      component._globalContext,
      parentDom.ownerSVGElement !== undefined,
      vnode._hydrating != null ? [oldDom] : null,
      commitQueue,
      oldDom == null ? getDomSibling(vnode) : oldDom,
      vnode._hydrating
    );
    commitRoot(commitQueue, vnode);
    if (vnode._dom != oldDom) {
      updateParentDomPointers(vnode);
    }
  }
}

function updateParentDomPointers(vnode) {
  if ((vnode = vnode._parent) != null && vnode._component != null) {
    vnode._dom = vnode._component.base = null;
    for (let i = 0; i < vnode._children.length; i++) {
      let child = vnode._children[i];
      if (child != null && child._dom != null) {
        vnode._dom = vnode._component.base = child._dom;
        break;
      }
    }
    return updateParentDomPointers(vnode);
  }
}

let rerenderQueue = [];

const defer =
  typeof Promise == "function"
    ? Promise.prototype.then.bind(Promise.resolve())
    : setTimeout;

let prevDebounce;

function enqueueRender(c) {
  if (
    (!c._dirty &&
      (c._dirty = true) &&
      rerenderQueue.push(c) &&
      !process._rerenderCount++) ||
    prevDebounce !== options.debounceRendering
  ) {
    prevDebounce = options.debounceRendering;
    (prevDebounce || defer)(process);
  }
}

function process() {
  let queue;
  while ((process._rerenderCount = rerenderQueue.length)) {
    queue = rerenderQueue.sort((a, b) => a._vnode._depth - b._vnode._depth);
    rerenderQueue = [];
    queue.some(c => {
      if (c._dirty) renderComponent(c);
    });
  }
}
process._rerenderCount = 0;

function diffChildren(
  parentDom,
  renderResult,
  newParentVNode,
  oldParentVNode,
  globalContext,
  isSvg,
  excessDomChildren,
  commitQueue,
  oldDom,
  isHydrating
) {
  let i, j, oldVNode, childVNode, newDom, firstChildDom, refs;
  let oldChildren = (oldParentVNode && oldParentVNode._children) || EMPTY_ARR;
  let oldChildrenLength = oldChildren.length;
  if (oldDom == EMPTY_OBJ) {
    if (excessDomChildren != null) {
      oldDom = excessDomChildren[0];
    } else if (oldChildrenLength) {
      oldDom = getDomSibling(oldParentVNode, 0);
    } else {
      oldDom = null;
    }
  }
  newParentVNode._children = [];
  for (i = 0; i < renderResult.length; i++) {
    childVNode = renderResult[i];
    if (childVNode == null || typeof childVNode == "boolean") {
      childVNode = newParentVNode._children[i] = null;
    }
    else if (typeof childVNode == "string" || typeof childVNode == "number") {
      childVNode = newParentVNode._children[i] = createVNode(
        null,
        childVNode,
        null,
        null,
        childVNode
      );
    } else if (Array.isArray(childVNode)) {
      childVNode = newParentVNode._children[i] = createVNode(
        Fragment,
        { children: childVNode },
        null,
        null,
        null
      );
    } else if (childVNode._dom != null || childVNode._component != null) {
      childVNode = newParentVNode._children[i] = createVNode(
        childVNode.type,
        childVNode.props,
        childVNode.key,
        null,
        childVNode._original
      );
    } else {
      childVNode = newParentVNode._children[i] = childVNode;
    }
    if (childVNode == null) {
      continue;
    }
    childVNode._parent = newParentVNode;
    childVNode._depth = newParentVNode._depth + 1;
    oldVNode = oldChildren[i];

    if (
      oldVNode === null ||
      (oldVNode &&
        childVNode.key == oldVNode.key &&
        childVNode.type === oldVNode.type)
    ) {
      oldChildren[i] = undefined;
    } else {
      for (j = 0; j < oldChildrenLength; j++) {
        oldVNode = oldChildren[j];
        if (
          oldVNode &&
          childVNode.key == oldVNode.key &&
          childVNode.type === oldVNode.type
        ) {
          oldChildren[j] = undefined;
          break;
        }
        oldVNode = null;
      }
    }
    oldVNode = oldVNode || EMPTY_OBJ;
    diff(
      parentDom,
      childVNode,
      oldVNode,
      globalContext,
      isSvg,
      excessDomChildren,
      commitQueue,
      oldDom,
      isHydrating
    );
    newDom = childVNode._dom;
    if ((j = childVNode.ref) && oldVNode.ref != j) {
      if (!refs) refs = [];
      if (oldVNode.ref) refs.push(oldVNode.ref, null, childVNode);
      refs.push(j, childVNode._component || newDom, childVNode);
    }
    if (newDom != null) {
      if (firstChildDom == null) {
        firstChildDom = newDom;
      }
      if (
        typeof childVNode.type == "function" &&
        childVNode._children === oldVNode._children
      ) {
        childVNode._nextDom = oldDom = reorderChildren(
          childVNode,
          oldDom,
          parentDom
        );
      } else {
        oldDom = placeChild(
          parentDom,
          childVNode,
          oldVNode,
          oldChildren,
          excessDomChildren,
          newDom,
          oldDom
        );
      }
      if (!isHydrating && newParentVNode.type == "option") {
        parentDom.value = "";
      } else if (typeof newParentVNode.type == "function") {
        newParentVNode._nextDom = oldDom;
      }
    } else if (
      oldDom &&
      oldVNode._dom == oldDom &&
      oldDom.parentNode != parentDom
    ) {
      oldDom = getDomSibling(oldVNode);
    }
  }
  newParentVNode._dom = firstChildDom;
  if (excessDomChildren != null && typeof newParentVNode.type != "function") {
    for (i = excessDomChildren.length; i--; ) {
      if (excessDomChildren[i] != null) removeNode(excessDomChildren[i]);
    }
  }
  for (i = oldChildrenLength; i--; ) {
    if (oldChildren[i] != null) unmount(oldChildren[i], oldChildren[i]);
  }
  if (refs) {
    for (i = 0; i < refs.length; i++) {
      applyRef(refs[i], refs[++i], refs[++i]);
    }
  }
}

function reorderChildren(childVNode, oldDom, parentDom) {
  for (let tmp = 0; tmp < childVNode._children.length; tmp++) {
    let vnode = childVNode._children[tmp];
    if (vnode) {
      vnode._parent = childVNode;
      if (typeof vnode.type == "function") {
        reorderChildren(vnode, oldDom, parentDom);
      } else {
        oldDom = placeChild(
          parentDom,
          vnode,
          vnode,
          childVNode._children,
          null,
          vnode._dom,
          oldDom
        );
      }
    }
  }
  return oldDom;
}

function toChildArray(children, out) {
  out = out || [];
  if (children == null || typeof children == "boolean") {
  } else if (Array.isArray(children)) {
    children.some(child => {
      toChildArray(child, out);
    });
  } else {
    out.push(children);
  }
  return out;
}

function placeChild(
  parentDom,
  childVNode,
  oldVNode,
  oldChildren,
  excessDomChildren,
  newDom,
  oldDom
) {
  let nextDom;
  if (childVNode._nextDom !== undefined) {
    nextDom = childVNode._nextDom;
    childVNode._nextDom = undefined;
  } else if (
    excessDomChildren == oldVNode ||
    newDom != oldDom ||
    newDom.parentNode == null
  ) {
    outer: if (oldDom == null || oldDom.parentNode !== parentDom) {
      parentDom.appendChild(newDom);
      nextDom = null;
    } else {
      for (
        let sibDom = oldDom, j = 0;
        (sibDom = sibDom.nextSibling) && j < oldChildren.length;
        j += 2
      ) {
        if (sibDom == newDom) {
          break outer;
        }
      }
      parentDom.insertBefore(newDom, oldDom);
      nextDom = oldDom;
    }
  }
  if (nextDom !== undefined) {
    oldDom = nextDom;
  } else {
    oldDom = newDom.nextSibling;
  }
  return oldDom;
}

function diffProps(dom, newProps, oldProps, isSvg, hydrate) {
  let i;
  for (i in oldProps) {
    if (i !== "children" && i !== "key" && !(i in newProps)) {
      setProperty(dom, i, null, oldProps[i], isSvg);
    }
  }
  for (i in newProps) {
    if (
      (!hydrate || typeof newProps[i] == "function") &&
      i !== "children" &&
      i !== "key" &&
      i !== "value" &&
      i !== "checked" &&
      oldProps[i] !== newProps[i]
    ) {
      setProperty(dom, i, newProps[i], oldProps[i], isSvg);
    }
  }
}

function setStyle(style, key, value) {
  if (key[0] === "-") {
    style.setProperty(key, value);
  } else if (value == null) {
    style[key] = "";
  } else if (typeof value != "number" || IS_NON_DIMENSIONAL.test(key)) {
    style[key] = value;
  } else {
    style[key] = value + "px";
  }
}

function setProperty(dom, name, value, oldValue, isSvg) {
  let useCapture, nameLower, proxy;
  if (isSvg && name == "className") name = "class";
  if (name === "style") {
    if (typeof value == "string") {
      dom.style.cssText = value;
    } else {
      if (typeof oldValue == "string") {
        dom.style.cssText = oldValue = "";
      }
      if (oldValue) {
        for (name in oldValue) {
          if (!(value && name in value)) {
            setStyle(dom.style, name, "");
          }
        }
      }
      if (value) {
        for (name in value) {
          if (!oldValue || value[name] !== oldValue[name]) {
            setStyle(dom.style, name, value[name]);
          }
        }
      }
    }
  }
  else if (name[0] === "o" && name[1] === "n") {
    useCapture = name !== (name = name.replace(/Capture$/, ""));
    nameLower = name.toLowerCase();
    if (nameLower in dom) name = nameLower;
    name = name.slice(2);
    if (!dom._listeners) dom._listeners = {};
    dom._listeners[name + useCapture] = value;
    proxy = useCapture ? eventProxyCapture : eventProxy;
    if (value) {
      if (!oldValue) dom.addEventListener(name, proxy, useCapture);
    } else {
      dom.removeEventListener(name, proxy, useCapture);
    }
  } else if (
    name !== "list" &&
    name !== "tagName" &&
    name !== "form" &&
    name !== "type" &&
    name !== "size" &&
    name !== "download" &&
    name !== "href" &&
    !isSvg &&
    name in dom
  ) {
    dom[name] = value == null ? "" : value;
  } else if (typeof value != "function" && name !== "dangerouslySetInnerHTML") {
    if (name !== (name = name.replace(/xlink:?/, ""))) {
      if (value == null || value === false) {
        dom.removeAttributeNS(
          "http://www.w3.org/1999/xlink",
          name.toLowerCase()
        );
      } else {
        dom.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          name.toLowerCase(),
          value
        );
      }
    } else if (
      value == null ||
      (value === false && !/^ar/.test(name))
    ) {
      dom.removeAttribute(name);
    } else {
      dom.setAttribute(name, value);
    }
  }
}

function eventProxy(e) {
  this._listeners[e.type + false](options.event ? options.event(e) : e);
}

function eventProxyCapture(e) {
  this._listeners[e.type + true](options.event ? options.event(e) : e);
}

function diff(
  parentDom,
  newVNode,
  oldVNode,
  globalContext,
  isSvg,
  excessDomChildren,
  commitQueue,
  oldDom,
  isHydrating
) {
  let tmp,
    newType = newVNode.type;
  if (newVNode.constructor !== undefined) return null;
  if (oldVNode._hydrating != null) {
    isHydrating = oldVNode._hydrating;
    oldDom = newVNode._dom = oldVNode._dom;
    newVNode._hydrating = null;
    excessDomChildren = [oldDom];
  }

  if ((tmp = options._diff)) tmp(newVNode);

  try {
    outer: if (typeof newType == "function") {
      let c, isNew, oldProps, oldState, clearProcessingException;
      let newProps = newVNode.props;
      tmp = newType.contextType;
      let provider = tmp && globalContext[tmp._id];
      let componentContext = tmp
        ? provider
          ? provider.props.value
          : tmp._defaultValue
        : globalContext;
      if (oldVNode._component) {
        c = newVNode._component = oldVNode._component;
        clearProcessingException = c._processingException = c._pendingError;
      } else {
        newVNode._component = c = new Component(newProps, componentContext);
        c.constructor = newType;
        c.render = doRender;
        if (provider) provider.sub(c);
        c.props = newProps;
        if (!c.state) c.state = {};
        c.context = componentContext;
        c._globalContext = globalContext;
        isNew = c._dirty = true;
        c._renderCallbacks = [];
      }
      if (c._nextState == null) {
        c._nextState = c.state;
      }
      oldProps = c.props;
      oldState = c.state;
      if (!isNew) {
        if (
          (!c._force &&
            c.shouldComponentUpdate != null &&
            c.shouldComponentUpdate(
              newProps,
              c._nextState,
              componentContext
            ) === false) ||
          newVNode._original === oldVNode._original
        ) {
          c.props = newProps;
          c.state = c._nextState;
          if (newVNode._original !== oldVNode._original) c._dirty = false;
          c._vnode = newVNode;
          newVNode._dom = oldVNode._dom;
          newVNode._children = oldVNode._children;
          if (c._renderCallbacks.length) {
            commitQueue.push(c);
          }
          break outer;
        }
      }
      c.context = componentContext;
      c.props = newProps;
      c.state = c._nextState;
      if ((tmp = options._render)) tmp(newVNode);
      c._dirty = false;
      c._vnode = newVNode;
      c._parentDom = parentDom;
      tmp = c.render(c.props, c.state, c.context);
      c.state = c._nextState;
      if (c.getChildContext != null) {
        globalContext = assign(assign({}, globalContext), c.getChildContext());
      }
      let isTopLevelFragment =
        tmp != null && tmp.type == Fragment && tmp.key == null;
      let renderResult = isTopLevelFragment ? tmp.props.children : tmp;
      diffChildren(
        parentDom,
        Array.isArray(renderResult) ? renderResult : [renderResult],
        newVNode,
        oldVNode,
        globalContext,
        isSvg,
        excessDomChildren,
        commitQueue,
        oldDom,
        isHydrating
      );
      c.base = newVNode._dom;
      newVNode._hydrating = null;
      if (c._renderCallbacks.length) {
        commitQueue.push(c);
      }
      if (clearProcessingException) {
        c._pendingError = c._processingException = null;
      }
      c._force = false;
    } else if (
      excessDomChildren == null &&
      newVNode._original === oldVNode._original
    ) {
      newVNode._children = oldVNode._children;
      newVNode._dom = oldVNode._dom;
    } else {
      newVNode._dom = diffElementNodes(
        oldVNode._dom,
        newVNode,
        oldVNode,
        globalContext,
        isSvg,
        excessDomChildren,
        commitQueue,
        isHydrating
      );
    }
    if ((tmp = options.diffed)) tmp(newVNode);
  } catch (e) {
    newVNode._original = null;
    if (isHydrating || excessDomChildren != null) {
      newVNode._dom = oldDom;
      newVNode._hydrating = !!isHydrating;
      excessDomChildren[excessDomChildren.indexOf(oldDom)] = null;
    }
    catchError(e, newVNode, oldVNode);
  }
}

function commitRoot(commitQueue, root) {
  if (options._commit) options._commit(root, commitQueue);
  commitQueue.some(c => {
    try {
      commitQueue = c._renderCallbacks;
      c._renderCallbacks = [];
      commitQueue.some(cb => {
        cb.call(c);
      });
    } catch (e) {
      catchError(e, c._vnode);
    }
  });
}

function diffElementNodes(
  dom,
  newVNode,
  oldVNode,
  globalContext,
  isSvg,
  excessDomChildren,
  commitQueue,
  isHydrating
) {
  let i;
  let oldProps = oldVNode.props;
  let newProps = newVNode.props;
  isSvg = newVNode.type === "svg" || isSvg;
  if (excessDomChildren != null) {
    for (i = 0; i < excessDomChildren.length; i++) {
      const child = excessDomChildren[i];
      if (
        child != null &&
        ((newVNode.type === null
          ? child.nodeType === 3
          : child.localName === newVNode.type) ||
          dom == child)
      ) {
        dom = child;
        excessDomChildren[i] = null;
        break;
      }
    }
  }
  if (dom == null) {
    if (newVNode.type === null) {
      return document.createTextNode(newProps);
    }
    dom = isSvg
      ? document.createElementNS("http://www.w3.org/2000/svg", newVNode.type)
      : document.createElement(
          newVNode.type,
          newProps.is && { is: newProps.is }
        );
    excessDomChildren = null;
    isHydrating = false;
  }
  if (newVNode.type === null) {
    if (oldProps !== newProps && (!isHydrating || dom.data !== newProps)) {
      dom.data = newProps;
    }
  } else {
    if (excessDomChildren != null) {
      excessDomChildren = EMPTY_ARR.slice.call(dom.childNodes);
    }
    oldProps = oldVNode.props || EMPTY_OBJ;
    let oldHtml = oldProps.dangerouslySetInnerHTML;
    let newHtml = newProps.dangerouslySetInnerHTML;
    if (!isHydrating) {
      if (excessDomChildren != null) {
        oldProps = {};
        for (let i = 0; i < dom.attributes.length; i++) {
          oldProps[dom.attributes[i].name] = dom.attributes[i].value;
        }
      }
      if (newHtml || oldHtml) {
        if (
          !newHtml ||
          ((!oldHtml || newHtml.__html != oldHtml.__html) &&
            newHtml.__html !== dom.innerHTML)
        ) {
          dom.innerHTML = (newHtml && newHtml.__html) || "";
        }
      }
    }
    diffProps(dom, newProps, oldProps, isSvg, isHydrating);
    if (newHtml) {
      newVNode._children = [];
    } else {
      i = newVNode.props.children;
      diffChildren(
        dom,
        Array.isArray(i) ? i : [i],
        newVNode,
        oldVNode,
        globalContext,
        newVNode.type === "foreignObject" ? false : isSvg,
        excessDomChildren,
        commitQueue,
        EMPTY_OBJ,
        isHydrating
      );
    }
    if (!isHydrating) {
      if (
        "value" in newProps &&
        (i = newProps.value) !== undefined &&
        (i !== dom.value || (newVNode.type === "progress" && !i))
      ) {
        setProperty(dom, "value", i, oldProps.value, false);
      }
      if (
        "checked" in newProps &&
        (i = newProps.checked) !== undefined &&
        i !== dom.checked
      ) {
        setProperty(dom, "checked", i, oldProps.checked, false);
      }
    }
  }
  return dom;
}

function applyRef(ref, value, vnode) {
  try {
    if (typeof ref == "function") ref(value);
    else ref.current = value;
  } catch (e) {
    catchError(e, vnode);
  }
}

function unmount(vnode, parentVNode, skipRemove) {
  let r;
  if (options.unmount) options.unmount(vnode);
  if ((r = vnode.ref)) {
    if (!r.current || r.current === vnode._dom) applyRef(r, null, parentVNode);
  }
  let dom;
  if (!skipRemove && typeof vnode.type != "function") {
    skipRemove = (dom = vnode._dom) != null;
  }
  vnode._dom = vnode._nextDom = undefined;
  if ((r = vnode._component) != null) {
    if (r.componentWillUnmount) {
      try {
        r.componentWillUnmount();
      } catch (e) {
        catchError(e, parentVNode);
      }
    }
    r.base = r._parentDom = null;
  }
  if ((r = vnode._children)) {
    for (let i = 0; i < r.length; i++) {
      if (r[i]) unmount(r[i], parentVNode, skipRemove);
    }
  }
  if (dom != null) removeNode(dom);
}

function doRender(props, state, context) {
  return this.constructor(props, context);
}

const IS_HYDRATE = EMPTY_OBJ;

function render(vnode, parentDom, replaceNode) {
  if (options._root) options._root(vnode, parentDom);
  let isHydrating = replaceNode === IS_HYDRATE;
  let oldVNode = isHydrating
    ? null
    : (replaceNode && replaceNode._children) || parentDom._children;
  vnode = h(Fragment, null, [vnode]);
  let commitQueue = [];
  diff(
    parentDom,
    ((isHydrating ? parentDom : replaceNode || parentDom)._children = vnode),
    oldVNode || EMPTY_OBJ,
    EMPTY_OBJ,
    parentDom.ownerSVGElement !== undefined,
    replaceNode && !isHydrating
      ? [replaceNode]
      : oldVNode
      ? null
      : parentDom.childNodes.length
      ? EMPTY_ARR.slice.call(parentDom.childNodes)
      : null,
    commitQueue,
    replaceNode || EMPTY_OBJ,
    isHydrating
  );
  commitRoot(commitQueue, vnode);
}


let contextIterator = 0;

function createContext(defaultValue, contextId) {
  contextId = "__cC" + contextIterator++;
  const context = {
    _id: contextId,
    _defaultValue: defaultValue,
    Consumer(props, contextValue) {
      return props.children(contextValue);
    },
    Provider(props, subs, ctx) {
      if (!this.getChildContext) {
        subs = [];
        ctx = {};
        ctx[contextId] = this;
        this.getChildContext = () => ctx;
        this.shouldComponentUpdate = function(_props) {
          if (this.props.value !== _props.value) {
            subs.some(enqueueRender);
          }
        };
        this.sub = c => {
          subs.push(c);
          c.componentWillUnmount = () => {
            subs.splice(subs.indexOf(c), 1);
          };
        };
      }
      return props.children;
    }
  };
  return (context.Provider._contextRef = context.Consumer.contextType = context);
}

let currentIndex;
let currentComponent;
let previousComponent;
let currentHook = 0;
let afterPaintEffects = [];
let oldBeforeDiff = options._diff;
let oldBeforeRender = options._render;
let oldAfterDiff = options.diffed;
let oldCommit = options._commit;
let oldBeforeUnmount = options.unmount;
const RAF_TIMEOUT = 100;
let prevRaf;

options._diff = vnode => {
  currentComponent = null;
  if (oldBeforeDiff) oldBeforeDiff(vnode);
};

options._render = vnode => {
  if (oldBeforeRender) oldBeforeRender(vnode);
  currentComponent = vnode._component;
  currentIndex = 0;
  const hooks = currentComponent.__hooks;
  if (hooks) {
    hooks._pendingEffects.forEach(invokeCleanup);
    hooks._pendingEffects.forEach(invokeEffect);
    hooks._pendingEffects = [];
  }
};

options.diffed = vnode => {
  if (oldAfterDiff) oldAfterDiff(vnode);
  const c = vnode._component;
  if (c && c.__hooks && c.__hooks._pendingEffects.length) {
    afterPaint(afterPaintEffects.push(c));
  }
  currentComponent = previousComponent;
};

options._commit = (vnode, commitQueue) => {
  commitQueue.some(component => {
    try {
      component._renderCallbacks.forEach(invokeCleanup);
      component._renderCallbacks = component._renderCallbacks.filter(cb =>
        cb._value ? invokeEffect(cb) : true
      );
    } catch (e) {
      commitQueue.some(c => {
        if (c._renderCallbacks) c._renderCallbacks = [];
      });
      commitQueue = [];
      catchError(e, component._vnode);
    }
  });
  if (oldCommit) oldCommit(vnode, commitQueue);
};

options.unmount = vnode => {
  if (oldBeforeUnmount) oldBeforeUnmount(vnode);
  const c = vnode._component;
  if (c && c.__hooks) {
    try {
      c.__hooks._list.forEach(invokeCleanup);
    } catch (e) {
      catchError(e, c._vnode);
    }
  }
};

function getHookState(index, type) {
  if (options._hook) {
    options._hook(currentComponent, index, currentHook || type);
  }
  currentHook = 0;
  const hooks =
    currentComponent.__hooks ||
    (currentComponent.__hooks = {
      _list: [],
      _pendingEffects: []
    });
  if (index >= hooks._list.length) {
    hooks._list.push({});
  }
  return hooks._list[index];
}

function useState(initialState) {
  currentHook = 1;
  return useReducer(invokeOrReturn, initialState);
}

function useReducer(reducer, initialState, init) {
  const hookState = getHookState(currentIndex++, 2);
  hookState._reducer = reducer;
  if (!hookState._component) {
    hookState._value = [
      !init ? invokeOrReturn(undefined, initialState) : init(initialState),
      action => {
        const nextValue = hookState._reducer(hookState._value[0], action);
        if (hookState._value[0] !== nextValue) {
          hookState._value = [nextValue, hookState._value[1]];
          enqueueRender(hookState._component);
        }
      }
    ];
    hookState._component = currentComponent;
  }
  return hookState._value;
}

function useEffect(callback, args) {
  const state = getHookState(currentIndex++, 3);
  if (!options._skipEffects && argsChanged(state._args, args)) {
    state._value = callback;
    state._args = args;
    currentComponent.__hooks._pendingEffects.push(state);
  }
}

function useLayoutEffect(callback, args) {
  const state = getHookState(currentIndex++, 4);
  if (!options._skipEffects && argsChanged(state._args, args)) {
    state._value = callback;
    state._args = args;
    currentComponent._renderCallbacks.push(state);
  }
}

function useRef(initialValue) {
  currentHook = 5;
  return useMemo(() => ({ current: initialValue }), []);
}

function useImperativeHandle(ref, createHandle, args) {
  currentHook = 6;
  useLayoutEffect(
    () => {
      if (typeof ref == "function") ref(createHandle());
      else if (ref) ref.current = createHandle();
    },
    args == null ? args : args.concat(ref)
  );
}

function useMemo(factory, args) {
  const state = getHookState(currentIndex++, 7);
  if (argsChanged(state._args, args)) {
    state._value = factory();
    state._args = args;
    state._factory = factory;
  }
  return state._value;
}

function useCallback(callback, args) {
  currentHook = 8;
  return useMemo(() => callback, args);
}

function useContext(context) {
  const provider = currentComponent.context[context._id];
  const state = getHookState(currentIndex++, 9);
  state._context = context;
  if (!provider) return context._defaultValue;
  if (state._value == null) {
    state._value = true;
    provider.sub(currentComponent);
  }
  return provider.props.value;
}

function flushAfterPaintEffects() {
  afterPaintEffects.forEach(component => {
    if (component._parentDom) {
      try {
        component.__hooks._pendingEffects.forEach(invokeCleanup);
        component.__hooks._pendingEffects.forEach(invokeEffect);
        component.__hooks._pendingEffects = [];
      } catch (e) {
        component.__hooks._pendingEffects = [];
        catchError(e, component._vnode);
      }
    }
  });
  afterPaintEffects = [];
}

let HAS_RAF = typeof requestAnimationFrame == "function";

function afterNextFrame(callback) {
  const done = () => {
    clearTimeout(timeout);
    if (HAS_RAF) cancelAnimationFrame(raf);
    setTimeout(callback);
  };
  const timeout = setTimeout(done, RAF_TIMEOUT);
  let raf;
  if (HAS_RAF) {
    raf = requestAnimationFrame(done);
  }
}

function afterPaint(newQueueLength) {
  if (newQueueLength === 1 || prevRaf !== options.requestAnimationFrame) {
    prevRaf = options.requestAnimationFrame;
    (prevRaf || afterNextFrame)(flushAfterPaintEffects);
  }
}

function invokeCleanup(hook) {
  const comp = currentComponent;
  if (typeof hook._cleanup == "function") hook._cleanup();
  currentComponent = comp;
}

function invokeEffect(hook) {
  const comp = currentComponent;
  hook._cleanup = hook._value();
  currentComponent = comp;
}

function argsChanged(oldArgs, newArgs) {
  return (
    !oldArgs ||
    oldArgs.length !== newArgs.length ||
    newArgs.some((arg, index) => arg !== oldArgs[index])
  );
}

function invokeOrReturn(arg, f) {
  return typeof f == "function" ? f(arg) : f;
}

return {
  h,
  render,
  useState,
  useReducer,
  useEffect,
  useLayoutEffect,
  useRef,
  useImperativeHandle,
  useMemo,
  useCallback,
  useContext,
};
})();