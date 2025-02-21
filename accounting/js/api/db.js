const B64_TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

const b64_encode = (data) => {
  let o1, o2, o3, h1, h2, h3, h4, bits, r, i = 0, enc = "";
  if (!data) return data;
  do {
    o1 = data[i++];
    o2 = data[i++];
    o3 = data[i++];
    bits = o1 << 16 | o2 << 8 | o3;
    h1 = bits >> 18 & 0x3f;
    h2 = bits >> 12 & 0x3f;
    h3 = bits >> 6 & 0x3f;
    h4 = bits & 0x3f;
    enc += B64_TABLE.charAt(h1) + B64_TABLE.charAt(h2) + B64_TABLE.charAt(h3) + B64_TABLE.charAt(h4);
  } while (i < data.length);
  r = data.length % 3;
  return (r ? enc.slice(0, r - 3) : enc) + "===".slice(r || 3);
}

const b64_decode = (data) => {
  let o1, o2, o3, h1, h2, h3, h4, bits, i = 0, result = [];
  if (!data) return data;
  data += "";
  do {
    h1 = B64_TABLE.indexOf(data.charAt(i++));
    h2 = B64_TABLE.indexOf(data.charAt(i++));
    h3 = B64_TABLE.indexOf(data.charAt(i++));
    h4 = B64_TABLE.indexOf(data.charAt(i++));
    bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
    o1 = bits >> 16 & 0xff;
    o2 = bits >> 8 & 0xff;
    o3 = bits & 0xff;
    result.push(o1);
    if (h3 !== 64) {
      result.push(o2);
      if (h4 !== 64) {
        result.push(o3);
      }
    }
  } while (i < data.length);
  return result;
}

const keyCharAt = (key, i) => key.charCodeAt(Math.floor(i % key.length));

const xor_decrypt = (key, data) => {
  return [...data].map(function(c, i) {
    return String.fromCharCode( c ^ keyCharAt(key, i) );
  }).join("");
};

const encode = (key, data) => {
  return b64_encode([...data].map(function(c, i) {
    return c.charCodeAt(0)^keyCharAt(key, i);
  }));
};

const decode = (key, data) => {
  return [...b64_decode(data)].map(function(c, i) {
    return String.fromCharCode(c^keyCharAt(key, i) );
  }).join("");
};

const DB_NAME_PREFIX = "lsdb";

const getNewCol = () => {
  return { settings: { createdAt: new Date().toISOString() }, data: [] }
};

class Storage {
  constructor() {
    this.storages = {};
  }
  get(colName, settings) {
    const name = `${DB_NAME_PREFIX}.${colName}`;
    if (!this.storages[name]) {
      try {
        this.storages[name] = JSON.parse(decode(settings.key, localStorage[name]));
      } catch (e) {}
      if (!this.storages[name]) this.storages[name] = getNewCol();
    }
    return this.storages[name];
  }
  set(colName, data, settings) {
    const name = `${DB_NAME_PREFIX}.${colName}`;
    this.storages[name] = data;
    localStorage[name] = encode(settings.key, JSON.stringify(data));
  }
}

const storage = new Storage();

const getId = () => {
  return Math.floor(new Date() / 1000).toString(16) + Math.random().toString(16).substr(-10);
}

class Database {
  constructor(name, settings) {
    this.name = name;
    this.settings = settings;
  }
  get(colName) {
    return new Collection(`${this.name}.${colName}`, this.settings);
  }
}

class Collection {
  constructor(colName, settings) {
    this.colName = colName;
    this.settings = settings;
    this._compare = this._compare.bind(this);
  }
  _compare(doc) {
    return this.queryData.every((key, value) => {
      return doc[key] === value;
    });
  }
  _getColData() {
    console.log([this.colName, storage.get(this.colName, this.settings)]);
    return storage.get(this.colName).data;
  }
  _setColData(colData) {
    const { settings } = storage.get(this.dbName, this.settings);

    storage.set(this.colName, {
      settings: {
        ...settings,
        updatedAt: new Date().toISOString()
      },
      data: colData
    }, this.settings)
  }
  findOne(query, params) {
    this.queryData = Object.entries(query);
    this.params = params;
    return colData.find(this._compare);
  }
  find(query, params) {
    this.queryData = Object.entries(query);
    this.params = params;
    return this;
  }
  limit(value) {
    this.queryLimit = value;
    return this;
  }
  skip(value) {
    this.querySkip = value;
    return this;
  }
  toArray() {
    const colData = this._getColData();

    return colData.filter(this._compare).slice(this.querySkip, this.queryLimit);
  }
  insertOne(data) {
    if (!data) return null;

    const colData = this._getColData();

    this._setColData([...colData, { ...data, _createdAt: new Date().toISOString(), _id: getId() }]);
  }
  insertMany(array) {
    if (!array || !array.length) return null;

    const colData = this._getColData();

    this._setColData([...colData, ...array.map((data) => {
      return { ...data, _createdAt: new Date().toISOString(), _id: getId() };
    })]);
  }
  updateOne(query, update) {
    if (!query || !update) return null;

    const colData = this._getColData();

    const data = this.findeOne(query);

    if (update.$set) {
      Object.values(update.$set).forEach(([key, val]) => {
        if (key === "_id") return;
        data[key] = val;
        if (data._updatedAt) delete data._updatedAt;
      });
    }
    if (update.$unset) {
      Object.values(update.$unset).forEach(([key, val]) => {
        if (key === "_id") return;
        if (val) delete data[key];
        if (data._updatedAt) delete data._updatedAt;
      });
    }
    if (!data._updatedAt) data._updatedAt = new Date().toISOString();

    this._setColData(data.map((doc) => {
      return doc._id === data._id ? data : doc;
    }));
  }
  updateMany(query, update) {
    if (!query || !update) return null;

    const colData = this._getColData();

    const data = this.finde(query).toArray();

    this.queryData = query;

    this._setColData(data.map((doc) => {
      if (this._compare(doc)) {
        if (update.$set) {
          Object.values(update.$set).forEach(([key, val]) => {
            if (key === "_id") return;
            doc[key] = val;
            if (doc._updatedAt) delete doc._updatedAt;
          });
        }
        if (update.$unset) {
          Object.values(update.$unset).forEach(([key, val]) => {
            if (key === "_id") return;
            if (val) delete doc[key];
            if (doc._updatedAt) delete doc._updatedAt;
          });
        }
        if (!doc._updatedAt) doc._updatedAt = new Date().toISOString();
      }
      return doc;
    }));
  }
}

export default Database;
