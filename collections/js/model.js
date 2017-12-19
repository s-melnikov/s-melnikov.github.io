define("model", ["utils/store"], Store => {
  let storage = new Store("my_app")

  let state = {
    route: location.hash.slice(2),
    user: { first_name: "Jonh", last_name: "Doe" },
    tables: null,
    table: null,
    items: null
  }

  let actions = {
    setRoute: route => ({ route: route }),
    getTables: () => (state, actions) => {
      storage.table("tables").find().then(result => {
        actions.setTables(result.data())
      })
      return { tables: null }
    },
    setTables: tables => ({ tables }),
    getTable: slug => (state, actions) => {
      storage.table("tables").where({ slug: slug }).findOne().then(result => {
        actions.setTable(result.data())
      })
      return { table: null }
    },
    setTable: table => ({ table }),
    getTableItems: slug => (satte, actions) => {
      storage.table(slug).find().then(result =>
        actions.setTableItems(result.data())
      )
      return { items: null }
    },
    setTableItems: items => ({ items })
  }

  return {
    state, actions
  }
})
