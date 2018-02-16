define("install", () => {

  // if (location.search.indexOf("install") != -1) {
  //
  // }

  return () => {
    database("my_app").drop()
    let i = 0, count = 0, cb = () => (++i == count) && (location.href = location.href.split("?")[0])
    fetch("install/dump.json").then(resp => resp.json()).then(data => {
      let db = database("my_app")
      Object.keys(data).forEach(table_name => {
        let collection = db.collection(table_name)
        count++
        collection.pushMany(data[table_name], cb)
      })
    })
  }
})
