const Actions = {
  pages: {
    leads: {
      create: () => (state, actions) => {
        db.collection("leads").find().then(result => {
          setLeads(result);
        })
      }
    },
    "lead-form": {
      create: element => (state, actions) => {
        console.log("Page leads create")
      }
    }
  }
};