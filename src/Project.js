import React, { Component } from 'react';
import {Row, Col} from 'react-materialize';

class Project extends Component {
  render() {
    console.log(this.props);
    return (
      <Row>
        <Col s={12}>
          Specific project page is here. Passed in project ID: {this.props.params.projectID}
        </Col>
      </Row>
    );
  }
}


export default Project;
