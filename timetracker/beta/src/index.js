import { app } from 'hyperapp';
import { location } from './router';
import actions from './actions';
import view from './views';
import { db, subscribe } from './firebase';

import './style.scss';

// console.log(db);

subscribe(state => console.log(state));

// const initialState = {
//   location: location.state,
//   tasks: [],
//   timestamps: [],
//   latestTasks: [],
//   daysTasks: [],
// }

// const main = app(initialState, actions, view, document.body);
// const unsubscribe = location.subscribe(main.location);
// main.init();
