/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import {Dialog, FlatButton, RaisedButton } from 'material-ui';
import { Link } from 'react-router';
import SignupButton from './signupButton';
import ProjectForm from './adminComponents/projectSubmissionForm';

/* Home will be the landing page for the application. */

class Home extends Component {
  render() {
    return (
      <div className="container">
        <SignupButton/>
        <Row>
          <Col s={12}>
            <p>This is the home page. <Link to="/interests">It will link to the Interests page</Link></p>
            <p>Testing props {this.props.userEmail}</p>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Home;
