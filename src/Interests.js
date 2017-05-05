/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import { Link } from 'react-router-dom';

/* Interests page */

class Interests extends Component {
  render() {
    return (
      <div className="container selectInterestsSection">
        <h2>What type of career are you interested in?</h2>
        <Row className="center-align">
          <Col s={12} m={12} l={4}>
            <Link to={{pathname: '/projects/', state: {professions: ['UX Designer','Visual Communication Designer']}}}>
              <div className="interestTile">
              <i className="fa fa-paint-brush fa-2x" aria-hidden="true"></i><br/>Design
              </div>
            </Link>
          </Col>
          <Col s={12} m={12} l={4}>
            <Link to={{pathname: '/projects/', state: {professions: ['Software Developer']}}}>
              <div className="interestTile">
                <i className="fa fa-code" aria-hidden="true"></i><br/>Software Development
              </div>
            </Link>
          </Col>
          <Col s={12} m={12} l={4}>
            <Link to={{pathname: '/projects/', state: {professions: ['Project Manager']}}}>
              <div className="interestTile">
                <i className="fa fa-users" aria-hidden="true"></i><br/>Management
              </div>
            </Link>
          </Col>
        </Row>
        <Row className="center-align">
          <Col s={12} m={12} l={6}>
            <Link to={{pathname: '/projects/', state:{professions: ['Marketing, Analyst']}}}>
              <div className="interestTile">
                <i className="fa fa-bullhorn" aria-hidden="true"></i><br/>Marketing
              </div>
            </Link>
          </Col>
          <Col s={12} m={12} l={6}>
            <Link to={{pathname: '/projects/', state:{professions: ['Security Analyst', 'System Administrator']}}}>
              <div className="interestTile">
                <i className="fa fa-shield" aria-hidden="true"></i><br/>Security
              </div>
            </Link>
          </Col>
        </Row>
       <Link to="/projects/"><button className="secondaryButton">See All Projects</button></Link>
      </div>
    );
  }
}

export default Interests;

//Marketing, Security
