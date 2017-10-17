if (location.search.indexOf("install") != -1) {
  fetch("mocks/Users.json").then(resp => resp.json()).then(data => {
    let table = ls.table("Users")
    data.map(item => { table.add(item) })
  })
  fetch("mocks/Cars.json").then(resp => resp.json()).then(data => {
    let table = ls.table("Cars")
    data.map(item => { table.add(item) })
  })
  fetch("mocks/Apps.json").then(resp => resp.json()).then(data => {
    let table = ls.table("Apps")
    data.map(item => { table.add(item) })
  })
  fetch("mocks/Companies.json").then(resp => resp.json()).then(data => {
    let table = ls.table("Companies")
    data.map(item => { table.add(item) })
  })
}