!function(exports) {
  const get = (dbName, colName) => {
    try {
      return JSON.parse(localStorage[dbName] || "{}")[colName] || [];
    } catch (e) {}
  }

  const set = (dbName, colName, data) => {
    const prev = get(dbName, colName);

    try {
      return localStorage[dbName] = JSON.stringify({
        ...prev,
        [colName]: data
      });
    } catch (e) {}
  }

  class Database {
    constructor(dbName) {
      this.name = dbName
    }
    get(colName) {
      return new Collection(colName, this.name)
    }
    drop() {
      localStorage.removeItem(this.name)
    }
  }

  class Collection {
    constructor(colName, dbName) {
      this.name = colName
      this.dbName = dbName
    }
    pushMany(data) {
      const prev = get(this.dbName, this.name);
      const entries = data ? data.map((item) => ({ $id: uniqid(), ...item })) : [];
      if (data.length) set(this.dbName, this.name, [...prev, ...entries]);
      return entries;
    }
    push(entry) {
      return this.pushMany([entry])[0];
    }
    find(where) {
      const conds = where ? Object.entries(typeof where === "string" ? { $id: where } : where) : null;
      const entries = get(this.dbName, this.name);
      return conds ? entries.filter((item) => {
        return conds.every(([prop, value]) => item[prop] === value);
      }) : entries;
    }
    findOne(where) {
      const conds = where ? Object.entries(typeof where === "string" ? { $id: where } : where) : null;
      const entries = get(this.dbName, this.name);
      return conds ? entries.find((item) => {
        return conds.every(([prop, value]) => item[prop] === value);
      }) : entries[0];
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

  const uniqid = () => {
    return Math.floor(new Date() / 1000).toString(16) + Math.random().toString(16).substr(-8);
  }

  exports.database = name => new Database(name)
  exports.database.Database = Database
  exports.database.Collection = Collection
  exports.database.Result = Result
  exports.database.Entry = Entry
  exports.database.uniqid = uniqid
}(this)
