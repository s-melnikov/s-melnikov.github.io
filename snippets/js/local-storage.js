(root => {
  const CHARS = "0123456789abcdefghijklmnopqrstuvwxyz";

  const uniqid = () => {
    let result = Date.now().toString(36);
    while (result.length < 12) result += CHARS[Math.floor(Math.random() * 36)];
    return result;
  }

  class Storage {
    constructor(storage_name) {
      this.storage_name = storage_name;
    }
    col(collection_name) {
      return new Collection(collection_name, this);
    }
    drop() {
      this.sync(null, {});
    }
    sync(path, data) {
      let lsdata = JSON.parse(localStorage[this.storage_name] || '{}');
      if (data) {
        if (path) lsdata[path] = data;
        else lsdata = data;
        localStorage[this.storage_name] = JSON.stringify(lsdata);
      } else {
        return (path ? lsdata[path] : lsdata) || {};
      }
    }
  }

  class Collection {
    constructor(collection_name, storage) {
      this.collection_name = collection_name;
      this.storage = storage;
    }
    set(item) {
      let col = this.sync();
      item.uid = Storage.uniqid();
      item.created = Date.now();
      item.updated = Date.now();
      col[item.uid] = item;
      this.sync(col);
    }
    get() {
      return Object.values(this.sync());
    }
    del(uid) {
      let col = this.sync();
      delete col[uid];
      this.sync(col);
    }
    sync(data) {
      return this.storage.sync(this.collection_name, data);
    }
  }

  const storage = name => new Storage(name);

  root.storage = storage;
})(this);