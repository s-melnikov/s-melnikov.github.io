!function(exports) {

  class database {
    constructor(name) {
      this.$name = name
      this.get()
    }
    get() {
      try {
        this.$data = JSON.parse(localStorage[this.$name])
      } catch(e) {
        this.$data = {}
      }
    }
    set() {
      try {
        localStorage[this.$name] = JSON.stringify(this.$data)
      } catch(e) {}
    }
    ref(path) {
      return new reference(path, this)
    }
    collection(name) {
      return new collection(name, this)
    }
    drop() {
      localStorage.removeItem(this.$name)
    }
  }

  class reference {
    constructor(path, database) {
      path = path.replace(/^\/|\/$/, "").split("/")
      this.$database = database
      this.$data = this.$database.$data
      for (let key = path.shift(); key; key = path.shift()) {
        if (this.$data[key] === undefined) {
          this.$data[key] = {}
        }
        this.$data = this.$data[key]
      }
    }
    push(entry, callback) {
      return this.pushMany([entry], result => {
        if (callback) callback(null, result[0])
      })[0]
    }

    pushMany(items, callback) {
      let result = items.map(item => {
        let key = uniqid()
        this.$data[key] = item
        return new entry(item, key, this)
      })
      this.$database.set()
      if (callback) callback(result)
      return result
    }
  }

  class collection {
    find(where) {
      return new Promise((resolve, reject) => {
        let entries = {}
        loop: for (let key in this.$data) {
          for (let prop in where) {
            if (this.$data[key][prop] !== where[prop]) continue loop;
          }
          entries[key] = this.$data[key]
        }
        resolve(new snapshot(entries, this))
      })
    }
    findOne(where) {
      return this.find(where).then(result => new Promise((resolve, reject) => {
        let firstKey = Object.keys(result.$data)[0]
        resolve(firstKey ? result.$data[firstKey] : null)
      }))
    }
    delete(keys) {
      if (keys) {
        keys.map(key => delete this.$data[key])
        this.$database.set()
      } else {
        this.truncate()
      }
    }
    truncate() {
      delete this.$database.$data[this.$name]
      this.$data = null
      this.$database.set()
    }
  }

  class snapshot {
    constructor(entries, collection) {
      this.$data = {}
      for (let key in entries) {
        this.$data[key] = new entry(entries[key], key, collection)
      }
      this.$collection = collection
    }
    data() {
      return Object.keys(this.$data).map(key => {
        return Object.assign(this.$data[key].$data, { $key: key })
      })
    }
    delete() {
      this.$collection.delete(Object.keys(this.$data))
      this.$data = null
    }
  }

  class entry {
    constructor(data, key, collection) {
      this.$data = data
      this.$key = key
      this.$collection = collection
    }
    data() {
      return Object.assign(this.$data, { $key: this.$key })
    }
    update(data) {
      for (let key in data) {
        this.$data[key] = data[key]
      }
      this.$collection.$store.setData()
    }
    delete() {
      this.$collection.delete([this.$key])
      this.$data = null
    }
  }

  const CHARS = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz"
  let uniqid = () => {
    let now = Date.now(), chars = [], i = 8, id
    while (i--)
      chars[i] = CHARS.charAt(now % 64), now = Math.floor(now / 64)
    id = chars.join("")
    i = 8
    while (i--)
      id += CHARS.charAt(Math.floor(Math.random() * 64))
    return id
  }

  exports.database = name => new database(name)
}(this)
