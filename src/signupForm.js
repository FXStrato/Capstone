import React, { Component } from 'react';
import * as firebase from 'firebase';

class signupForm extends Component {

  popupGoogleSignup(){
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log(user);

        firebase.database().ref('users/' + user.uid).once('value').then((snapshot) => {
          // Check if this is a new user
          if(snapshot.val() == null){
            var userRef = firebase.database().ref('users/' + user.uid);

            var fName = user.displayName.split(" ")[0];

            var userData = {
              fullName: user.displayName,
              photoURL: user.photoURL,
              email: user.email,
              firstName: fName
            }
            var userPromise = userRef.set(userData);
          }
        });

        

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
    <div id="signUpModal">      
        <img className="googleAuthImg" onClick={this.popupGoogleSignup} src="https://www.codenameone.com/img/blog/google-sign-in.png" alt=""/>
    </div>
    );
  }
}

export default signupForm;
