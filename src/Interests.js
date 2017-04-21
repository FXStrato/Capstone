/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';

/* Home will be the landing page for the application. */

class Interests extends Component {
  render() {
    return (
      <div>
        <Row>
          <Col s={12}>
            This is the Interests Page
          </Col>
        </Row>
      </div>
    );
  }
}

export default Interests;
