function request(path, params, callback) {
  var xhr = new XMLHttpRequest()
  xhr.open(params.method, path, true)
  xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 400) {
      try {
        var data = JSON.parse(xhr.responseText)
      } catch (e) {
        return callback({ type: "JSON_PARSE_ERROR", e: e })
      }
      callback(null, data)
    } else {
      callback({ type: "REQUEST_SERVER_ERROR", status: xhr.status })
    }
  }
  xhr.onerror = function(e) {
    callback({ type: "REQUEST_CONNECTION_ERROR", e: e })
  }
  xhr.send(params.body ? JSON.stringify(params.body) : null)
}

function $$(query, context) {
  return [].slice.call((context || document).querySelectorAll(query))
}

function $(query, context) {
  var nodes = $$(query, context)
  return nodes && nodes[0]
}