/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import {IndexRoute, browserHistory, Route, Router} from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import React from 'react';
import ReactDOM from 'react-dom';
import * as firebase from 'firebase';
import App from './App';
import Home from './Home';
import About from './About';
import Project from './Project';
import AdminPanel from './AdminPanel';
import './index.css';
import '../node_modules/materialize-css/dist/css/materialize.min.css';

// Needed for onTouchTap
injectTapEventPlugin();

var app = firebase.initializeApp(
  {
    apiKey: "AIzaSyBobw2x0kYkbUQuYQ_lINdR6f_IXy23En0",
    authDomain: "capstone-35f4e.firebaseapp.com",
    databaseURL: "https://capstone-35f4e.firebaseio.com",
    projectId: "capstone-35f4e",
    storageBucket: "capstone-35f4e.appspot.com",
    messagingSenderId: "433979142430"
  }
);

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="project/:projectID" component={Project}/>
      <Route path="admin" component={AdminPanel}/>
      <Route path ="about" component={About}/>
    </Route>
  </Router>,
  document.getElementById('root')
);
