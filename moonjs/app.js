/**
 * Moon v1.0.1
 */
(((root, factory) => {
  (typeof module === "undefined") ? (root.App = factory()) : (module.exports = factory())
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

  function error(message) {
    if (!config.silent) {
      console.error("[Moon] ERROR: " + message);
    }
  }

  function component(name, options) {
    return () => new Component(name, options);
  }

  function isSelfClosedTag(name) {
    return selfClosedTags.indexOf(name) !== -1;
  }

  function isComponentType(type) {
    return !!components[type];
  }

  function parseComment(index, input, length) {
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

  function parseOpeningTag(index, input, length, stack) {
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

  function parseText(index, input, length, stack) {
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

  function parseExpression(index, input, length, stack) {
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

  function parseClosingTag(index, input, length, stack) {
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

  function parseTemplate(expression) {
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

  function parseAttributes(index, input, length, attributes) {
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

  function parse(input) {
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

  function generateAll(element) {
    switch (element.type) {
      case "if":
        let condition =
        console.log(element)
        return `(${element.attributes[0]})`;
      case "for":
        return [];
    }
  }

  function generate(root, reference) {
    for (let i = 0; i < root.children.length; i++) {
      let generated = generateAll(root.children[i]);
      console.log(generated)
    }
    // let prelude = "let " + (getElement(root.element));
    // for (let i$1 = root.element + 1; i$1 < root.nextElement; i$1++) {
    //   prelude += "," + getElement(i$1);
    // }
    // return (prelude + ";return [(_0)=>{" + (setElement(root.element, "_0;")) + create + "},()=>{" + update + "},()=>{" + destroy + "}];");
  }

  function compile(input) {
    return compileCache[input] || (compileCache[input] = generate(parse(input), null));
  }

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
      if (typeof data.view === "string") {
        let m = {};
        this.$$view = new Function("m", "instance", "locals", compile(data.view))(m, this, {});
      } else {
        // this.$$view = data.view(m, this, {});
      }
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
    create (root) {
    }
    update(key, value) {
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

  function extend(name, options) {
    components[name] = component(name, options);
  };

  components.if = true;
  components.for = true;

  function App(options) {
    let root = options.root;
    delete options.root;
    if (typeof root === "string") {
      root = document.querySelector(root);
    }
    let instance = component("", options)();
    console.log(instance);
    // instance.create(root);
    // instance.update();
    // return instance;
  };

  return App;
}));
