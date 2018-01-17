if (location.search.indexOf("install") != -1) {
  new Store("my_app").drop()
  fetch("install/dump.json").then(resp => resp.json()).then(data => {
    let storage = new Store("my_app")
    Object.keys(data).forEach(table_name => {
      let collection = storage.collection(table_name)
      data[table_name].forEach(item => {
        collection.push(item)
      })
    })
    location.href = location.href.split("?")[0]
  })
}
