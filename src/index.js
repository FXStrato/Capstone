/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import { BrowserRouter as Router } from 'react-router-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import React from 'react';
import { render } from 'react-dom';
import firebase from 'firebase';
import App from './App';
import './index.css';
import '../node_modules/materialize-css/dist/css/materialize.min.css';

// Needed for onTouchTap
injectTapEventPlugin();

let app = firebase.initializeApp(
  {
    apiKey: "AIzaSyBobw2x0kYkbUQuYQ_lINdR6f_IXy23En0",
    authDomain: "capstone-35f4e.firebaseapp.com",
    databaseURL: "https://capstone-35f4e.firebaseio.com",
    projectId: "capstone-35f4e",
    storageBucket: "capstone-35f4e.appspot.com",
    messagingSenderId: "433979142430"
  }
);

render(
  <Router>
    <App/>
  </Router>,
  document.getElementById('root')
);
