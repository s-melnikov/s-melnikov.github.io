"use strict"
const now = Date.now()
const { h, app } = hyperapp
const pp = 20
const ttl = 1000 * 60 * 15
const db = firebase.database().ref("/v0")
const types = ["top", "new", "best", "show", "ask", "job"]
let cache = {
  stories: {},
  users: {}
}
const parser = document.createElement("a")
const domain = url => (parser.href = url) && parser.hostname
const capitalize = str => str[0].toUpperCase() + str.slice(1)
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
const fetchItems = ids => {
  return Promise.all(ids.map(id => new Promise(resolve => {
      let item = cache[id]
      if (item && item._timestamp + ttl > Date.now()) {
        resolve(item)
      } else {
        db.child("item/" + id).once("value", snapshot => {
          let item = snapshot.val()
          if (item) {
            item._timestamp = Date.now()
            cache[item.id] = item
          }
          resolve(item)
        })
      }
    })
  ))
}
const Router = (state, actions, routes) => {
  return (routes[state.type] || routes["*"])(state, actions)
}
const MainView = (state, actions) => h("div", { id: "app" },
  h("header", null,
    h("div", { "class": "container" },
      types.map(type => h("a", {
          href: "#/" + type,
          "class": type == state.type ? "active" : ""
        }, capitalize(type))
      )
    )
  ),
  Router(state, actions, routes)
)
const ListView = type => {
  return (state, actions) => {
    if (state.loading) {
      return h("div", { "class": "items-list" },
        h("div", { "class": "item loader" }, h("span"))
      )
    }
    return h("div", { "class": "items-list" },
      state.items.map(item => {
        switch (type) {
          case "user":
            return UserView(item)
            break;
          default:
            return StoryView(item)
            break;
        }
      }),
      h("div", { "class": "item more" },
        h("a", { href: "#/" + state.type + "/" + ((+state.params[0] || 1) + 1) }, "More...")
      )
    )
  }
}
const StoryView = story => h("div", {
    key: story.id,
    "class": "item item-" + story.type + " id-" + story.id,
    onclick: () => { console.log(story) }
  },
  h("span", { "class": "score" }, story.score),
  h("div", { "class": "inner" },
    h("div", { "class": "title" },
      h("a", { href: story.url, target: "_blank" }, story.title),
      " ",
      h("a", {
          "class": "host",
          href: "//" + domain(story.url),
          target: "_blank"
        },
        "(" + domain(story.url) + ")"
      )
    ),
    h("div", { "class": "info" },
      "by ",
      h("a", { href: "#/user/" + story.by }, story.by),
      " ",
      fromNow(story.time),
      " ago | ",
      h("a", { href: "#" }, story.descendants ? (story.descendants + " comments") : "discuss")
    )
  )
)

const UserView = user => {
  return h("div", { "class": "item item-user" },
    h("table", null,
      h("tbody", null,
        h("tr", null,
          h("td"),
          h("td", null,
            h("div", { "class": "user-id" }, user.id)
          )
        ),
        h("tr", null,
          h("td", null, "Karma:"),
          h("td", null, user.karma)
        ),
        h("tr", null,
          h("td", null, "Created:"),
          h("td", null, new Date(user.created * 1000).toLocaleString())
        ),
        h("tr", null,
          h("td", null, "About:"),
          h("td", { innerHTML: user.about || "[no info]" })
        ),
        h("tr", null,
          h("td"),
          h("td", null,
            h("a", {
              href: "//news.ycombinator.com/submitted?id=" + user.id,
              target: "_blank"
            }, "submissions"),
            h("a", {
              href: "//news.ycombinator.com/threads?id=" + user.id,
              target: "_blank"
          }, "comments")
          )
        )
      )
    )
  )
}
const ErrorView = () => h("div", { "class": "container" },
  h("h2", null, "[404] Page not found.")
)
let routes = {
  "user": ListView("user"),
  "*": ErrorView
}
types.map(type => routes[type] = ListView(type))
// Init
app({
  state: {
    loading: true,
    type: null,
    params: [],
    page: 1,
    ids: [],
    items: []
  },
  actions: {
    hashchange(state, actions) {
      scrollTo(0, 0)
      let params = (location.hash.slice(2) || "top").split("/")
      let type = params.shift()
      let page = + params[0] || 1
      if (type != state.type) {
        actions.type(type)
      } else if (page !== state.page) {
        actions.page(page)
      }
      return { params, page }
    },
    type(state, actions, type) {
      db.child(state.type + "stories").off()
      switch (type) {
        case "user":
          db.child("user/" + params[0]).once("value", snapshot => {
            actions.items([snapshot.val()])
          })
          break
        default:
          db.child(type + "stories").on("value", snapshot => {
            actions.ids(snapshot.val())
            actions.page(state.page)
          })
      }
      return { type, loading: true }
    },
    page(state, actions, page) {
      let end = page * pp
      let start = end - pp
      fetchItems(state.ids.slice(start, end)).then(items => actions.items(items))
      return { page, loading: true }
    },
    ids(state, actions, ids) {
      return { ids }
    },
    items(state, actions, items) {
      return { items, loading: false }
    }
  },
  events: {
    init: (state, actions) => {
      addEventListener("hashchange", actions.hashchange)
      actions.hashchange()
    }
  },
  view: MainView
})
