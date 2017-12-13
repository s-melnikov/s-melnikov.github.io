function template(name) {
  var node = document.querySelector(`#${name}-template`)
  return node ? node.innerHTML.trim() : ""
}