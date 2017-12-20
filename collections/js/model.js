define("model", ["utils/store"], Store => {
  let store = new Store("my_app")

  let state = {
    route: location.hash.slice(2),
    user: { first_name: "Jonh", last_name: "Doe" },
    collections: null,
    collection: null,
    entries: null
  }

  let actions = {
    setRoute: route => ({ route: route }),
    getCollections: () => (state, actions) => {
      store.collection("collections").find().then(result => {
        let collections = result ? result.data() : null
        actions.setCollections(collections && collections.length ? collections : null)
      })
      return { collections: null }
    },
    setCollections: collections => ({ collections }),
    getCollection: slug => (state, actions) => {
      store.collection("collections").where({ slug: slug }).findOne().then(result => {
        actions.setCollection(result && result.data())
      })
      return { collection: null }
    },
    setCollection: collection => ({ collection }),
    getCollectionEntries: slug => (state, actions) => {
      store.collection(slug).find().then(result =>
        actions.setCollectionEntries(result.data())
      )
      return { entries: null }
    },
    setCollectionEntries: entries => ({ entries })
  }

  return { state, actions }
})
