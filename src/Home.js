/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import {Dialog, FlatButton, RaisedButton } from 'material-ui';
import { Link } from 'react-router-dom';
import SignupButton from './signupButton';
import SigninButton from './signinButton';
import ProjectForm from './adminComponents/projectSubmissionForm';

/* Home will be the landing page for the application. */

class Home extends Component {

  componentDidMount = () => {
    console.log(this.props);
  }

  render() {
    return (
      <div className="container">
        {this.props.userEmail ? "" : <div><SignupButton/><SigninButton/></div>}
        <Row>
          <Col s={12}>
            <p>This is the home page. <Link to="/interests">It will link to the Interests page</Link></p>
            <p>Testing props {this.props.userEmail ? this.props.userEmail : 'User is not logged in'}</p>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Home;
