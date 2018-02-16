define("router", () => {

  const router = createRouter({
    "/": Collections,
    "/collections": Collections,
    "/collection/:slug": Collection,
    "/collection/:slug/field/:id": Collection,
    "/collection/:slug/entries": CollectionEntries
  });

  return router;
});