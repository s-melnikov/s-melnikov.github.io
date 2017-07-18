"use strict"

firebase.initializeApp({
  databaseURL: "https://hacker-news.firebaseio.com/"
})
var now = Date.now()
var { h, app } = hyperapp
var PER_PAGE = 20
var db = firebase.database().ref("/v0")
var types = ["top", "new", "best", "show", "ask", "job"]


// Utils

var parser = document.createElement("a")

var domain = url => (parser.href = url) && parser.hostname

var fromNow = (time, between) => {
  between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return ~~(between / 60) + " minutes"
  } else if (between < 86400) {
    return ~~(between / 3600) + " hours"
  } else {
    return ~~(between / 86400) + " days"
  }
}

var capitalize = str => str[0].toUpperCase() + str.slice(1)

var getStories = (items, callback, result = []) => {
  items.map(item => db.child("item/" + item).once("value", snapshot => {
    result.push(snapshot.val())
    if (result.length === items.length) {
      callback(result)
    }
  }))
}

// Views

var Views = {}

Views.Layout = (state, actions) => h("div", { id: "app" },
  Views.Menu(state, actions),
  Views.ItemsList(state, actions)
)

Views.Menu = (state, actions) => h("header", null,
  h("div", { "class": "container" },
    types.map(type => h("a", {
        href: "#/" + type,
        "class": type === state.type ? "active" : ""
      }, capitalize(type))
    )
  )
)

Views.ItemsList = (state, actions) => {
  var page = +state.params[1] || 1
  if (state.type !== state.params[0]) {
    actions.setType(state.params[0])
    return h("div", { "class": "item-list" },
      h("div", { "class": "item loader" }, h("span"))
    )
  } else if (state.page !== page) {
    actions.setPage(page)
    return h("div", { "class": "item-list" },
      h("div", { "class": "item loader" }, h("span"))
    )
  }
  return h("div", { "class": "item-list " + state.params[0] + "-list" },
    state.stories.map(story => Views.Item(story)),
    state.stories.length && (page * PER_PAGE) < state.ids.length ?
      h('div', {
        'class': 'item more',
      }, h("a", { href: "#/" + state.type + "/" + (page + 1)}, "More..."))
      : null
  )
}

Views.Item = story => {
  if (!story || story.deleted) return false;
  switch (story.type) {
    case "user":
      return Views.User(story)
      break
    default:
      return Views.Story(story)
  }
}

Views.Story = story => h("div", {
    "class": "item item-" + story.type,
    onclick: () => console.log(story)
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
      h("a", { href: "#!/user/" + story.by }, story.by),
      " ",
      fromNow(story.time),
      " ago | ",
      h("a", { href: "#" }, story.descendants ? (story.descendants + " comments") : "discuss")
    )
  )
)

Views.User = (item, state, actions) => h("div",
  { "class": "item item-user" },
  h("div", { "class": "user-id" }, item.id),
  h("table", null,
    h("tbody", null,
      h("tr", null,
        h("td", null, "Karma:"),
        h("td", null, item.karma)
      ),
      h("tr", null,
        h("td", null, "Created:"),
        h("td", null, new Date(item.created * 1000).toLocaleString())
      ),
      h("tr", null,
        h("td", null, "About:"),
        h("td", { innerHTML: item.about || "[no info]" })
      ),
      h("tr", null,
        h("td"),
        h("td", null,
          h("a", { href: "#!/user/submissions/" + item.id }, "submissions"),
          " | ",
          h("a", { href: "#!/user/comments/" + item.id }, "comments")
        )
      )
    )
  )
)



// Init
app({
  state: {
    params: [],
    type: null,
    page: null,
    loading: true,
    ids: [],
    stories: []
  },
  actions: {
    hashchange: (state, actions) => {
      var params = location.hash.slice(2).split("/")
      if (!params[0]) params = ["top"]
      return { params }
    },
    setType: (state, actions, type) => {
      db.child(type + "stories").once("value", snapshot => {
        actions.setIds(snapshot.val())
      })
      return { type, stories: [] }
    },
    setPage: (state, actions, page) => {
      var end = page * PER_PAGE
      var start = end - PER_PAGE
      getStories(state.ids.slice(start, end), stories => actions.setStories(stories))
      return { page, stories: [] }
    },
    setIds: (state, actions, ids) => {
      var end = state.page * PER_PAGE
      var start = end - PER_PAGE
      getStories(ids.slice(start, end), stories => actions.setStories(stories))
      return { ids }
    },
    setStories: (state, actions, stories) => {
      scrollTo(0, 0)
      return { stories }
    }
  },
  events: {
    init: (state, actions) => {
      addEventListener("hashchange", actions.hashchange)
      actions.hashchange()
    }
  },
  view: Views.Layout
})