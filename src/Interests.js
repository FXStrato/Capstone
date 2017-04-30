/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import { Link } from 'react-router-dom';

/* Interests page */

class Interests extends Component {
  render() {
    return (
      <div className="container">
        <Row>
          <Col s={12}>
            <p>This is the Interests Page. <Link to="/projects/">It links to View/Search Projects</Link></p>
          </Col>
        </Row>
        <Row className="center-align">
          <Col s={12} m={12} l={4}><Link to={{pathname: '/projects/', state: {professions: ['UX Designer','Visual Communication Designer']}}}>Design</Link></Col>
          <Col s={12} m={12} l={4}><Link to={{pathname: '/projects/', state:{professions: ['Software Developer']}}}>Software Development</Link></Col>
          <Col s={12} m={12} l={4}><Link to={{pathname: '/projects/', state:{professions: ['Project Manager ']}}}>Management</Link></Col>
        </Row>
        <Row className="center-align">
          <Col s={12} m={12} l={6}><Link to={{pathname: '/projects/', state:{professions: ['Marketing, Analyst']}}}>Marketing</Link></Col>
          <Col s={12} m={12} l={6}><Link to={{pathname: '/projects/', state:{professions: ['Security Analyst', 'System Administrator']}}}>Security</Link></Col>
        </Row>
      </div>
    );
  }
}

export default Interests;

//Marketing, Security
