if (location.search.indexOf("install") != -1) {
  fetch("mocks/Users.json").then(resp => resp.json()).then(data => {
    let table = db.table("Users")
    table.drop()
    data.map(item => { table.add(item) })
  })
  fetch("mocks/Cars.json").then(resp => resp.json()).then(data => {
    let table = db.table("Cars")
    table.drop()
    data.map(item => { table.add(item) })
  })
  fetch("mocks/Apps.json").then(resp => resp.json()).then(data => {
    let table = db.table("Apps")
    table.drop()
    data.map(item => { table.add(item) })
  })
  fetch("mocks/Companies.json").then(resp => resp.json()).then(data => {
    let table = db.table("Companies")
    table.drop()
    data.map(item => { table.add(item) })
  })
}