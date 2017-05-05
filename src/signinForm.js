import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Row, Col } from 'react-materialize';


class signinForm extends Component {

  popupGoogleSignup = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log(user);
        console.log(user.displayName + " is signed in!");
        this.props.history.push('/dashboard');
        console.log('after attempting to redirect...this shouldnt show');
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });
  }

  render() {
    return (
    <span> 
      <img className="googleAuthImg" onClick={this.popupGoogleSignup} src="https://www.codenameone.com/img/blog/google-sign-in.png" alt=""/>    
    </span>
    );
  }
}

export default signinForm;
