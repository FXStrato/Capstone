/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import { Link } from 'react-router';

/* Interests page */

class Interests extends Component {
  render() {
    return (
      <div className="container">
        <Row>
          <Col s={12}>
            <p>This is the Interests Page. <Link to="projects">It links to View/Search Projects</Link></p>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Interests;
