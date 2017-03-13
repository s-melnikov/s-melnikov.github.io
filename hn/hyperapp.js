// hyperapp@0.7.1 + hash routing

var hyperapp = function() {

  var h = function() {
    var i, node, children, stack = []

    return function h(tag, data) {
      var canConcat, oldCanConcat

      children = []
      i = arguments.length

      while (i-- > 2) {
        stack.push(arguments[i])
      }

      while (stack.length) {
        if (Array.isArray(node = stack.pop())) {
          i = node.length

          while (i--) {
            stack.push(node[i])
          }
        } else if (node != null && node !== true && node !== false) {
          // Ignore nulls and booleans; this is conditional rendering.

          if (typeof node === "number") {
            node = node + ""
          }

          // Concatenate contiguous number/string nodes into one string.
          // The idea is to avoid creating unnecessary text nodes.

          canConcat = typeof node === "string"

          if (canConcat && oldCanConcat) {
            children[children.length - 1] += node
          } else {
            children.push(node)
            oldCanConcat = canConcat
          }
        }
      }

      if (typeof tag === "function") {
        return tag(data, children)
      }

      return {
        tag: tag,
        data: data || {},
        children: children
      }
    }

  }()

  var SVG_NS = "http://www.w3.org/2000/svg"

  function app(app) {
    var view = app.view || function () {
      return ""
    }

    var model
    var actions = {}
    var subscriptions = []
    var hooks = {
      onError: [],
      onAction: [],
      onUpdate: [],
      onRender: []
    }

    var plugins = [app].concat((app.plugins || []).map(function (plugin) {
      return plugin(app)
    }))

    var node
    var root
    var batch = []

    for (var i = 0; i < plugins.length; i++) {
      var plugin = plugins[i]

      if (plugin.model !== undefined) {
        model = merge(model, plugin.model)
      }

      if (plugin.actions) {
        init(actions, plugin.actions)
      }

      if (plugin.subscriptions) {
        subscriptions = subscriptions.concat(plugin.subscriptions)
      }

      var _hooks = plugin.hooks
      if (_hooks) {
        Object.keys(_hooks).forEach(function (key) {
          hooks[key].push(_hooks[key])
        })
      }
    }

    function onError(error) {
      for (var i = 0; i < hooks.onError.length; i++) {
        hooks.onError[i](error)
      }

      if (i <= 0) {
        throw error
      }
    }

    function init(container, group, lastName) {
      Object.keys(group).forEach(function (key) {
        if (!container[key]) {
          container[key] = {}
        }

        var name = lastName ? lastName + "." + key : key
        var action = group[key]
        var i

        if (typeof action === "function") {
          container[key] = function (data) {
            for (i = 0; i < hooks.onAction.length; i++) {
              hooks.onAction[i](name, data)
            }

            var result = action(model, data, actions, onError)

            if (result === undefined || typeof result.then === "function") {
              return result

            } else {
              for (i = 0; i < hooks.onUpdate.length; i++) {
                hooks.onUpdate[i](model, result, data)
              }

              model = merge(model, result)
              render(model, view)
            }
          }
        } else {
          init(container[key], action, name)
        }
      })
    }

    load(function () {
      root = app.root || document.body.appendChild(document.createElement("div"))

      render(model, view)

      for (var i = 0; i < subscriptions.length; i++) {
        subscriptions[i](model, actions, onError)
      }
    })

    function load(fn) {
      if (document.readyState[0] !== "l") {
        fn()
      } else {
        document.addEventListener("DOMContentLoaded", fn)
      }
    }

    function render(model, view) {
      for (i = 0; i < hooks.onRender.length; i++) {
        view = hooks.onRender[i](model, view)
      }

      patch(root, node, node = view(model, actions), 0)

      for (var i = 0; i < batch.length; i++) {
        batch[i]()
      }

      batch = []
    }

    function merge(a, b) {
      var obj = {}
      var key

      if (isPrimitive(b) || Array.isArray(b)) {
        return b
      }

      for (key in a) {
        obj[key] = a[key]
      }
      for (key in b) {
        obj[key] = b[key]
      }

      return obj
    }

    function isPrimitive(type) {
      type = typeof type
      return type === "string" || type === "number" || type === "boolean"
    }

    function defer(fn, data) {
      setTimeout(function () {
        fn(data)
      }, 0)
    }

    function shouldUpdate(a, b) {
      return a.tag !== b.tag || typeof a !== typeof b || isPrimitive(a) && a !== b
    }

    function createElementFrom(node, isSVG) {
      var element

      // There are only two types of nodes. A string node, which is
      // converted into a Text node or an object that describes an
      // HTML element and may also contain children.

      if (typeof node === "string") {
        element = document.createTextNode(node)

      } else {
        element = (isSVG = isSVG || node.tag === "svg")
          ? document.createElementNS(SVG_NS, node.tag)
          : document.createElement(node.tag)

        for (var name in node.data) {
          if (name === "onCreate") {
            defer(node.data[name], element)
          } else {
            setElementData(element, name, node.data[name])
          }
        }

        for (var i = 0; i < node.children.length; i++) {
          element.appendChild(createElementFrom(node.children[i], isSVG))
        }
      }

      return element
    }

    function removeElementData(element, name, value) {
      element[name] = value
      element.removeAttribute(name)
    }

    function setElementData(element, name, value, oldValue) {
      if (name === "style") {
        for (var i in value) {
          element.style[i] = value[i]
        }

      } else if (name[0] === "o" && name[1] === "n") {
        var event = name.substr(2).toLowerCase()

        element.removeEventListener(event, oldValue)
        element.addEventListener(event, value)

      } else if (value === false) {
        removeElementData(element, name, value)

      } else {
        element.setAttribute(name, value)

        if (element.namespaceURI !== SVG_NS) {
          if (element.type === "text") {
            var oldSelStart = element.selectionStart
            var oldSelEnd = element.selectionEnd
          }

          element[name] = value

          if (oldSelStart >= 0) {
            element.setSelectionRange(oldSelStart, oldSelEnd)
          }
        }
      }
    }

    function updateElementData(element, data, oldData) {
      for (var name in merge(oldData, data)) {
        var value = data[name]
        var oldValue = oldData[name]
        var realValue = element[name]

        if (value === undefined) {
          removeElementData(element, name, value)

        } else if (name === "onUpdate") {
          defer(value, element)

        } else if (
          value !== oldValue ||
          typeof realValue === "boolean" &&
          realValue !== value
        ) {
          // This prevents cases where the node's data is out of sync with
          // the element's. For example, a list of checkboxes in which one
          // of the elements is recycled.

          setElementData(element, name, value, oldValue)
        }
      }
    }

    function patch(parent, oldNode, node, index) {
      if (oldNode === undefined) {
        parent.appendChild(createElementFrom(node))

      } else if (node === undefined) {
        var element = parent.childNodes[index]

        // Removing a child one at a time updates the DOM, so we end up
        // with an index out of date that needs to be adjusted. Instead,
        // collect all the elements and delete them in a batch.

        batch.push(parent.removeChild.bind(parent, element))

        if (oldNode && oldNode.data && oldNode.data.onRemove) {
          defer(oldNode.data.onRemove, element)
        }

      } else if (shouldUpdate(node, oldNode)) {
        parent.replaceChild(createElementFrom(node), parent.childNodes[index])

      } else if (node.tag) {
        var element = parent.childNodes[index]

        updateElementData(element, node.data, oldNode.data)

        var len = node.children.length, oldLen = oldNode.children.length

        for (var i = 0; i < len || i < oldLen; i++) {
          var child = node.children[i]

          patch(element, oldNode.children[i], child, i)
        }
      }
    }
  }

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

return { h, app, Router }

}()