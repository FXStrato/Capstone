/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';

/* About will talk about the project*/

class About extends Component {
  render() {
    return (
      <div className="container">
        <Row>
          <Col s={12}>
            <h3>About US</h3>
            <p>Frontier connects students to employers through sponsored projects, giving students access to full projects to put on their resume wile providing potential hirees for searching companies</p>
          </Col>
        </Row>
      </div>
    );
  }
}

export default About;
