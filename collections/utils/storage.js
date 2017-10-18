const db = (() => {

  const CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

  const tables = () => {
    return new Promise((resolve, reject) => {
      let names = []
      Object.keys(localStorage).map(name => {
        if (name.indexOf("Table") === 0) {
          names.push(name.slice(5))
        }
      })
      resolve(names)
    })
  }

  const getItems = name => {
    if (localStorage[name] == null) {
      localStorage[name] = "{}"
    }
    return JSON.parse(localStorage[name])
  }
  const save = (items, name) => {
    localStorage[name] = JSON.stringify(items)
  }

  const uniqid = () => {
    let now = Date.now(), chars = [], i = 8, id
    while (i--) {
      chars[i] = CHARS.charAt(now % 64)
      now = Math.floor(now / 64)
    }
    id = chars.join("")
    while (i++ < 8) {
      id += CHARS.charAt(Math.floor(Math.random() * 64))
    }
    return id
  }

  const table = name => {
    name = "Table" + name
    return {
      add(item) {
        let items = getItems(name)
        let uid = uniqid()
        if (items[uid]) {
          throw Error("LS Error #1")
        }
        items[uid] = item
        save(items, name)
        return uid
      },
      put(uid, item) {
        let items = getItems(name)
        if (!items[uid]) {
          throw Error("LS Error #2")
        }
        Object.assign(items[uid], item)
        save(items, name)
      },
      get(uid) {
        return new Promise((resolve, reject) => {
          if (uid) {
            resolve(getItems(name)[uid])
          } else {
            resolve(getItems(name))
          }
        })
      },
      del(uid) {
        let items = getItems(name)
        delete items[uid]
        save(items, name)
      },
      drop() { return save({}, name) }
    }
  }

  return { tables, table }

})()