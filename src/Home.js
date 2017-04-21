/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import { Link } from 'react-router';

/* Home will be the landing page for the application. */

class Home extends Component {
  render() {
    return (
      <div className="container">
        <Row>
          <Col s={12}>
            <p>This is the home page. <Link to="/interests">It will link to the Interests page</Link></p>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Home;
