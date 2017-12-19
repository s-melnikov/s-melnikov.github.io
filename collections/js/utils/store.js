define("utils/store", null, () => {

  class Store {
    constructor(store_name) {
      this.$store_name = store_name
      this.getData()
    }
    getData() {
      try {
        this.$data = JSON.parse(localStorage[this.$store_name])
      } catch(e) {
        this.$data = {}
      }
    }
    setData() {
      try {
        localStorage[this.$store_name] = JSON.stringify(this.$data)
      } catch(e) {}
    }
    table(table_name) {
      return new Table(table_name, this)
    }
    drop() {
      localStorage.removeItem(this.$store_name)
    }
  }

  class Table {
    constructor(table_name, store) {
      this.$table_name = table_name
      this.$store = store
      if (!store.$data[table_name]) {
        store.$data[table_name] = []
      }
      this.$data = store.$data[table_name]
      this.$conditions = { where: {} }
    }
    push(item) {
      return new Promise((resolve, reject) => {
        item.uid = Table.uniqid()
        this.$data.push(item)
        this.$store.setData()
        resolve(new Item(item, this))
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
        this.$data.forEach(item => {
          for (let key in this.$conditions.where) {
            if (item[key] !== this.$conditions.where[key]) return;
          }
          result.push(item)
        })
        this.$conditions = { where: {} }
        resolve(new Collection(result, this))
      })
    }
    findOne() {
      return this.find().then(result => new Promise((resolve, reject) => {
        resolve(result.$items[0] || null)
      }))
    }
    deleteItems(items) {
      for (let index = 0; index < this.$data.length;) {
        if (items.indexOf(this.$data[index]) !== -1) {
          this.$data.splice(index, 1)
        } else {
          index++
        }
      }
      this.$store.setData()
    }
    truncate() {
      this.$data = []
      this.$store.setData()
    }
  }

  class Collection {
    constructor(items, table) {
      this.$items = items.map(item => new Item(item, table))
      this.$table = table
    }
    data() {
      return this.$items.map(item => item.$data)
    }
    delete() {
      this.$table.deleteItems(
        this.$items.map(item => item.$data)
      )
    }
  }

  class Item {
    constructor($data, table) {
      this.$data = $data
      this.$table = table
    }
    data() {
      return this.$data
    }
    update($data) {
      for (let key in $data) {
        this.$data[key] = $data[key]
      }
      this.$table.$store.setData()
    }
    delete() {
      this.$table.deleteItems([this.$data])
      this.$data = null
    }
  }

  Table.CHARS = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz"
  Table.uniqid = () => {
    let now = Date.now(), chars = [], i = 8, id
    while (i--)
      chars[i] = Table.CHARS.charAt(now % 64), now = Math.floor(now / 64)
    id = chars.join("")
    i = 8
    while (i--)
      id += Table.CHARS.charAt(Math.floor(Math.random() * 64))
    return id
  }

  return Store
})
