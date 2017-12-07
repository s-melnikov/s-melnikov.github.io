function $$(selector, context) {
  return (context || document).querySelectorAll(selector)
}

function $(selector, context) {
  return (context || document).querySelector(selector)
}
