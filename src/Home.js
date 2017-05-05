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
        <div id="homePage">
          <div className="heroBanner">
            <h1>Portfolio Building,<br/><b>Reimagined</b>.</h1>
            <h3>Create brilliant projects, get jobs with brilliant companies.</h3>
            <Link to="/interests"><button className="primaryCTA">Start Browsing Projects</button></Link>
          </div>
          <div className="companyLogosList">
            <p>Work with these companies &#38; more</p>
            <Row>
              <Col s={2}>
                <img src={process.env.PUBLIC_URL + '/img/google.png'} style={{height:"40px"}} />
              </Col>
              <Col s={2}>
                <img src={process.env.PUBLIC_URL + '/img/hulu.png'} />
              </Col>
              <Col s={2}>
                <img src={process.env.PUBLIC_URL + '/img/facebook.png'} />
              </Col>
              <Col s={2}>
                <img src={process.env.PUBLIC_URL + '/img/sony.png'} style={{height:"27px"}} />
              </Col>
              <Col s={2}>
                <img src={process.env.PUBLIC_URL + '/img/msft.png'} />
              </Col>
              
              <Col s={2}>
                <img src={process.env.PUBLIC_URL + '/img/nasa.png'} />
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
