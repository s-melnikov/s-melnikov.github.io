var h = hyperapp.h
var parser = document.createElement("a")
function url(href) {
  parser.href = href
  return parser
}

firebase.initializeApp({
  apiKey: "AIzaSyCtnyc1b7CUzQPWAVVgPGc3JxF9o2VLPfc",
  authDomain: "microjs-1c074.firebaseapp.com",
  databaseURL: "https://microjs-1c074.firebaseio.com",
  storageBucket: "microjs-1c074.appspot.com"
})

var state = {
  items: [],
  input: "",
  user: null
}

var actions = {
  items: function(state, actions, items) {
    return { items: items }
  },
  input: function(state, actions, input) {
    return { input: input }
  },
  user: function(state, actions, user) {
    return { user: user }
  }
}

var events = {
  loaded: function(state, actions) {
    firebase.database().ref("items").on("value", function(snapshot) {
        var items = []
        var source = snapshot.val()
        for (var prop in source) {
          source[prop].uid = prop
          items.push(source[prop])
        }
        actions.items(items)
      })
    firebase.auth().onAuthStateChanged(function(user) {
      actions.user(user)
    });
  }
}

var Views = {}

Views.Index = function(state, actions) {
  return h("div", { "class": "container" },
    Views.Search(state, actions),
    state.user && h("div", { class: "header" },
      h("a", { href: "#/new" }, "New item")
    ),
    state.items.length ?
      Views.Items(state, actions) :
      h("div", { "class": "loader" })
  )
}

Views.Search = function(state, actions) {
  return h("input", {
    type: "search",
    value: state.input,
    oninput: function(e) {
      actions.input(e.target.value)
    }
  })
}

Views.Items = function(state, actions) {
  var input = state.input
  var tag = input.indexOf("#") === 0 ? input.slice(1) : null
  var items = state.items
  if (tag) {
    console.log(tag)
    items = state.items.filter(function(item) {
      return item.tags.indexOf(tag) > -1
    })
  } else if (input.length > 1) {
    input = input.toLowerCase()
    items = state.items.filter(function(item) {
      return item.name.toLowerCase().indexOf(input) > -1
    }).concat(state.items.filter(function(item) {
      return item.description.toLowerCase().indexOf(input) > -1
    }))
  }
  return h("div", { "class": "items" },
    items.map(function(item) {
      return Views.Item(state, actions, item)
    })
  )
}

Views.Item = function(state, actions, item) {
  return h("div", { "class": "item" },
    state.user && Views.Control(item),
    h("div", { "class": "name" },
      h("a", { href: item.url, target: "_blank" }, item.name)
    ),
    h("div", { "class": "desc" }, item.description),
    h("div", { "class": "tags" },
      item.tags && item.tags.map(function(tag) {
        return h("span", {
          onclick: function() {
            actions.input("#" + tag)
          }
        }, tag)
      })
    )
  )
}

Views.Control = function(item) {
  return h("div", { class: "control" },
    h("a", { href: "#/edit/" + item.uid, class: "edit" }, "edit"),
    h("span", {
      onclick: function() {
        if (confirm("Are you sure to delete \"" + item.name + "\"")) {
          firebase.database().ref("items/" + item.uid).remove()
        }
      }
    }, "del")
  )
}

Views.SignIn = function(state, actions) {
  var email = "",
    password = ""
  return h("div", { id: "sign-in" },
    h("input", {
      type: "email",
      placeholder: "Email",
      value: "",
      onchange: function(e) { email = this.value }
    }),
    h("input", {
      type: "password",
      placeholder: "Password",
      value: "",
      onchange: function(e) { password = this.value }
    }),
    h("button", {
      onclick: function() {
        firebase.auth().signInWithEmailAndPassword(email, password)
          .catch(function(error) { alert(error.message) })
          .then(function(user) { if (user) location.hash = "#" })
      }
    }, "Sign In")
  )
}

Views.SignOut = function() {
  firebase.auth().signOut().then(function() { location.hash = "#" })
  return h("div", { "class": "loader" })
}

Views.Edit = function(state, actions) {
  var uid = state.router.params.uid,
    name = "",
    description = "",
    size = "",
    tags = "",
    url = ""
  if (uid) {
    state.items.map(function(item) {
      if (item.uid === uid) {
        name = item.name
        description = item.description
        size = item.size
        tags = item.tags.join(", ")
        url = item.url
      }
    })
  }
  return uid && !(name && description && size && tags && url) ?
    h("div", { "class": "loader" }) :
    h("div", { id: "edit" },
      h("a", { href: "#", class: "mb-15" }, "Return"),
      h("input", {
        placeholder: "Name",
        value: name,
        onchange: function() { name = this.value }
      }),
      h("textarea", {
        placeholder: "Description",
        rows: 5,
        value: description,
        onchange: function() { description = this.value }
      }),
      h("input", {
        placeholder: "Size",
        value: size,
        onchange: function() { size = this.value }
      }),
      h("input", {
        placeholder: "Tags",
        value: tags,
        onchange: function() { tags = this.value }
      }),
      h("input", {
        placeholder: "Url",
        value: url,
        onchange: function() { url = this.value }
      }),
      h("button", {
        onclick: function() {
          var data = {
            name: name,
            description: description,
            size: size,
            tags: tags.replace(/ ?, ?/g, ",").split(","),
            url: url
          }
          if (uid) {
            firebase.database().ref("items/" + uid).update(data)
          } else {
            firebase.database().ref("items").push().then(function() {
              location.hash = "#"
            })
          }
        }
      }, "Edit")
    )
}

hyperapp.app({
  state: state,
  actions: actions,
  events: events,
  view: [
    ["/signin", Views.SignIn],
    ["/signout", Views.SignOut],
    ["/new", Views.Edit],
    ["/edit/:uid", Views.Edit],
    ["*", Views.Index]
  ],
  mixins: [hyperapp.Router]
})