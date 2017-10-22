const Database = db_name => {

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
      let table_data = db_data[t_name]
      return {
        get() {
          return table_data
        },
        add(entry) {
          let uid = uniqid()
          table_data[uid] = entry
          sync()
          return uid
        },
        put(uid, entry) {
          if (table_data[uid] == null) {
            throw Error(`[DB ERROR] Entry with uid "${uid}" not exists.`)
          }
          if (entry == null) {
            throw Error(`[DB ERROR] Entry should not be empty.`)
          }
          table_data[uid] = entry
          sync()
        },
        del(uid) {
          delete table_data[uid]
        },
        truncate() {
          db_data[t_name] = {}
        }
      }
    },
    uniqid
  }
}