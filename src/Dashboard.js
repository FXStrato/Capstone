/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import firebase from 'firebase';

/* Home will be the landing page for the application. */

class Dashboard extends Component {

  componentDidMount = () => {
    console.log(this.props);
  }

  render() {
    return (
      <div className="container">
        <h3>Active Projects</h3>
        <p>XYZ Project Title</p>
        <Row>
          <Col s={12}>
            This is the Dashboard asdffada
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;
