class Storage {
  constructor(storage_name) {
    this.storage_name = storage_name
    this.getData()
  }
  getData() {
    try {
      this.data = JSON.parse(localStorage[this.storage_name])
    } catch(e) {
      this.data = {}
    }
  }
  setData() {
    try {
      localStorage[this.storage_name] = JSON.stringify(this.data)
    } catch(e) {}
  }
  table(table_name) {
    return new StorageTable(table_name, this)
  }
}

class StorageTable {
  constructor(table_name, storage) {
    this.table_name = table_name
    this.storage = storage
    if (!storage.data[table_name]) {
      storage.data[table_name] = []
    }
    this.data = storage.data[table_name]
    this.where = {}
  }
  push(item) {
    item.uid = StorageTable.uniqid()
    this.data.push(item)
    this.storage.setData()
  }
  where(obj) {
    for (key in obj) {
      this.where[key] = obj[key]
    }
    return this
  }
  find() {
    let result = []
    this.data.forEach(item => {
      for (key in this.where) {
        if (item[key] !== this.where[key]) return;
      }
      result.push(item)
    })
    return new List(result)
  }
}

class List {
  constructor(items) {
    this.items = items.map(item => new Item(item))
  }
  toArray() {
    return this.items.map(item => item.data)
  }
}

class Item {
  constructor(data) {
    this.data = data
  }
}

StorageTable.CHARS = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz"
StorageTable.uniqid = () => {
  let now = Date.now(), chars = [], i = 8, id
  while (i--)
    chars[i] = StorageTable.CHARS.charAt(now % 64), now = Math.floor(now / 64)
  id = chars.join("")
  i = 8
  while (i--)
    id += StorageTable.CHARS.charAt(Math.floor(Math.random() * 64))
  return id
}

var storage = new Storage("foo")
var table = storage.table("users")
var users = table.find().toArray()

console.log(users)

/*
function createStorage(storage_name) {
  return {
    table(name) {
      return {
        ,
        ,
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
*/