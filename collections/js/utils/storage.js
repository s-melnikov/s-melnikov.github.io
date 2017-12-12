function createStorage(storage_name) {
  const CHARS = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz"

  function uniqid() {
    let now = Date.now(), chars = [], i = 8, id
    while (i--)
      chars[i] = CHARS.charAt(now % 64), now = Math.floor(now / 64)
    id = chars.join("")
    i = 8
    while (i--)
      id += CHARS.charAt(Math.floor(Math.random() * 64))
    return id
  }

  function get_ls() {
    try {
      return JSON.parse(localStorage[storage_name])
    } catch(e) {
      return {}
    }
  }

  function set_ls() {
    try {
      localStorage[storage_name] = JSON.stringify(storage)
      return true
    } catch(e) {
      return false
    }
  }

  var storage = get_ls() || {}
  return {
    table(name) {
      var table = (storage[name] = storage[name] || [])
      var where = []
      return {
        where(params) {
          for (key in params) {
            where[key] = params[key]
          }
          return this
        },
        find() {
          let result = []
          table.forEach(function(item) {
            for (key in where) {
              if (item[key] !== where[key]) return;
            }
            result.push(item)
          })
          return result
        },
        push(item) {
          item.uid = uniqid()
          table.push(item)
          set_ls()
        },
        drop() {
          delete storage[name]
          set_ls()
        }
      }
    }
  }
}

var table = createStorage("test").table("foo").where({ first_name: "John", last_name: "Lorem" }).find()
console.log(table)


const Database = db_name => {

  db_name = btoa(db_name)

  let db_data;

  const uniqid = () => {
    let now = Date.now(), chars = [], i = 8, id
    while (i--) {
      chars[i] = CHARS.charAt(now % 64)
      now = Math.floor(now / 64)
    }
    id = chars.join("")
    i = 8
    while (i--) {
      id += CHARS.charAt(Math.floor(Math.random() * 64))
    }
    return id
  }

  const sync = () => {
    localStorage[db_name] = JSON.stringify(db_data)
  }

  if (!localStorage[db_name]) {
    localStorage[db_name] = "{}"
  }
  db_data = JSON.parse(localStorage[db_name])

  return {
    exists(t_name) {
      return !!db_data[t_name]
    },
    create(t_name) {
      if (db_data[t_name]) {
        throw Error(`[DB ERROR] Table "${t_name}" already exists.`)
      }
      db_data[t_name] = {}
      sync()
      return this.table(t_name)
    },
    tables() {
      return Object.keys(db_data).filter(name => name[0] != ".")
    },
    table(t_name) {
      if (!db_data[t_name]) {
        throw Error(`[DB ERROR] Table "${t_name}" not exists.`)
      }
      return {
        get() {
          return db_data[t_name]
        },
        add(entry) {
          let uid = entry.uid || uniqid()
          if (entry.uid) delete entry.uid
          db_data[t_name][uid] = entry
          sync()
          return uid
        },
        put(uid, entry) {
          if (db_data[t_name][uid] == null) {
            throw Error(`[DB ERROR] Entry with uid "${uid}" not exists.`)
          }
          if (entry == null) {
            throw Error(`[DB ERROR] Entry should not be empty.`)
          }
          db_data[t_name][uid] = entry
          sync()
        },
        del(uid) {
          delete db_data[t_name][uid]
        },
        truncate() {
          db_data[t_name] = {}
        }
      }
    },
    uniqid
  }
}
