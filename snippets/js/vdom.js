function h(name, attrs, ...children) {
  if (typeof name === "function") {
    return name({ ...attrs, children });
  }
  return { name, attrs, children };
}   
const ATTR_TYPES = ["list", "type", "draggable"]; 
function updateAttribute(element, name, value) {
  if (name.startsWith("on")) {
    const eventName = name.slice(2);
    if (!element.events) {
      element.events = {};
    }
    element.events[name] = value;
    if (value) {
      element.addEventListener(name, eventListener);
    } else {
      element.removeEventListener(name, eventListener);
    }
    return;
  } 
  if (name in element && name !== "type") {
    element[name] = value == null ? "" : value;
  } else if (value != null && value !== false) {
    element.setAttribute(name, value);
  }
  if (value == null || value === false) {
    element.removeAttribute(name);
  }
}  
function createElement(node) {
  if (!node) return null;
  if (typeof node === "string" || typeof node === "number") {        
    return document.createTextNode(node);
  }
  const element = document.createElement(node.name);     
  for (var i = 0; i < node.children.length; i++) {
    element.appendChild(
      createElement(node.children[i])
    );
  }
  if (node.attrs) {
    for (let name in node.attrs) {
      updateAttribute(element, name, node.attrs[name]);
    }
  }
  return element;
}  
function render(parent, virtual) {
  console.log({ parent, virtual })
  const el = createElement(virtual);
  parent.appendChild(el);
}
function eventListener(event) {
  return event.currentTarget.events[event.type](event);
}        
function App({ xml }) {
  console.log({ xml });
  return h("div", { class: "test" }, "Lorem ipsum");
}