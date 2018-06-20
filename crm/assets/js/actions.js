const Actions = {
  item: {
    get: (name, uid) => (state, actions) => {
      db.collection(name).find(uid).then(items => {
        actions.set({ name, items });
      });
    },
    set: ({ name, items }) => (state, actions) => ({ [name]: items[0] })
  },
  items: {
    get: name => (state, actions) => {
      db.collection(name).find().then(items => {
        actions.set({ name, items });
      });
    },
    set: ({ name, items }) => () => ({ [name]: items })
  },
  "page-accounts-oncreate": element => (state, actions) => {
    actions.items.get("accounts");
    actions.items.get("account_types");
    actions.items.get("account_sources");
    actions.items.get("account_sectors");
  },
  "page-account-oncreate": element => (state, actions) => {
    actions.item.get("accounts", state.route.params.uid);
    actions.items.get("account_types");
    actions.items.get("account_sources");
    actions.items.get("account_sectors");
  }
};