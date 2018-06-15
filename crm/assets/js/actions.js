const Actions = {
  pages: {
    leads: {
      create: () => (state, actions) => {
        console.log(actions)
      }
    },
    "lead-form": {
      create: element => (state, actions) => {
        console.log("Page leads create")
      }
    }
  }
};