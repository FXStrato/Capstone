import 'whatwg-fetch'; //for polyfill
import firebase from 'firebase';

/* Controller handling pulling data form firebase */

let controller = {
  getAllProjects: () => {
    let allProjectRef = firebase.database().ref('/projects/').once('value').then((snapshot) => {
      console.log(snapshot.val());
      return snapshot.val();
    });
    return allProjectRef;
  },
}

export default controller;
