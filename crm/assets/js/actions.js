const Actions = {
  items: {
    get: name => (state, actions) => {
      db.collection(name).find().then(items => {
        actions.set({ name, items });
      });
    },
    set: ({ name, items }) => () => ({ [name]: items })
  },
  "page-leads-oncreate": () => (state, actions) => {
    actions.items.get("leads");
  },
  "page-lead-form-oncreate": () => {
    console.log("Page lead form create")
  }
};