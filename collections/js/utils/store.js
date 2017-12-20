define("utils/store", null, () => {

  let delay = cb => setTimeout(cb, Math.random() * 500)

  class Store {
    constructor(store_name) {
      this.$store_name = store_name
      this.getData()
    }
    getData() {
      try {
        this.$collections = JSON.parse(localStorage[this.$store_name])
      } catch(e) {
        this.$collections = {}
      }
    }
    setData() {
      try {
        localStorage[this.$store_name] = JSON.stringify(this.$collections)
      } catch(e) {}
    }
    collection(name) {
      return new Collection(name, this)
    }
    drop() {
      localStorage.removeItem(this.$store_name)
    }
  }

  class Collection {
    constructor(name, store) {
      this.$name = name
      this.$store = store
      if (!store.$collections[name]) {
        store.$collections[name] = []
      }
      this.$entries = store.$collections[name]
      this.$conditions = { where: {} }
    }
    push(entry) {
      return new Promise((resolve, reject) => {
        entry.uid = uniqid()
        this.$entries.push(entry)
        this.$store.setData()
        delay(() => resolve(new Entry(entry, this)))
      })
    }
    where(obj) {
      for (let key in obj) {
        this.$conditions.where[key] = obj[key]
      }
      return this
    }
    find() {
      return new Promise((resolve, reject) => {
        let result = []
        this.$entries.forEach(entry => {
          for (let key in this.$conditions.where) {
            if (entry[key] !== this.$conditions.where[key]) return;
          }
          result.push(entry)
        })
        this.$conditions = { where: {} }
        delay(() => resolve(new Result(result, this)))
      })
    }
    findOne() {
      return this.find().then(result => new Promise((resolve, reject) => {
        delay(() => resolve(result.$entries[0] || null))
      }))
    }
    deleteEntries(entries) {
      for (let index = 0; index < this.$entries.length;) {
        if (entries.indexOf(this.$entries[index]) !== -1) {
          this.$entries.splice(index, 1)
        } else {
          index++
        }
      }
      this.$store.setData()
    }
    truncate() {
      this.$entries = []
      this.$store.setData()
    }
  }

  class Result {
    constructor(entries, collection) {
      this.$entries = entries.map(entry => new Entry(entry, collection))
      this.$collection = collection
    }
    data() {
      return this.$entries.map(entry => entry.$data)
    }
    delete() {
      this.$collection.deleteEntries(
        this.$entries.map(entry => entry.$data)
      )
    }
  }

  class Entry {
    constructor($data, collection) {
      this.$data = $data
      this.$collection = collection
    }
    data() {
      return this.$data
    }
    update($data) {
      for (let key in $data) {
        this.$data[key] = $data[key]
      }
      this.$collection.$store.setData()
    }
    delete() {
      this.$collection.deleteEntries([this.$data])
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

  Store.Collection = Collection
  Store.Result = Result
  Store.Entry = Entry

  return Store
})
