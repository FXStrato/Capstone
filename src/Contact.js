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
            <h3>Have questions?</h3>
            <p>Email us at questions@frontier.com (Please don't actually email us, we don't have that set up)</p>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Contact;
