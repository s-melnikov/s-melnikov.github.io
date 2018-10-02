/**
 * App
 */
(((root, factory) => {
  (typeof module === "undefined") ? (root.Mon = factory()) : (module.exports = factory())
})(this, () => {
  const expressionRE = /"[^"]*"|'[^']*'|\d+[a-zA-Z$_]\w*|\.[a-zA-Z$_]\w*|[a-zA-Z$_]\w*:|([a-zA-Z$_]\w*)/g;
  const escapeRE = /(?:(?:&(?:amp|gt|lt|nbsp|quot);)|"|\\|\n)/g;
  const whitespaceRE = /^\s+$/;
  const valueEndRE = /[\s/>]/;
  const forInRE = /\s+in\s+/;
  const globals = ["NaN", "false", "in", "null", "this", "true", "typeof", "undefined"];
  const selfClosedTags = ["hr", "br", "input", "img", "source"];
  const escapeMap = {
    "&amp;": '&',
    "&gt;": '>',
    "&lt;": '<',
    "&nbsp;": ' ',
    "&quot;": "\\\"",
    '\\': "\\\\",
    '"': "\\\"",
    '\n': "\\n"
  };
  const config = {
    silent: false
  };
  const components = {};
  const compileCache = {};

  const DEFAULT_NODE = 0;
  const RECYCLED_NODE = 1;
  const TEXT_NODE = 2;

  const XLINK_NS = "http://www.w3.org/1999/xlink";
  const SVG_NS = "http://www.w3.org/2000/svg";

  const EMPTY_OBJECT = {};
  const EMPTY_ARRAY = [];

  const map = EMPTY_ARRAY.map;
  const isArray = Array.isArray;

  const merge = (a, b) => {
    const target = {};
    for (let i in a) target[i] = a[i];
    for (let i in b) target[i] = b[i];
    return target;
  }

  const eventProxy = (event) => event.currentTarget.events[event.type](event);

  const updateProperty = (element, name, lastValue, nextValue, isSvg) => {
    if (name === "key") return;
    if (name === "style") {
      for (let i in merge(lastValue, nextValue)) {
        let style = nextValue == null || nextValue[i] == null ? "" : nextValue[i];
        if (i[0] === "-") {
          element[name].setProperty(i, style);
        } else {
          element[name][i] = style;
        }
      }
      return;
    }
    if (name[0] === "o" && name[1] === "n") {
      if (!element.events) element.events = {};
      element.events[(name = name.slice(2))] = nextValue
      if (nextValue == null) {
        element.removeEventListener(name, eventProxy);
      } else if (lastValue == null) {
        element.addEventListener(name, eventProxy);
      }
      return;
    }
    let nullOrFalse = nextValue == null || nextValue === false;
    if (
      name in element &&
      name !== "list" &&
      name !== "draggable" &&
      name !== "spellcheck" &&
      name !== "translate" &&
      !isSvg
    ) {
      element[name] = nextValue == null ? "" : nextValue
      if (nullOrFalse) {
        element.removeAttribute(name);
      }
      return;
    }
    let ns = isSvg && name !== (name = name.replace(/^xlink:?/, ""))
    if (ns) {
      if (nullOrFalse) {
        return element.removeAttributeNS(XLINK_NS, name);
      }
      return element.setAttributeNS(XLINK_NS, name, nextValue);
    } else {
      if (nullOrFalse) {
        return element.removeAttribute(name);
      }
      return element.setAttribute(name, nextValue);
    }
  }

  const createElement = (node, lifecycle, isSvg) => {
    let element;
    console.log(node);
    if (false) {

    } else if (node.type === TEXT_NODE) {
      element = document.createTextNode(node.name);
    } else if (isSvg = isSvg || node.name === "svg") {
      element = document.createElementNS(SVG_NS, node.name);
    } else {
      element = document.createElement(node.name);
    }
    let props = node.props
    if (props.oncreate) {
      lifecycle.push(function() {
        props.oncreate(element)
      });
    }
    for (let i = 0, length = node.children.length; i < length; i++) {
      element.appendChild(createElement(node.children[i], lifecycle, isSvg));
    }
    for (let name in props) {
      updateProperty(element, name, null, props[name], isSvg);
    }
    return (node.element = element);
  }

  const updateElement = function(
    element,
    lastProps,
    nextProps,
    lifecycle,
    isSvg,
    isRecycled
  ) {
    for (let name in merge(lastProps, nextProps)) {
      if (
        (name === "value" || name === "checked"
          ? element[name]
          : lastProps[name]) !== nextProps[name]
      ) {
        updateProperty(element, name, lastProps[name], nextProps[name], isSvg);
      }
    }
    let cb = isRecycled ? nextProps.oncreate : nextProps.onupdate;
    if (cb != null) {
      lifecycle.push(function() {
        cb(element, lastProps);
      })
    }
  };

  const removeChildren = (node) => {
    for (let i = 0, length = node.children.length; i < length; i++) {
      removeChildren(node.children[i]);
    }
    let cb = node.props.ondestroy;
    if (cb != null) {
      cb(node.element);
    }
    return node.element;
  };

  const removeElement = (parent, node) => {
    let remove = function() {
      parent.removeChild(removeChildren(node));
    }
    let cb = node.props && node.props.onremove
    if (cb != null) {
      cb(node.element, remove);
    } else {
      remove();
    }
  };

  const getKey = (node) => node == null ? null : node.key;

  const createKeyMap = (children, start, end) => {
    let out = {};
    let key;
    let node;
    for (; start <= end; start++) {
      if ((key = (node = children[start]).key) != null) {
        out[key] = node;
      }
    }
    return out;
  };

  const patchElement = function(
    parent,
    element,
    lastNode,
    nextNode,
    lifecycle,
    isSvg
  ) {
    if (nextNode === lastNode) {
    } else if (
      lastNode != null &&
      lastNode.type === TEXT_NODE &&
      nextNode.type === TEXT_NODE
    ) {
      if (lastNode.name !== nextNode.name) {
        element.nodeValue = nextNode.name;
      }
    } else if (lastNode == null || lastNode.name !== nextNode.name) {
      let newElement = parent.insertBefore(
        createElement(nextNode, lifecycle, isSvg),
        element
      );
      if (lastNode != null) removeElement(parent, lastNode);
      element = newElement;
    } else {
      updateElement(
        element,
        lastNode.props,
        nextNode.props,
        lifecycle,
        (isSvg = isSvg || nextNode.name === "svg"),
        lastNode.type === RECYCLED_NODE
      );
      let savedNode;
      let childNode;
      let lastKey;
      let lastChildren = lastNode.children;
      let lastChStart = 0;
      let lastChEnd = lastChildren.length - 1;
      let nextKey;
      let nextChildren = nextNode.children;
      let nextChStart = 0;
      let nextChEnd = nextChildren.length - 1;
      while (nextChStart <= nextChEnd && lastChStart <= lastChEnd) {
        lastKey = getKey(lastChildren[lastChStart]);
        nextKey = getKey(nextChildren[nextChStart]);
        if (lastKey == null || lastKey !== nextKey) break;
        patchElement(
          element,
          lastChildren[lastChStart].element,
          lastChildren[lastChStart],
          nextChildren[nextChStart],
          lifecycle,
          isSvg
        );
        lastChStart++;
        nextChStart++;
      };
      while (nextChStart <= nextChEnd && lastChStart <= lastChEnd) {
        lastKey = getKey(lastChildren[lastChEnd]);
        nextKey = getKey(nextChildren[nextChEnd]);
        if (lastKey == null || lastKey !== nextKey) break;
        patchElement(
          element,
          lastChildren[lastChEnd].element,
          lastChildren[lastChEnd],
          nextChildren[nextChEnd],
          lifecycle,
          isSvg
        );
        lastChEnd--;
        nextChEnd--;
      }

      if (lastChStart > lastChEnd) {
        while (nextChStart <= nextChEnd) {
          element.insertBefore(
            createElement(nextChildren[nextChStart++], lifecycle, isSvg),
            (childNode = lastChildren[lastChStart]) && childNode.element
          );
        }
      } else if (nextChStart > nextChEnd) {
        while (lastChStart <= lastChEnd) {
          removeElement(element, lastChildren[lastChStart++]);
        }
      } else {
        let lastKeyed = createKeyMap(lastChildren, lastChStart, lastChEnd);
        let nextKeyed = {};
        while (nextChStart <= nextChEnd) {
          lastKey = getKey((childNode = lastChildren[lastChStart]))
          nextKey = getKey(nextChildren[nextChStart])
          if (
            nextKeyed[lastKey] ||
            (nextKey != null && nextKey === getKey(lastChildren[lastChStart + 1]))
          ) {
            if (lastKey == null) {
              removeElement(element, childNode);
            }
            lastChStart++;
            continue;
          }
          if (nextKey == null || lastNode.type === RECYCLED_NODE) {
            if (lastKey == null) {
              patchElement(
                element,
                childNode && childNode.element,
                childNode,
                nextChildren[nextChStart],
                lifecycle,
                isSvg
              );
              nextChStart++;
            }
            lastChStart++;
          } else {
            if (lastKey === nextKey) {
              patchElement(
                element,
                childNode.element,
                childNode,
                nextChildren[nextChStart],
                lifecycle,
                isSvg
              );
              nextKeyed[nextKey] = true;
              lastChStart++;
            } else {
              if ((savedNode = lastKeyed[nextKey]) != null) {
                patchElement(
                  element,
                  element.insertBefore(
                    savedNode.element,
                    childNode && childNode.element
                  ),
                  savedNode,
                  nextChildren[nextChStart],
                  lifecycle,
                  isSvg
                );
                nextKeyed[nextKey] = true;
              } else {
                patchElement(
                  element,
                  childNode && childNode.element,
                  null,
                  nextChildren[nextChStart],
                  lifecycle,
                  isSvg
                );
              }
            }
            nextChStart++;
          }
        }
        while (lastChStart <= lastChEnd) {
          if (getKey((childNode = lastChildren[lastChStart++])) == null) {
            removeElement(element, childNode);
          }
        }
        for (let key in lastKeyed) {
          if (nextKeyed[key] == null) {
            removeElement(element, lastKeyed[key]);
          }
        }
      }
    }
    return (nextNode.element = element);
  };

  const createVNode = (name, props, children, element, key, type) => ({ name, props, children, element, key, type });

  const createTextVNode = (text, element) => createVNode(text, EMPTY_OBJECT, EMPTY_ARRAY, element, null, TEXT_NODE);

  const recycleChild = (element) => element.nodeType === 3 // Node.TEXT_NODE
      ? createTextVNode(element.nodeValue, element)
      : recycleElement(element);

  const recycleElement = (element) => createVNode(
    element.nodeName.toLowerCase(),
    EMPTY_OBJECT,
    map.call(element.childNodes, recycleChild),
    element,
    null,
    RECYCLED_NODE
  );

  const recycle = (container) => recycleElement(container.children[0]);

  const patch = (lastNode, nextNode, container) => {
    let lifecycle = [];
    patchElement(container, container.children[0], lastNode, nextNode, lifecycle);
    while (lifecycle.length > 0) lifecycle.pop()();
    return nextNode
  };

  const h = (name, props, ...args) => {
    let node;
    let rest = [];
    let children = [];
    let length = args.length;
    while (length-- > 0) rest.push(args[length]);
    if ((props = props == null ? {} : props).children != null) {
      if (rest.length <= 0) {
        rest.push(props.children);
      }
      delete props.children;
    }
    while (rest.length > 0) {
      if (isArray((node = rest.pop()))) {
        for (length = node.length; length-- > 0; ) {
          rest.push(node[length]);
        }
      } else if (node === false || node === true || node == null) {
      } else {
        children.push(typeof node === "object" ? node : createTextVNode(node));
      }
    }

    return typeof name === "function"
      ? name(props, (props.children = children))
      : createVNode(name, props, children, null, props.key, DEFAULT_NODE);
  };

  const error = (message) => {
    if (!config.silent) {
      console.error("[Moon] ERROR: " + message);
    }
  }

  const component = (name, options) => () => new Component(name, options);

  const isSelfClosedTag = (name) => selfClosedTags.indexOf(name) !== -1;

  const isComponentType = (type) => !!components[type];

  const parseComment = (index, input, length) => {
    while (index < length) {
      let char0 = input[index];
      let char1 = input[index + 1];
      let char2 = input[index + 2];
      if (char0 === "<" && char1 === "!" && char2 === "-" && input[index + 3] === "-") {
        index = parseComment(index + 4, input, length);
      } else if (char0 === "-" && char1 === "-" && char2 === ">") {
        index += 3;
        break;
      } else {
        index += 1;
      }
    }
    return index;
  };

  const parseOpeningTag = (index, input, length, stack) => {
    let element = {
      type: "",
      attributes: [],
      children: []
    };
    while (index < length) {
      let char = input[index];
      if (char === "/" || char === ">") {
        let attributes = element.attributes;
        let lastIndex = stack.length - 1;
        if (char === "/" || isSelfClosedTag(element.type)) {
          index += 1;
        } else {
          stack.push(element);
        }
        for (let i = 0; i < attributes.length;) {
          let attribute = attributes[i];
          if (isComponentType(attribute.key)) {
            element = {
              type: attribute.key,
              attributes: [{
                key: "",
                value: attribute.value,
                expression: attribute.expression,
                dynamic: attribute.dynamic
              }],
              children: [element]
            };
            attributes.splice(i, 1);
          } else {
            i += 1;
          }
        }
        stack[lastIndex].children.push(element);
        index += 1;
        break;
      } else if ((whitespaceRE.test(char) && (index += 1)) || char === "=") {
        index = parseAttributes(index, input, length, element.attributes);
      } else {
        element.type += char;
        index += 1;
      }
    }
    return index;
  };

  const parseText = (index, input, length, stack) => {
    let content = "";
    for (; index < length; index++) {
      let char = input[index];
      if (char === "<" || char === "{") {
        break;
      } else {
        content += char;
      }
    }
    if (!whitespaceRE.test(content)) {
      stack[stack.length - 1].children.push({
        type: "text",
        attributes: [{
          key: "",
          value: content.replace(escapeRE, (match) => { return escapeMap[match]; }),
          expression: false,
          dynamic: false
        }],
        children: []
      });
    }
    return index;
  };

  const parseExpression = (index, input, length, stack) => {
    let expression = "";
    for (; index < length; index++) {
      let char = input[index];
      if (char === "}") {
        index += 1;
        break;
      } else {
        expression += char;
      }
    }
    let template = parseTemplate(expression);
    stack[stack.length - 1].children.push({
      type: "text",
      attributes: [{
        key: "",
        value: template.expression,
        expression: true,
        dynamic: template.dynamic
      }],
      children: []
    });
    return index;
  };

  const parseClosingTag = (index, input, length, stack) => {
    let type = "";
    for(; index < length; index++) {
      let char = input[index];
      if (char === ">") {
        index += 1;
        break;
      } else {
        type += char;
      }
    }
    let lastElement = stack.pop();
    if (type !== lastElement.type) {
      error(("Unclosed tag \"" + (lastElement.type) + "\""));
    }
    return index;
  };

  const parseTemplate = (expression) => {
    let dynamic = false;
    expression = expression.replace(expressionRE, (match, name) => {
      if (name === undefined || globals.indexOf(name) !== -1) {
        return match;
      } else {
        dynamic = true;
        if (name[0] === "$") {
          return name;
        } else {
          return ("instance." + name);
        }
      }
    });
    return {
      expression,
      dynamic
    };
  };

  const parseAttributes = (index, input, length, attributes) => {
    while (index < length) {
      let char = input[index];
      if (char === "/" || char === ">") {
        break;
      } else if (whitespaceRE.test(char)) {
        index += 1;
        continue;
      } else {
        let key = "";
        let value = (void 0);
        let expression = false;
        while (index < length) {
          char = input[index];
          if (char === "/" || char === ">" || whitespaceRE.test(char)) {
            value = "";
            break;
          } else if (char === "=") {
            index += 1;
            break;
          } else {
            key += char;
            index += 1;
          }
        }
        if (value === undefined) {
          let quote = (void 0);
          value = "";
          char = input[index];
          if (char === "\"" || char === "'") {
            quote = char;
            index += 1;
          } else if (char === "{") {
            quote = "}";
            expression = true;
            index += 1;
          } else {
            quote = valueEndRE;
          }
          while (index < length) {
            char = input[index];
            if ((typeof quote === "object" && quote.test(char)) || char === quote) {
              index += 1;
              break;
            } else {
              value += char;
              index += 1;
            }
          }
        }
        let dynamic = false;
        if (expression) {
          let template = parseTemplate(value);
          value = template.expression;
          dynamic = template.dynamic;
        }
        attributes.push({
          key,
          value,
          expression,
          dynamic
        });
      }
    }
    return index;
  };

  const parse = (input) => {
    let length = input.length;
    let $root = {
      element: 0,
      referenceElement: 1,
      nextElement: 2,
      type: "Root",
      attributes: [],
      children: []
    };
    let stack = [$root];
    for (let i = 0; i < length;) {
      let char = input[i];
      if (char === "<") {
        if (input[i + 1] === "!" && input[i + 2] === "-" && input[i + 3] === "-") {
          i = parseComment(i + 4, input, length);
        } else if (input[i + 1] === "/") {
          i = parseClosingTag(i + 2, input, length, stack);
        } else {
          i = parseOpeningTag(i + 1, input, length, stack);
        }
      } else if (char === "{") {
        i = parseExpression(i + 1, input, length, stack);
      } else {
        i = parseText(i, input, length, stack);
      }
    }
    return $root;
  }

  const generateAll = (element) => {
    let { type, attributes, children } = element;
    switch (type) {
      case "if":
        return `((${attributes[0].value})?(${generateAll(children[0])}):null)`;
      case "text":
        let value = attributes[0].value;
        return attributes[0].expression ? `${value}` : `"${value}"`;
      case "for":
        let attr = element.attributes[0];
        let expr = attr.value.split(forInRE);
        let child = element.children[0];
        return `${expr[1]}.map((${expr[0]})=>${generateAll(child)})`;
      default:
        let childrenStr = children.map(child => generateAll(child)).join(",");
        if (childrenStr) childrenStr = `,${childrenStr}`;
        let attrStr = attributes.map(attr => {
          if (attr.key[0] === "@") {
            if (attr.key === "@bind") {
              return `value:${attr.value},oninput:event=>{instance.update({${attr.value.slice(9)}:event.target.value})}`;
            }
            return `on${attr.key.slice(1)}:($event)=>${attr.value}`
          } else {
            let str = `${attr.key}:`;
            return `${str}${attr.expression ? attr.value : `"${attr.value}"`}`;
          }
        }).join(",");
        attrStr = attrStr ? `{${attrStr}}` : "null";
        if (isComponentType(type)) {
          return `h(components.${type},${attrStr}${childrenStr})`;
        }
        return `h("${type}",${attrStr}${childrenStr})`;
    }
  }

  const compile = (input) => compileCache[input] || (compileCache[input] = generateAll(parse(input)));

  class Component {
    constructor(name, options) {
      this.$$name = name;
      this.$$events = {};
      let data;
      if (!options) {
        data = {};
      } else if (typeof options === "function") {
        data = options();
      } else {
        data = options;
      }
      this.$$view = typeof data.view === "string" ?
        new Function("h", "instance", "components", "return " + compile(data.view)) : data.view;
      delete data.view;
      if (data.onCreate) {
        this.$$events.create = data.onCreate.bind(this);
        delete data.onCreate;
      }
      if (data.onUpdate) {
        this.$$events.update = data.onUpdate.bind(this);
        delete data.onUpdate;
      }
      if (data.onDestroy) {
        this.$$events.destroy = data.onDestroy.bind(this);
        delete data.onDestroy;
      }
      for (let key in data) {
        let value = data[key];
        if (typeof value === "function") {
          this[key] = value.bind(this);
        } else {
          this[key] = value;
        }
      }
    }
    create(root) {
      let node = null;
      this.render = () => {
        node = patch(node, this.$$view(h, this, components), root);
      };
    }
    update(newState) {
      Object.assign(this, newState);
      this.render();
    }
    destroy() {

    }
    on(type, handler) {
      if (!this.$$events[type]) {
        this.$$events[type] = [];
      }
      this.$$events[type].push(handler);
    }
    off(type, handler) {
      if (!type) {
        this.$$events = {};
      } else if (!handler) {
        this.$$events[type] = [];
      } else {
        let handlers = this.$$events[type];
        handlers.splice(handlers.indexOf(handler), 1);
      }
    }
    emit(type, data) {
      let handlers = this.$$events[type];
      if (handlers) {
        if (typeof handlers === "function") {
          handlers(data);
        } else {
          for (let i = 0; i < handlers.length; i++) {
            handlers[i](data);
          }
        }
      }
    }
  }

  const extend = (name, options) => components[name] = component(name, options);

  components.if = true;
  components.for = true;

  function Mon(options) {
    let root = options.root;
    delete options.root;
    if (typeof root === "string") {
      root = document.querySelector(root);
    }
    const instance = component("", options)();
    instance.create(root);
    instance.update();
    return instance;
  };

  Mon.extend = extend;
  Mon.components = components;

  return Mon;
}));
