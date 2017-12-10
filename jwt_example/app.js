init()

onPage("sign_in", {
  events: {
    "submit #sign_in_form .class": function(e) {
      e.preventDefault()

    }
  },
  render: function() {
    return template("#sign_in_template")
  }
})

onPage("items", {
  render: function(data) {
    return render("#items_template", {
      outlet: data.items.map(function(item) {
        return render("#item_template")
      }).join("\n")
    })
  }
})

function init() {
  var token = localStorage.token
  if (token) {
    getItems(function(items) {
      toPage("items", items)
    })
  } else {
    toPage("sign_in")
  }
}

