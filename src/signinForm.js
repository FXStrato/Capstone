import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Row, Col } from 'react-materialize';


class signinForm extends Component {

  popupGoogleSignup(){
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log(user);
        console.log(user.displayName + " is signed in!");
        window.location.assign("/interests");

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
    <div className="authModal" id="signinModal">   
        <Row>
          <Col s={6}>
            <img className="googleAuthImg" onClick={this.popupGoogleSignup} src="https://www.codenameone.com/img/blog/google-sign-in.png" alt=""/>
          </Col>
          <Col s={6}>
            <h2>Welcome back!</h2>
          </Col>
        </Row>     
    </div>
    );
  }
}

export default signinForm;
