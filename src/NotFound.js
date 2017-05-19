/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';

/* 404 Page*/

class NotFound extends Component {

  render() {
    return (
      <div className="container">
        <Row>
          <Col s={12}>
            <h1 style={{display: 'none'}}>404 Page</h1>
            <h2 style={{fontSize: '1.7rem'}}>Oops!</h2>
            <p>Seems like you've navigated to a location that doesn't exist.</p>
          </Col>
        </Row>
      </div>
    );
  }
}

export default NotFound;
