function Router(options) {
  return {
    model: {
      router: match(options.view, location.hash)
    },
    actions: {
      router: {
        match: function (_, data) {
          return {
            router: match(options.view, data)
          }
        },
        go: function (_, data, actions) {
          actions.router.match(data)
        }
      }
    },
    hooks: {
      onRender: function (model) {
        return options.view[model.router.match]
      }
    },
    subscriptions: [
      function (_, actions) {
        addEventListener("hashchange", function () {
          actions.router.match(location.hash)
        })
      }
    ]
  }
}

function match(routes, path) {
  var match, params = {}
  for (var route in routes) {
    var keys = []

    if (route === "*") {
      continue
    }

    (path.slice(2) || '/').replace(new RegExp("^" + route
      .replace(/\//g, "\\/")
      .replace(/:([A-Za-z0-9_]+)/g, function (_, key) {
        keys.push(key)
        return "([-A-Za-z0-9_.]+)"
      }) + "/?$", "g"), function () {
        for (var i = 1; i < arguments.length - 2; i++) {
          params[keys.shift()] = arguments[i]
        }
        match = route
      })
    if (match) {
      break
    }
  }

  return {
    match: match || "*",
    params: params
  }
}