/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';

/* Search Projects  */

class SearchProjects extends Component {
  render() {
    return (
      <div className="container">
        <Row>
          <Col s={12}>
            <p>This is the Search Projects Page</p>
          </Col>
        </Row>
      </div>
    );
  }
}

export default SearchProjects;
