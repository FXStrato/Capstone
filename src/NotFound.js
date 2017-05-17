/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import { Link } from 'react-router-dom';

/* 404 Page*/

class NotFound extends Component {

  handleReturn = () => {
    this.props.history.goBack();
  }

  render() {
    return (
      <div className="container">
        <Row>
          <Col s={12}>
            <h1 style={{display: 'none'}}>404 Page</h1>
            <h2 style={{fontSize: '1.7rem'}}>Oops!</h2>
            <p>Seems like you've navigated to a location that doesn't exist. <a href="" onTouchTap={this.handleReturn}>Click here to return to your previous location.</a></p>
          </Col>
        </Row>
      </div>
    );
  }
}

export default NotFound;
