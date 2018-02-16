define("actions", () => {

  const setRouter = route => ({ route });

  const getCollections = () => (state, actions) => {
    db.collection("collections").find().then(result => {
      let collections = result.data();
      actions.setCollections(collections.length ? collections : null);
    });
    return { collections: null };
  };

  const setCollections = collections => ({ collections });

  const getCollection = slug => (state, actions) => {
    db.collection("collections").find({ slug: slug }).then(result => {
      let first = result.first();
      actions.setCollection(first && first.data());
    });
    return { collection: null };
  };

  const setCollection = collection => ({ collection });

  const getCollectionEntries = slug => (state, actions) => {
    db.collection(slug).find().then(result =>
      actions.setCollectionEntries(result.data());
    );
    return { entries: [] };
  };

  const setCollectionEntries = entries => ({ entries }),

  const editFieldFormSubmit: ({ index, update }) => (state, actions) => {
    state.collection.fields[index] = update;
    db.collection("collections").find(state.collection.$key).then(result => {
      let collection = result.first();
      collection.update({ fields: state.collection.fields }, () => { /* TODO */});
    });
    return { collaction: state.collection };
  }

  return {
    setRoute,
    getCollections,
    setCollections,
    getCollection,
    setCollection,
    getCollectionEntries,
    setCollectionEntries,
    editFieldFormSubmit
  };
});