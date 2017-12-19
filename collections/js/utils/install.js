define("utils/install", ["utils/store"], Store => {
  new Store("my_app").drop()
  fetch("install/dump.json").then(resp => resp.json()).then(data => {
    let storage = new Store("my_app")
    Object.keys(data).forEach(table_name => {
      let table = storage.table(table_name)
      data[table_name].forEach(item => {
        table.push(item)
      })
    })
    location.href = location.href.split("?")[0]
  })
})
