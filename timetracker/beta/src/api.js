const uid = () => `${Date.now().toString(36)}`

const stored = name => {
  const json = localStorage[name]
  return json ? JSON.parse(json) : {}
}

const store = (name, data) => (localStorage[name] = JSON.stringify(data))

const db = db_name => {
  return {
    col(col_name) {
      return {
        add(item) {
          let data = stored(db_name);
          if (!data[col_name]) data[col_name] = [];
          item.uid = uid();
          data[col_name] = [...data[col_name], item];
          store(db_name, data);
          return item;
        },
        find(where) {
          if (typeof where === 'string') {
            where = { uid: where };
          }
          const keys = Object.keys(where);
          const data = stored(db_name);
          if (!data[col_name]) data[col_name] = [];
          return data[col_name]
            .filter(item => keys.every(key => where.key === item.key))
            .map(item => ({...item}));
        },
        update(where, newData) {
          if (typeof where === "string") {
            where = { uid: where };
          }
          const keys = Object.keys(where);
          const data = stored(db_name);
          let i = 0;
          if (!data[col_name]) data[col_name] = [];
          data[col_name] = data[col_name].map(item =>
            keys.every(key => where.key === item.key)
              ? (i++, {...item, ...newData})
              : item
          );
          store(db_name, data);
          return i;
        },
        delete(where) {
          if (typeof where === "string") {
            where = { uid: where };
          }
          const keys = Object.keys(where);
          const data = stored(db_name);
          let i = 0;
          if (!data[col_name]) data[col_name] = [];
          data[col_name] = data[col_name].filter(item =>
            !keys.every(key => where.key === item.key)
          );
          store(db_name, data);
          return i;
        }
      }
    }
  }
}

export default db
