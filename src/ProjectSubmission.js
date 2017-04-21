/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';

/* Page handling project submissions */

class ProjectSubmission extends Component {
  render() {
    return (
      <div className="container">
        <Row>
          <Col s={12}>
            This is the Project Submission Page
          </Col>
        </Row>
      </div>
    );
  }
}

export default ProjectSubmission;
