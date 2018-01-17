define("utils/database", null, () => {

    let cache = {}

    class Database {
      constructor(name) {
        this.$name = name
        if (!cache[this.$name]) {
          this.get()
        }
        this.$collections = cache[this.$name]
      }
      get() {
        try {
          cache[this.$name] = JSON.parse(localStorage[this.$name])
        } catch(e) {
          cache[this.$name] = {}
        }
      }
      set() {
        try {
          localStorage[this.$name] = JSON.stringify(cache[this.$name])
        } catch(e) {}
      }
      collection(name) {
        return new Collection(name, this)
      }
      drop() {
        delete cache[this.$name]
        localStorage.removeItem(this.$name)
      }
    }

    class Collection {
      constructor(name, database) {
        this.$name = name
        this.$database = database
        if (!this.$database.$collections[this.$name]) {
          this.$database.$collections[this.$name] = []
        }
        this.$entries = this.$database.$collections[this.$name]
      }
      pushMany(entries, callback) {
        let result = entries.map(entry => {
          entry.$key = uniqid()
          return new Entry(entry, this)
        })
        delay(() => {
          entries.forEach(entry => {
            this.$entries.push(entry)
          })
          this.$database.set()
          if (callback) callback(result)
        })
        return result
      }
      push(entry, callback) {
        return this.pushMany([entry], result => {
          if (callback) callback(result[0])
        })[0]
      }
      find(where) {
        return new Promise((resolve, reject) => {
          let entries = []
          if (typeof where === "string") {
            where = { $key: where }
          }
          this.$entries.forEach(entry => {
            for (let prop in where) {
              if (entry[prop] !== where[prop]) return;
            }
            entries.push(entry)
          })
          delay(() => {
            resolve(new Result(entries, this))
          })
        })
      }
      delete(entry) {
        return new Promise((resolve, reject) => {
          delay(() => {
            for (let i = 0; i < this.$entries.length;) {
              if (this.$entries[i] === entry) {
                this.$entries.splice(i, 1)
              } else {
                i++
              }
            }
            resolve()
          })
        })
      }
      truncate() {
        return new Promise((resolve, reject) => {
          delay(() => {
            this.$database.$collections[this.$name] = this.$entries = []
            this.$database.set()
            resolve()
          })
        })
      }
    }

    class Result {
      constructor(entries, collection) {
        this.$entries = entries.map(entry => new Entry(entry, collection))
        this.$collection = collection
      }
      first() {
        return this.$entries[0]
      }
      data() {
        return this.$entries.map(entry => entry.data())
      }
      each(cb) {
        this.$entries.forEach(entry => cb(entry))
        return this
      }
    }

    class Entry {
      constructor(data, collection) {
        this.$data = data
        this.$key = data.$key
        this.$collection = collection
      }
      data() {
        return this.$data
      }
      update(data, cb) {
        for (let key in data) {
          this.$data[key] = data[key]
        }
        delay(() => {
          this.$collection.$database.set()
          cb && cb(this)
        })
        return this
      }
      delete() {
        let promise = this.$collection.delete(this.data())
        this.$data = null
        return promise
      }
    }

    const CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    const CHARS_LENGTH = CHARS.length

    let uniqid = () => {
      let now = Date.now(), chars = [], i = 8, id
      while (i--)
        chars[i] = CHARS.charAt(now % CHARS_LENGTH), now = Math.floor(now / CHARS_LENGTH)
      id = chars.join("")
      i = 8
      while (i--)
        id += CHARS.charAt(Math.floor(Math.random() * CHARS_LENGTH))
      return id
    }

    let delay = cb => setTimeout(cb, 50 + Math.random() * 150)

    return name => new Database(name)
})
