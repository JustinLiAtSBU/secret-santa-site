/* eslint-disable no-underscore-dangle */
import React from 'react';
import ReactDOM from 'react-dom';

import './css/todo_layout.css'
import './css/todo_style.css'
import * as serviceWorker from './serviceWorker';

import ReactReduxFirebaseApp from './store/ReactReduxFirebaseApp'

ReactDOM.render(
  <ReactReduxFirebaseApp />, document.getElementById('root')
);
