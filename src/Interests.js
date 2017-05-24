/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import { Link } from 'react-router-dom';

/* Interests page */

class Interests extends Component {
  render() {
    return (
      <div className="container selectInterestsSection">
        <h4>Choose your career interests</h4>
        <Row className="center-align">
          <Col s={12} m={12} l={4}>
            <Link to="/browse/software">
              <div className="interestTile">
                <img src={process.env.PUBLIC_URL + '/img/SoftwareGuy.png'}/><br/>
                Software
              </div>
            </Link>
          </Col>

          <Col s={12} m={12} l={4}>
            <Link to="/browse/design">
              <div className="interestTile">
                <img src={process.env.PUBLIC_URL + '/img/DesignGuy.png'}/><br/>
                <span>Design</span>
              </div>
            </Link>
          </Col>

          <Col s={12} m={12} l={4}>
            <Link to="/browse/pm">
              <div className="interestTile">
                <img src={process.env.PUBLIC_URL + '/img/pmGuy.png'}/><br/>
                <span>PM</span>
              </div>
            </Link>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Interests;

//Marketing, Security
