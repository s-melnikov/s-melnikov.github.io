function promise(ex) {
  var e = {}, r = {}
  r.then = function (resolve, reject) {
    e.resolve = resolve || function() {},
    e.reject = reject || function() {}
  }
  try {
    ex(function() { e.resolve.apply(this, arguments) },
      function() { e.reject.apply(this, arguments) })
  } catch (e) { e.reject(e) }
  return r
}

function ajax(url) {
  return promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 400) {
        resolve({
          status: xhr.status,
          text: function() { return xhr.responseText },
          ok: true,
          json: function() {
            try { return JSON.parse(xhr.responseText) } catch(e) { return null }
          },
          xml: function() {
            return xhr.responseXML
          }
        })
      } else reject({status: xhr.status})
    };
    xhr.onerror = reject
    xhr.send()
  })
}

ajax("index.html")
  .then(function(response) { console.info(response) });