function h(strings, ...args) {
  let result = ``;
  for(let i = 0; i < args.length; i++) result += strings[i] + args[i]
  result += strings[strings.length - 1]

  const template = document.createElement(`template`);
  template.innerHTML = result;

  const content = template.content;

  content.collect = ({attr = 'ref', keepAttribute, assign = {}} = {}) => {
    const refElements = content.querySelectorAll(`[${attr}]`);
    return [...refElements].reduce((acc, element) => {
      const propName = element.getAttribute(attr).trim();
      !keepAttribute && (element.removeAttribute(attr));
      acc[propName] = element;
      return acc;
    }, assign);
  }

  return content;
}


/**
 * Usage
 */
// Create a <b> DOM element
let node = h`<b>Hello World</b>`;
document.body.appendChild(node);

// Create nested elements, and extract references
let node = h`
<div>
  <h1 ref="title">Façon</h1>
  <p ref="body>Create nested DOM elements with manner<p>
</div>
`
document.body.appendChild(node);

let {title, body} = node.collect();
title.textContent = 'Hello World';


/**
 * node.collect(options)
 */
const node = f`<div><b ref='bold'>Hello World</b></div>`;
let {bold} = node.collect();
// ~> bold is a dom reference to the inner <b> element
// ~> node is by default the outer most element.


/**
 *
 */
class MyElement extends Component {
  view() {
    const view = f`
      <div>
        <h1 ref="title">Façon</h1>
        <p ref="body>Create nested DOM elements with manner<p>
      </div>
    `;
    view.collect({assign:this});
  }

  update() {
    this.title = 'Hello World';
    this.body = 'tesst';
  }
}