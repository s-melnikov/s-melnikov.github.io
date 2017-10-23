const Database = db_name => {

  db_name = btoa(db_name)
  const CHARS = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz"
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
          let uid = uniqid()
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
