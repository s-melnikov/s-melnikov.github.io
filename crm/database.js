(function(global) {

  class Database {
    constructor(name) {
      this.name = name;
    }
    collection(name) {
      return new Collection(this.name, name);
    }
    drop() {
      localStorage.removeItem(this.name);
    }
    dump() {
      let a = document.createElement("a");
      a.href = "data:text/json;charset=utf-8," +
        encodeURIComponent(localStorage[this.name]);
      a.download = "dump_" + this.name + "_" + Date.now() + ".json";
      a.click();
    }
    restore(json) {
      localStorage[this.name] = json;
    }
    query(params) {

    }
  }

  class Collection {
    constructor(database, name) {
      this.database = database;
      this.name = name;
    }
    get() {
      try {
        return JSON.parse(localStorage[this.database])[this.name] || [];
      } catch(e) {
        return [];
      }
    }
    set(collection) {
      let data = null;
      try {
        data = JSON.parse(localStorage[this.database]);
      } catch(e) {
        data = {};
      }
      data[this.name] = collection;
      try {
        localStorage[this.database] = JSON.stringify(data);
      } catch(e) {}
    }
    pushMany(entries, callback) {
      let result = entries.map(entry => {
        entry.key = uniqid();
        return entry;
      }).concat();
      delay(() => {
        let collection = this.get();
        collection = collection.concat(entries);
        this.set(collection);
        if (callback) callback(result);
      })
      return result;
    }
    push(entry, callback) {
      return this.pushMany([entry], result => {
        if (callback) callback(result[0]);
      })[0];
    }
    find(where) {
      return new Promise((resolve, reject) => {
        let entries = [];
        let collection = this.get();
        if (typeof where === "string") {
          where = { $key: where };
        }
        collection.forEach(entry => {
          for (let prop in where) {
            if (entry[prop] !== where[prop]) return;
          }
          entries.push(Object.assign({}, entry));
        });
        delay(() => resolve(entries));
      });
    }
    update(data, where) {
      return new Promise((resolve, reject) => {
        let collection = this.get();
        let i = 0;
        if (typeof where === "string") {
          where = { $key: where };
        }
        collection.forEach(entry => {
          for (let prop in where) {
            if (entry[prop] !== where[prop]) return;
          }
          Object.assign(entry, data);
          i++;
        });
        this.set(collection);
        delay(() => resolve(i));
      });
    }
    delete(where) {
      return new Promise((resolve, reject) => {
        let collection = this.get();
        let new_collection = [];
        let i = 0;
        if (typeof where === "string") {
          where = { $key: where };
        }
        collection.forEach(entry => {
          for (let prop in where) {
            if (entry[prop] !== where[prop]) return i++;
          }
          new_collection.push(entry);
        });
        this.set(new_collection);
        delay(() => resolve(i));
      });
    }
    truncate() {
      return new Promise((resolve, reject) => {
        delay(() => {
          this.set([]);
          resolve();
        });
      });
    }
  }

  const CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const CHARS_LENGTH = CHARS.length;

  let uniqid = () => {
    let now = Date.now(), chars = [], i = 8, id;
    while (i--)
      chars[i] = CHARS.charAt(now % CHARS_LENGTH), now = Math.floor(now / CHARS_LENGTH);
    id = chars.join("");
    i = 8;
    while (i--)
      id += CHARS.charAt(Math.floor(Math.random() * CHARS_LENGTH));
    return id;
  }

  let delay = cb => setTimeout(cb, Math.random() * 100);

  global.database = name => new Database(name);

})(this);