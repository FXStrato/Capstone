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
            <p>This is the About page</p>
          </Col>
        </Row>
      </div>
    );
  }
}

export default About;
