var $http = {
  options: {
    root: ""
  },
  post: function(source, data) {
    var headers = new Headers()
    headers.append("Content-Type", "application/json");
    return fetch($http.options.root + source, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data)
    }).then(function(response) {
      return response.json()
    })
  }
}