/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import { Link } from 'react-router';

/* Contact Us Page */

class Contact extends Component {
  render() {
    return (
      <div className="container">
        <Row>
          <Col s={12}>
            <p>This is the contact us page</p>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Contact;
