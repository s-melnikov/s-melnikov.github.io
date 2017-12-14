function template(name) {
  var node = document.querySelector(`#${name}-template`)
  return node ? node.innerHTML.trim() : ""
}

function getHistory() {
  function getCurrentLocation() {
    return {
      pathname: window.location.hash.slice(2)
    }
  }
  return {
    getCurrentLocation,
    listen: listener => {
      function onchange() { listener(getCurrentLocation()) }
      addEventListener("hashchange", onchange)
      return () => {
        removeEventListener("hashchange", onchange)
      }
    }
  }
}