const ls = {
  chars: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  tables() {
    let names = []
    Object.keys(localStorage).map(name => {
      if (name.indexOf("Table") === 0) {
        names.push(name.slice(5))
      }
    })
    return names
  },
  table(name) {
    name = "Table" + name
    return {
      add(item) {
        let items = ls.getItems(name)
        let uid = ls.uniqid()
        if (items[uid]) {
          throw Error("LS Error #1")
        }
        items[uid] = item
        ls.save(items, name)
        return uid
      },
      put(uid, item) {
        let items = ls.getItems(name)
        if (!items[uid]) {
          throw Error("LS Error #2")
        }
        Object.assign(items[uid], item)
        ls.save(items, name)
      },
      get(uid) {
        if (uid) {
          return ls.getItems(name)[uid]
        }
        return ls.getItems(name)
      },
      del(uid) {
        let items = ls.getItems(name)
        delete items[uid]
        ls.save(items, name)
      },
      drop() { return ls.save({}, name) }
    }
  },
  getItems(name) {
    if (localStorage[name] == null) {
      localStorage[name] = "{}"
    }
    return JSON.parse(localStorage[name])
  },
  save(items, name) {
    localStorage[name] = JSON.stringify(items)
  },
  uniqid() {
    let now = Date.now(), chars = [], i = 8, id
    while (i--) {
      chars[i] = ls.chars.charAt(now % 64)
      now = Math.floor(now / 64)
    }
    id = chars.join("")
    while (i++ < 8) {
      id += ls.chars.charAt(Math.floor(Math.random() * 64))
    }
    return id
  }
}