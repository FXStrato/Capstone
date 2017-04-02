/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import {IndexRoute, browserHistory, Route, Router} from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Home from './Home';
import Project from './Project';
import './index.css';
import '../node_modules/materialize-css/dist/css/materialize.min.css';

// Needed for onTouchTap
injectTapEventPlugin();

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="project/:projectID" component={Project}/>
    </Route>
  </Router>,
  document.getElementById('root')
);
