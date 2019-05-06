def(['router', 'actions', 'view'], ({ location }, actions, view) => {
  const { app } = hyperapp;
  const main = app({ location: location.state }, actions, view, document.body);
  const unsubscribe = location.subscribe(main.location);
  main.init();
});
// import { location } from './router';
// import actions from './actions';
// import view from './views';
