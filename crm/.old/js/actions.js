const Actions = {
  getItems: ({ name, where }) => (state, actions) => {
    db.collection(name).find(where).then(items => {
      actions.setItems({ name, items });
    });
  },
  setItems: ({ name, items }) => {
    return { [name]: items }
  },
  getItem: ({ itemsName, itemName,  where }) => (state, actions) => {
    db.collection(itemsName).find(where).then(items => {
      actions.setItem({ itemName, item: items[0] });
    });
  },
  setItem: ({ itemName, item }) => {
    return { [itemName]: item }
  },
  pageAccountsOnCreate: element => (state, { getItems }) => {
    getItems({ name: "accounts" });
    getItems({ name: "account_types" });
    getItems({ name: "account_sorces" });
    getItems({ name: "account_sectors" });
  },
  pageAccountOnCreate: element => (state, { getItem, getItems }) => {
    getItem({
      itemsName: "accounts",
      itemName: "account",
      where: state.route.params.uid
    });
    getItems({ name: "account_types" });
    getItems({ name: "account_sorces" });
    getItems({ name: "account_sectors" });
  },
  pageAccountEditOnCreate: element => (state, { getItem, getItems }) => {
    getItem({
      itemsName: "accounts",
      itemName: "account",
      where: state.route.params.uid
    });
    getItems({ name: "account_types" });
    getItems({ name: "account_sorces" });
    getItems({ name: "account_sectors" });
  }
};