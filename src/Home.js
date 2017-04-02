import React, { Component } from 'react';
import {Link} from 'react-router';
import {Row, Col} from 'react-materialize';

class Home extends Component {
  render() {
    return (
      <Row>
        <Col s={12}>
          Home page is here
          <Link to="/project/123">Link to project 123</Link>
        </Col>
      </Row>
    );
  }
}

export default Home;
