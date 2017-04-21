/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';

/* About will talk about the project*/

class About extends Component {
  render() {
    return (
      <div>
        <Row>
          <Col s={12}>
            This is the About page
          </Col>
        </Row>
      </div>
    );
  }
}

export default About;
