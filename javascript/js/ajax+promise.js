function promise(ex) {
  var e = {}, r = {};
  ["then", "error"].forEach(function(n) {
    r[n] = function() {
      if (typeof arguments[0] === "function") e[n] = arguments[0]
      else e[n] && e[n].apply(this, arguments)
      return this;
    }
  });
  ex(r.then, r.error);
  return r;
}

function ajax(url) {
  return promise(function(resolve, reject) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) resolve(request.responseText)
      else reject("Status: " + request.status)
    };
    request.onerror = reject;
    request.send();
  });
}

ajax("index.html")
  .then(function(response) { console.info(response) })
  .error(function(error) { console.warn(error) });