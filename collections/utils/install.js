if (location.search.indexOf("install") != -1) {

  let db = Database("test"), i = 0
  let schema = db.exists("schema") ? db.table("schema") : db.create("schema")
  fetch("mocks/schema.json").then(resp => resp.json()).then(data => {
    schema.truncate()
    data.map(t_scema => {
      t_scema.uid = t_scema.slug
      schema.add(t_scema)
      fetch("mocks/" + t_scema.slug + ".json").then(resp => resp.json()).then(data => {
        let table = db.exists(t_scema.slug) ? db.table(t_scema.slug) : db.create(t_scema.slug)
        table.truncate()
        data.map(item => { table.add(item) })
        i++
        if (i == 4) {
          location.replace(location.href.split("?")[0])
        }
      })
    })
  })
}