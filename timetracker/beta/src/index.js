def(['router', 'actions', 'view'], ({ location }, actions, view) => {
  const { app } = hyperapp;
  const main = app({ location: location.state }, actions, view, document.body);
  location.subscribe(main.location);
  // main.init();
});
