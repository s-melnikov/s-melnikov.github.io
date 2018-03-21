firebase.initializeApp({
  databaseURL: "https://hacker-news.firebaseio.com/"
});
const { h, app } = hyperapp;
const State = {
  params: [],
  loader: true,
  items: [],
  seen: JSON.parse(localStorage.hyperapphn3 || "[]")
};
const Actions = {
  route: () => ({
    route: (location.hash.slice(2) || "top").split("/")
  }),
  loader: (state, actions, show) => ({ loader: show }),
  ids: (state, actions, ids) => {
    fetchItems(ids, actions.items)
  },
  items: (state, actions, items) => {
    items.sort((a, b) => {
      a = state.seen.indexOf(a.id) > -1
      b = state.seen.indexOf(b.id) > -1
      if (a > b) return 1
      if (a < b) return -1
      return 0
    })
    return { loader: false, items }
  },
  seen: (state, actions, id) => {
    let seen = JSON.parse(localStorage.hyperapphn || "[]")
    seen.push(id)
    if (seen.length > 100000) seen.shift()
    try {
      localStorage.hyperapphn = JSON.stringify(seen)
    } catch(e) {
      seen = seen.splice(0, 1000)
      localStorage.hyperapphn = JSON.stringify(seen)
    }
    return { seen }
  }
};
const init = (state, actions) => {
  addEventListener("hashchange", actions.route)
  actions.route()
}
const main = app(State, Actions, View, document.querySelector("#root"));
/*


function View(state, actions) {
  return h("div", {},
    ItemsView(state, actions),
    h("header", {},
      h("div", { "class": "container" },
        types.map(type => h("a", {
            href: "#/" + type,
            "class": type == state.route[0] ? "active" : ""
          }, capitalize(type))
        )
      )
    ),
    state.loader && h("div", { class: "overlay" }, h("div", { class: "loader" }, h("span")))
  )
}

function ItemsListView(state, actions) {
  return h("div", {
      class: "items-list",
      key: "list-" + state.route[0],
      oncreate() {
        actions.loader(true)
        switch (state.route[0]) {
          case "user":
            break
          case "item":
            break
          default:
            subscription = db.child(state.route[0] + "stories")
            subscription.once("value", snapshot => {
              actions.ids(snapshot.val())
            })
        }
      },
      onremove() {
        if (subscription) {
          subscription.off()
          subscription = null
        }
      }
    },
    state.items.map(item => ItemView(state, actions, item))
  )
}
*/
/*
const now = Date.now()
const pp = 30
const ttl = 1000 * 60 * 15
const types = ["top", "new", "best", "show", "ask", "job"]
let db = firebase.database().ref("/v0")
let cached = {}
let subscription
const parser = document.createElement("a")
const capitalize = str => str[0].toUpperCase() + str.slice(1)
const domain = url => (parser.href = url) && parser.hostname
const fromNow = (time, between) => {
  between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return ~~(between / 60) + " minutes"
  } else if (between < 86400) {
    return ~~(between / 3600) + " hours"
  } else {
    return ~~(between / 86400) + " days"
  }
}
const fetchItem = (id, callback) => {
  let item = cached[id]
  if (item && item._timestamp + ttl > Date.now()) {
    callback(item)
  } else {
    db.child("item/" + id).once("value", snapshot => {
      let item = snapshot.val()
      if (item) {
        item._timestamp = Date.now()
        cached[item.id] = item
      }
      callback(item)
    })
  }
}
const fetchItems = (ids, callback) => {
  let items = [],
    handler = item => {
      items.push(item)
      if (items.length == ids.length) callback(items)
    }
  ids.map(id => fetchItem(id, handler))
}

const ItemView = (state, actions, item) => {
  let view = null
  switch (state.route[0]) {
    case "user":
      break
    case "item":
      break
    default:
      view = h("div", { "class": "inner" },
        h("div", { "class": "title" },
          h("a", { href: item.url || ("#/item/" + item.id), target: item.url ? "_blank" : "_self" }, item.title),
        ),
        h("div", { "class": "info" },
          item.score + " points",
          "by ",
          h("a", { href: "#/user/" + item.by }, item.by),
          " ",
          fromNow(item.time),
          " ago | ",
          h("a", { href: "#" }, item.descendants ? (item.descendants + " comments") : "discuss"),
          item.url && [
            " | ",
            h("a", {
                "class": "host",
                href: item.url ? "//" + domain(item.url) : "#/item/" + item.id,
                target: "_blank"
              }, domain(item.url)
            )
          ]
        )
      )
  }
  return h("div", {
    class: "item item-" + state.route[0] + " id-" + item.id + (state.seen.indexOf(item.id) > -1 ? " seen" : ""),
    onclick: () => { actions.seen(item.id) }
  }, view)
}
*/