/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import '../node_modules/materialize-css/dist/css/materialize.min.css';

// Needed for onTouchTap
injectTapEventPlugin();

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);
