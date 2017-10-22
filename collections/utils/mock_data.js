if (location.search.indexOf("install") != -1) {

  let db = Database("test"),
    tables = ["Users", "Cars", "Apps", "Companies"],
    i = 0

  tables.map(name => {
    fetch("mocks/Users.json").then(resp => resp.json()).then(data => {
      let table = db.exists(name) ? db.table(name) : db.create(name)
      table.truncate()
      data.map(item => { table.add(item) })
      i++
      if (i == tables.length) {
        location.replace(location.href.split("?")[0])
      }
    })
  })
}