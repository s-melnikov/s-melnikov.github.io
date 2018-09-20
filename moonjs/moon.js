/**
 * Moon v1.0.1
 */
(((root, factory) => {
  (typeof module === "undefined") ? (root.Moon = factory()) : (module.exports = factory())
})(this, () => {
  let expressionRE = /"[^"]*"|'[^']*'|\d+[a-zA-Z$_]\w*|\.[a-zA-Z$_]\w*|[a-zA-Z$_]\w*:|([a-zA-Z$_]\w*)/g;
  let escapeRE = /(?:(?:&(?:amp|gt|lt|nbsp|quot);)|"|\\|\n)/g;
  let whitespaceRE = /^\s+$/;
  let valueEndRE = /[\s/>]/;
  let uppercaseRE = /[A-Z]/
  let globals = ["NaN", "false", "in", "null", "this", "true", "typeof", "undefined"];
  let selfClosedTags = ["hr", "br", "input", "img", "source"];
  let escapeMap = {
    "&amp;": '&',
    "&gt;": '>',
    "&lt;": '<',
    "&nbsp;": ' ',
    "&quot;": "\\\"",
    '\\': "\\\\",
    '"': "\\\"",
    '\n': "\\n"
  };
  let config = {
    silent: false
  };
  let components = {};
  let compileCache = {};

  let error = message => !config.silent && console.error("[Moon] ERROR: " + message);

  let component = (name, options) => () => new MoonComponent(name, options);

  let isSelfClosedTag = name => selfClosedTags.indexOf(name) !== -1;

  let isComponentType = type => uppercaseRE.test(type[0]);

  let compile = input => compileCache[input] || (compileCache[input] = generate(parse(input), null));

  let parseTemplate = (expression) => {
    let dynamic = false;
    expression = expression.replace(expressionRE, (match, name) => {
      if (name === undefined || globals.indexOf(name) !== -1) {
        return match;
      } else {
        dynamic = true;
        if (name[0] === "$") {
          return ("locals." + name);
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

  let parseAttributes = (index, input, length, attributes) => {
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
          expression: expression,
          dynamic: dynamic
        });
      }
    }
    return index;
  };

  let parseOpeningTag = (index, input, length, stack) => {
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

  let parseClosingTag = (index, input, length, stack) => {
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

  let parseComment = (index, input, length) => {
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

  let parseText = (index, input, length, stack) => {
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
        type: "Text",
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

  let parseExpression = (index, input, length, stack) => {
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
      type: "Text",
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

  let parse = (input) => {
    let length = input.length;
    let root = {
      element: 0,
      referenceElement: 1,
      nextElement: 2,
      type: "Root",
      attributes: [],
      children: []
    };
    let stack = [root];
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
    return root;
  };

  let getElement = element => ("m" + element);

  let setElement = (element, code) => ((getElement(element)) + "=" + code);

  let createElement = type => ("m.ce(\"" + type + "\");");

  let createTextNode = content => ("m.ctn(" + content + ");");

  let createComment = () => "m.cc();";

  let attributeValue = attribute =>
    attribute.expression ? attribute.value : ("\"" + (attribute.value) + "\"");

  let setAttribute = (element, attribute) =>
    ("m.sa(" + (getElement(element)) + ",\"" + (attribute.key) + "\"," + (attributeValue(attribute)) + ");");

  let addEventListener = (element, type, handler) =>
    ("m.ael(" + (getElement(element)) + ",\"" + type + "\"," + handler + ");");

  let setTextContent = (element, content) => ("m.stc(" + (getElement(element)) + "," + content + ");");

  let appendChild = (element, parent) =>  ("m.ac(" + (getElement(element)) + "," + (getElement(parent)) + ");");

  let removeChild = (element, parent) =>
    ("m.rc(" + (getElement(element)) + "," + (getElement(parent)) + ");");

  let insertBefore = (element, reference, parent) =>
    ("m.ib(" + (getElement(element)) + "," + (getElement(reference)) + "," + (getElement(parent)) + ");");

  let directiveIf = (ifState, ifConditions, ifPortions, ifParent) =>
    ("m.di(" + (getElement(ifState)) + "," + (getElement(ifConditions)) + "," + (getElement(ifPortions)) +
      "," + (getElement(ifParent)) + ");");

  let directiveFor = (forIdentifiers, forLocals, forValue, forPortion, forPortions, forParent) =>
    ("m.df(" + forIdentifiers + "," + (getElement(forLocals)) + "," + forValue + "," + (getElement(forPortion)) +
      "," + (getElement(forPortions)) + "," + (getElement(forParent)) + ");");

  let generateMount = (element, parent, reference) =>
    reference === null ? appendChild(element, parent) : insertBefore(element, reference, parent);

  let generateAll = (element, parent, root, reference) => {
    switch (element.type) {
      case "If": {
        let ifState = root.nextElement++;
        let ifReference = root.nextElement++;
        let ifConditions = root.nextElement++;
        let ifPortions = root.nextElement++;
        let ifConditionsCode = "[";
        let ifPortionsCode = "[";
        let separator = "";
        let siblings = parent.children;
        for (let i = siblings.indexOf(element); i < siblings.length; i++) {
          let sibling = siblings[i];
          if (sibling.type === "If" || sibling.type === "ElseIf" || sibling.type === "Else") {
            ifConditionsCode += separator + (sibling.type === "Else" ? "true" : attributeValue(sibling.attributes[0]));
            ifPortionsCode += separator + "((locals)=>{" + generate({
              element: root.nextElement,
              nextElement: root.nextElement + 1,
              type: "Root",
              attributes: [],
              children: sibling.children
            }, ifReference) + "})({})";
            separator = ",";
          } else {
            break;
          }
        }
        return [
          setElement(ifReference, createComment()) +
          generateMount(ifReference, parent.element, reference) +
          setElement(ifPortions, ifPortionsCode + "];"),
          setElement(ifConditions, ifConditionsCode + "];") +
          setElement(ifState, directiveIf(ifState, ifConditions, ifPortions, parent.element)),
          getElement(ifState) + "[2]();"
        ];
      }
      case "ElseIf":
      case "Else": {
        return ["", "", ""];
      }
      case "For": {
        let forAttribute = attributeValue(element.attributes[0]);
        let forIdentifiers = "[";
        let forValue = "";
        let forReference = root.nextElement++;
        let forPortion = root.nextElement++;
        let forPortions = root.nextElement++;
        let forLocals = root.nextElement++;
        let forIdentifier = "", separator$1 = "";
        for (let i$1 = 0; i$1 < forAttribute.length; i$1++) {
          let char = forAttribute[i$1];
          if (char === "," || (char === " " && forAttribute[i$1 + 1] === "i" && forAttribute[i$1 + 2] === "n" && forAttribute[i$1 + 3] === " " && (i$1 += 3))) {
            forIdentifiers += separator$1 + "\"" + forIdentifier.substring(7) + "\"";
            forIdentifier = "";
            separator$1 = ",";
          } else {
            forIdentifier += char;
          }
        }
        forIdentifiers += "]";
        forValue += forIdentifier;
        return [
          setElement(forReference, createComment()) +
          generateMount(forReference, parent.element, reference) +
          setElement(forPortion, "(locals)=>{" + generate({
            element: root.nextElement,
            nextElement: root.nextElement + 1,
            type: "Root",
            attributes: [],
            children: element.children
          }, forReference) + "};") +
          setElement(forPortions, "[];") +
          setElement(forLocals, "[];"),
          directiveFor(forIdentifiers, forLocals, forValue, forPortion, forPortions, parent.element),
          directiveFor(forIdentifiers, forLocals, "[]", forPortion, forPortions, parent.element) ];
      }
      case "Text": {
        let textAttribute = element.attributes[0];
        let textElement = root.nextElement++;

        let textCode = setTextContent(textElement, attributeValue(textAttribute));
        let createCode = setElement(textElement, createTextNode("\"\""));
        let updateCode = "";

        if (textAttribute.dynamic) {
          updateCode += textCode;
        } else {
          createCode += textCode;
        }
        return [createCode + generateMount(textElement, parent.element, reference), updateCode, removeChild(textElement, parent.element)];
      }
      default: {
        let attributes = element.attributes;
        let children = element.children;
        if (isComponentType(element.type)) {
          element.component = root.nextElement++;
          let createCode$1 = setElement(element.component, ("m.c." + (element.type) + "();"));
          let updateCode$1 = "";
          let dynamic = false;
          for (let i$2 = 0; i$2 < attributes.length; i$2++) {
            let attribute = attributes[i$2];
            if (attribute.key[0] === "@") {
              createCode$1 += (getElement(element.component)) + ".on(\"" + (attribute.key.substring(1)) + "\",($event)=>{locals.$event=$event;" + (attributeValue(attribute)) + ";});";
            } else {
              let attributeCode = (getElement(element.component)) + "." + (attribute.key) + "=" + (attributeValue(attribute)) + ";";
              if (attribute.dynamic) {
                dynamic = true;
                updateCode$1 += attributeCode;
              } else {
                createCode$1 += attributeCode;
              }
            }
          }
          createCode$1 += (getElement(element.component)) + ".create(" + (getElement(parent.element)) + ");";
          if (dynamic) {
            updateCode$1 += (getElement(element.component)) + ".update();";
          } else {
            createCode$1 += (getElement(element.component)) + ".update();";
          }
          return [
            createCode$1,
            updateCode$1,
            ((getElement(element.component)) + ".destroy();")
          ];
        } else {
          element.element = root.nextElement++;
          let createCode$2 = setElement(element.element, createElement(element.type));
          let updateCode$2 = "";
          for (let i$3 = 0; i$3 < attributes.length; i$3++) {
            let attribute$1 = attributes[i$3];
            let attributeCode$1 = (void 0);
            if (attribute$1.key[0] === "@") {
              let eventType = (void 0), eventHandler = (void 0);
              if (attribute$1.key === "@bind") {
                let bindVariable = attributeValue(attribute$1);
                attributeCode$1 = (getElement(element.element)) + ".value=" + bindVariable + ";";
                eventType = "input";
                eventHandler = bindVariable + "=$event.target.value;instance.update();";
              } else {
                attributeCode$1 = "";
                eventType = attribute$1.key.substring(1);
                eventHandler =  "locals.$event=$event;" + (attributeValue(attribute$1)) + ";";
              }
              createCode$2 += addEventListener(element.element, eventType, ("(($event) => {" + eventHandler + "})"));
            } else {
              attributeCode$1 = setAttribute(element.element, attribute$1);
            }
            if (attribute$1.dynamic) {
              updateCode$2 += attributeCode$1;
            } else {
              createCode$2 += attributeCode$1;
            }
          }
          for (let i$4 = 0; i$4 < children.length; i$4++) {
            let childCode = generateAll(children[i$4], element, root, null);
            createCode$2 += childCode[0];
            updateCode$2 += childCode[1];
          }
          return [createCode$2 + generateMount(element.element, parent.element, reference), updateCode$2, removeChild(element.element, parent.element)];
        }
      }
    }
  };

  let generate = (root, reference) => {
    let children = root.children;
    let create = "";
    let update = "";
    let destroy = "";
    for (let i = 0; i < children.length; i++) {
      let generated = generateAll(children[i], root, root, reference);
      create += generated[0];
      update += generated[1];
      destroy += generated[2];
    }
    let prelude = "let " + (getElement(root.element));
    for (let i$1 = root.element + 1; i$1 < root.nextElement; i$1++) {
      prelude += "," + getElement(i$1);
    }
    return (prelude + ";return [(_0)=>{" + (setElement(root.element, "_0;")) + create + "},()=>{" + update + "},()=>{" + destroy + "}];");
  };

  let m = {
    c: components,
    ce(type) {
      return document.createElement(type);
    },
    ctn(content) {
      return document.createTextNode(content);
    },
    cc() {
      return document.createComment("");
    },
    sa(element, key, value) {
      if (value === false || value === null) {
        element.removeAttribute(key);
      } else {
        element.setAttribute(key, value);
      }
    },
    ael(element, type, handler) {
      element.addEventListener(type, handler);
    },
    stc(element, content) {
      element.textContent = content;
    },
    ac(element, parent) {
      parent.appendChild(element);
    },
    rc(element, parent) {
      parent.removeChild(element);
    },
    ib(element, reference, parent) {
      parent.insertBefore(element, reference);
    },
    di(ifState, ifConditions, ifPortions, ifParent) {
      for (let i = 0; i < ifConditions.length; i++) {
        if (ifConditions[i]) {
          let ifPortion = ifPortions[i];
          if (ifState === ifPortion) {
            ifPortion[1]();
          } else {
            if (ifState) {
              ifState[2]();
            }
            ifPortion[0](ifParent);
            ifPortion[1]();
            ifState = ifPortion;
          }
          return ifState;
        }
      }
    },
    df(forIdentifiers, forLocals, forValue, forPortion, forPortions, forParent) {
      let previousLength = forPortions.length;
      let nextLength = forValue.length;
      let maxLength = previousLength > nextLength ? previousLength : nextLength;
      let keyIdentifier = forIdentifiers[1];
      let valueIdentifier = forIdentifiers[0];
      for (let i = 0; i < maxLength; i++) {
        if (i >= previousLength) {
          let forLocal = {};
          forLocal[keyIdentifier] = i;
          forLocal[valueIdentifier] = forValue[i];
          forLocals[i] = forLocal;
          let newForPortion = forPortion(forLocal);
          forPortions.push(newForPortion);
          newForPortion[0](forParent);
          newForPortion[1]();
        } else if (i >= nextLength) {
          forPortions.pop()[2]();
        } else {
          let forLocal$1 = forLocals[i];
          forLocal$1[keyIdentifier] = i;
          forLocal$1[valueIdentifier] = forValue[i];
          forPortions[i][1]();
        }
      }
    }
  };

  class MoonComponent {
    constructor(name, options) {
      let this$1 = this;
      this._name = name;
      this._queued = false;
      let data;
      if (options === undefined) {
        data = {};
      } else if (typeof options === "function") {
        data = options();
      } else {
        data = options;
      }
      if (typeof data.view === "string") {
        this._view = new Function("m", "instance", "locals", compile(data.view))(m, this, {});
      } else {
        this._view = data.view(m, this, {});
      }
      delete data.view;
      let events = {};
      if (data.onCreate) {
        events.create = data.onCreate.bind(this);
        delete data.onCreate;
      }
      if (data.onUpdate) {
        events.update = data.onUpdate.bind(this);
        delete data.onUpdate;
      }
      if (data.onDestroy) {
        events.destroy = data.onDestroy.bind(this);
        delete data.onDestroy;
      }
      this._events = events;
      for (let key in data) {
        let value = data[key];
        if (typeof value === "function") {
          this$1[key] = value.bind(this$1);
        } else {
          this$1[key] = value;
        }
      }
    }
    create (root) {
      this._view[0](root);
      this.emit("create");
    }
    update(key, value) {
      let this$1 = this;
      if (key !== undefined) {
        if (typeof key === "object") {
          for (let childKey in key) {
            this$1[childKey] = key[childKey];
          }
        } else {
          this[key] = value;
        }
      }
      if (this._queued === false) {
        this._queued = true;
        let instance = this;
        setTimeout(() => {
          instance._view[1]();
          instance._queued = false;
          instance.emit("update");
        }, 0);
      }
    }
    destroy() {
      this._view[2]();
      this.emit("destroy");
    }
    on(type, handler) {
      let events = this._events;
      let handlers = events[type];
      if (handlers === undefined) {
        events[type] = [handler];
      } else {
        handlers.push(handler);
      }
    }
    off(type, handler) {
      if (type === undefined) {
        this._events = {};
      } else if (handler === undefined) {
        this._events[type] = [];
      } else {
        let handlers = this._events[type];
        handlers.splice(handlers.indexOf(handler), 1);
      }
    }
    emit(type, data) {
      let handlers = this._events[type];
      if (handlers !== undefined) {
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

  function Moon(options) {
    let root = options.root;
    delete options.root;
    if (typeof root === "string") {
      root = document.querySelector(root);
    }
    let instanceComponent = component("", options);
    let instance = instanceComponent();
    instance.create(root);
    instance.update();
    return instance;
  }
  Moon.extend = (name, options) => {
    components[name] = component(name, options);
  };
  Moon.parse = parse;
  Moon.generate = generate;
  Moon.compile = compile;
  Moon.config = config;

  return Moon;
}));