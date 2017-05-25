/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import {Dialog, FlatButton, RaisedButton } from 'material-ui';
import { Link } from 'react-router-dom';
import SignupButton from './signupButton';
import SigninButton from './signinButton';
import ProjectForm from './adminComponents/projectSubmissionForm';
import Interests from './Interests';

/* Home will be the landing page for the application. */

class Home extends Component {

  componentDidMount = () => {
    // console.log(this.props);
  }

  render() {
    return (
      <div id="homePage">
          <div className="heroBanner">
            <div className="container">
              <div className="content">
                <h1>Land jobs by creating <br/>relavent portfolio projects</h1>
                <h3>Increase your chances of getting a job offer by 40% by creating</h3>
                <h3>portfolio projects that employers <b>actually want to see</b>.</h3>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="interestSelection">
              <Interests></Interests>
            </div>
          </div>
          <div className="browseTileSection">
            <Row>
              <Col s={12} m={12} l={7} style={{paddingLeft:"0px"}}>
                <img src={process.env.PUBLIC_URL + '/img/projectslide.png'}/>
              </Col>
              <Col s={12} m={12} l={5} style={{textAlign:"right",paddingRight:"10vw"}}>
                <div className="numberCircle">1</div>
                <h2>Browse interesting portfolio project ideas, validated by leading companies</h2>
                <p>Get full project specificiations, guiding <br/>you to create a brilliant project</p>
              </Col>
            </Row>
          </div>
          <div className="createProjectSection">
            <div className="numberCircle">2</div>
            <h2>Create brilliant projects</h2>
            <p>Use your skills and our tools to help craft some of your proudest work.</p>
          </div>
          <div className="container">

            <div className="companyLogosList">
              <Row>
                <Col s={12} m={5} l={5} style={{textAlign:"left"}}>
                  <div className="numberCircle">3</div>
                  <h2>Recieve Employer Interest</h2>
                  <p>Employers will see what the project you made and reach out to interview you!</p>
                </Col>
                <Col s={12} m={7} l={7}>
                  <p>Work with these companies &#38; more</p>
                  <Row>
                    <Col s={12} m={4} l={4}>
                      <div className="imageHolder">
                        <img src={process.env.PUBLIC_URL + '/img/google.png'} style={{height:"40px"}} />
                      </div>
                    </Col>
                    <Col s={12} m={4} l={4}>
                      <div className="imageHolder">
                        <img src={process.env.PUBLIC_URL + '/img/hulu.png'} />
                      </div>
                    </Col>
                    <Col s={12} m={4} l={4}>
                      <div className="imageHolder">
                        <img src={process.env.PUBLIC_URL + '/img/facebook.png'} />
                      </div>
                    </Col>
                    <Col s={12} m={4} l={4}>
                      <div className="imageHolder">
                        <img src={process.env.PUBLIC_URL + '/img/sony.png'} style={{height:"27px"}} />
                      </div>
                    </Col>
                    <Col s={12} m={4} l={4}>
                      <div className="imageHolder">
                        <img src={process.env.PUBLIC_URL + '/img/microsoft.png'} />
                      </div>
                    </Col>
                    <Col s={12} m={4} l={4}>
                      <div className="imageHolder">
                        <img src={process.env.PUBLIC_URL + '/img/nasa.png'} />
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
        </div>
      </div>
    );
  }
}

export default Home;
