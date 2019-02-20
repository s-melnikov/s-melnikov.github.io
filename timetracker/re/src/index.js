import { h, app } from 'hyperapp';
import state from './state';
import actions from './actions';
import view from './view';

import './styles.css';

app(state, actions, view, document.body);
