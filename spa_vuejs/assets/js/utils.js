var $http = {
  options: {
    root: ""
  },
  post: function(source, data) {
    return fetch($http.options.root + source, {
      method: "POST",
      body: JSON.stringify(data)
    }).then(function(response) {
      return response.json()
    })
  }
}