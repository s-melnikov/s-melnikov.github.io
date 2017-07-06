(function() {

  function init() {
    fetch("README.md").then(resp => resp.text()).then(resp => render(resp))
  }

  function render(text) {
    var root = document.querySelector("#root"),
      menu = el("div", { id: "menu" }),
      content = el("div", { id: "content" })
    root.appendChild(menu)
    root.appendChild(content)
    content.innerHTML = marked(text)
    var headers = content.querySelectorAll("h1, h2, h3, h4, h5")
    var nextId = 0
    for (var i = 0, ln = headers.length; i < ln; i++) {
      headers[i].id = "anchor-" + nextId++
      menu.appendChild(
        el("a", {
          className: headers[i].tagName,
          href: "#" + headers[i].id,
          textContent: headers[i].textContent
        })
      )
    }
  }

  function el(name, props) {
    var el = document.createElement(name)
    for (var p in props) el[p] = props[p]
    return el
  }

  window.addEventListener("DOMContentLoaded", init)
})()