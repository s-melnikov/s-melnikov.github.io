const { h, app } = hyperapp

const uniqid = () => {
  let src = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", now = Date.now(), chars = [], i = 8, id
  while (i--) {
    chars[i] = src.charAt(now % 64)
    now = Math.floor(now / 64)
  }
  id = chars.join("")
  while (i++ < 8) {
    id += src.charAt(Math.floor(Math.random() * 64))
  }
  return id
}

const ls = name => {
  name = "Table" + name
  let getItems = () => {
    if (localStorage[name] == null) {
      localStorage[name] = "{}"
    }
    return JSON.parse(localStorage[name])
  }
  let save = items => {
    localStorage[name] = JSON.stringify(items)
  }
  return {
    add: item => {
      let items = getItems()
      let uid = uniqid()
      if (items[uid]) {
        throw Error("LS Error #1")
      }
      items[uid] = item
      save(items)
      return uid
    },
    put: (uid, item) => {
      let items = getItems()
      if (!items[uid]) {
        throw Error("LS Error #2")
      }
      Object.assign(items[uid], item)
      save(items)
    },
    get: uid => {
      let item = getItems()[uid]
      return item
    },
    delete: uid => {
      let items = getItems()
      delete items[uid]
      save(items)
    },
    getAll: () => getItems(),
    drop: () => save({})
  }
}

let state = {
  count: 0
}

let actions = {
  down: state => ({ count: state.count - 1 }),
  up: state => ({ count: state.count + 1 })
}

let router = (state, actions, routes) => h("div", {
  id: "router",
  oncreate: () => console.log("!")
})

let routes = {
  "/": h("div", null, "Hi!"),
  "*": h("div", null, "404")
}

let view = (state, actions) => h("div", { class: "conatiner" },
  router(state, actions, routes)
)

app({state, actions, view}, document.querySelector("#root"))



/*
fetch("mocks/Users.json").then(resp => resp.json()).then(data => {
  let table = ls("Users")
  data.map(item => { table.add(item) })
})
fetch("mocks/Cars.json").then(resp => resp.json()).then(data => {
  let table = ls("Cars")
  data.map(item => { table.add(item) })
})
fetch("mocks/Apps.json").then(resp => resp.json()).then(data => {
  let table = ls("Apps")
  data.map(item => { table.add(item) })
})
fetch("mocks/Companies.json").then(resp => resp.json()).then(data => {
  let table = ls("Companies")
  data.map(item => { table.add(item) })
})
*/