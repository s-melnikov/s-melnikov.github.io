const db = db_name => {

  db_name = btoa(db_name)
  const CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
  let db_data;

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

  if (!localStorage[db_name]) {
    localStorage[db_name] = "{}"
  }
  db_data = JSON.parse(localStorage[db_name])

  return {
    table(t_name) {
      if (!db_data[t_name]) {
        throw Error(`[DB ERROR] Table "${t_name}" not exists.`)
      }
      let table_data = db_data[t_name]
      return {
        get() {
          return table_data
        },
        add(entry) {
          let uid =
        }
      }
    },
    uniqid
  }

}


const db = (() => {

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