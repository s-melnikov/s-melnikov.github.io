define("state", () => {
  return {
    route: location.hash.slice(2),
    user: {
      first_name: "Jonh",
      last_name: "Doe"
    },
    collections: null,
    collection: null,
    entries: null
  }
});