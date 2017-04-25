/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';


/*This page will display the full spec of the passed in project */

class ProjectFullSpec extends Component {
  render() {
    return (
      <div className="container">
        <Row>
          <Col s={12}>
            This is the Full Spec Project Page
            <p>{this.props.isAuth ? "I'm True" : "I'm False"}</p>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ProjectFullSpec;
