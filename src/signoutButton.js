import React from 'react';
import firebase from 'firebase';


export default class signoutButton extends React.Component {
  signoutUser(){
    firebase.auth().signOut().then(function() {
        console.log('Signed Out!');
        location.reload();
    }).catch(function(error) {
        console.log(error);
    });
  }

  render() {
    return (
        <button label="Sign Out" onTouchTap={this.signoutUser}>Sign Out</button>
    );
  }
}