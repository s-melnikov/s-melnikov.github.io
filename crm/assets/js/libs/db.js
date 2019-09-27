((global) => {
  const warn = console.warn.bind(console);
  const regexp = /\$parent\.(\w+)/g;
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
      try {
        JSON.parse(json);
        localStorage[this.name] = json;
        return true;
      } catch(e) {
        console.error(e);
        return false;
      }
    }
    _fields(entries, fields) {
      fields.uid = true;
      return entries.map(entry => {
        let result = {};
        for (let field in fields) {
          let where = fields[field].where;
          if (where && type(where) === "Object") {
            where = Object.assign({}, where);
            for (let prop in where) {
              where[prop] = where[prop].replace(regexp, (_, prop) => {
                return entry[prop];
              });
            }
          }
          if (type(fields[field]) === "Object") {
            let collection = this.collection(field);
            let entries = collection.findSync(where);
            result[field] = this._fields(entries, fields[field].fields);
          } else {
            result[field] = entry[field];
          }
        }
        return result;
      });
    }
    query(params) {
      let result = {};
      for (let prop in params) {
        let collection = this.collection(prop);
        let entries = collection.findSync(params[prop].where);
        result[prop] = this._fields(entries, params[prop].fields); // TODO
      }
      return result;
    }
  }

  class Collection {
    _get() {
      try {
        this.entries = JSON
          .parse(localStorage[this.db_name])[this.col_name]
          .split('\n')
          .map(row => JSON.parse(row))
          .filter((row, i) => {
            if (i === 0) {
              this.columns = row;
              return false;
            }
            return true;
          });
      } catch(e) {
        warn('Get collection error', e);
      }
    }

    _set() {
      try {
        const col_data = [this.columns, ...this.entries].map(entry => JSON.stringify(entry)).join('\n');
        db_data = JSON.parse(localStorage[this.db_name]);
        db_data[this.col_name] = col_data;
        localStorage[this.db_name] = JSON.stringify(db_data);
      } catch(e) { warn('Set collection error', e) }
    }

    constructor(db_name, col_name) {
      this.db_name = db_name;
      this.col_name = col_name;
    }

    push(entries) {
      if (!Array.isArray(entries)) {
        entries = [entries];
      }
      return new Promise(resolve => {
        delay(() => {
          this._get();
          entries = entries.map(entry => ({ ...entry, $uid: uniqid()}));
          this.entries = [...this.entries, ...toArray(entries)];
          this._set();
          resolve(entries);
        })
      });
    }

    find(where) {
      let entries = [];
      let collection = this.get();
      if (typeof where === "string") {
        where = { uid: where };
      }
      collection.forEach(entry => {
        for (let prop in where) {
          if (entry[prop] !== where[prop]) return;
        }
        entries.push(Object.assign({}, entry));
      });
      return entries;
    }
    find(where) {
      return new Promise((resolve, reject) => {
        let entries = this.findSync(where);
        delay(() => resolve(entries));
      });
    }
    update(data, where) {
      return new Promise((resolve, reject) => {
        let collection = this.get();
        let i = 0;
        if (typeof where === "string") {
          where = { uid: where };
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
          where = { uid: where };
        }
        collection.forEach(entry => {
          for (let prop in where) {
            if (entry[prop] == where[prop]) return i++;
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
  function toArray(columns, entries) {
    return entries.map(entry => {
      return columns.map(column => {
        return (entry[column] == null) ? null : entry[column];
      });
    });
  }
  function uniqid() {
    let uid = Date.now().toString(36);
    while (uid.length < 16) {
      uid += Math.floor(Math.random() * 36).toString(36);
    }
    return uid;
  }
  function delay(cb) {
    return setTimeout(cb, Math.random() * 100 + 100);
  }
  function type(o) {
    return Object.prototype.toString.call(o).slice(8, -1);
  }
  global.database = name => new Database(name);
  database.uniqid = uniqid;
})(this);
