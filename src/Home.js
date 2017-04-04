/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import {Link} from 'react-router';
import {Row, Col, Card, CardTitle} from 'react-materialize';
import {TextField, RaisedButton} from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';


/* Home will be the landing page for the application. */

class Home extends Component {
  state = {
  }

  handleChange = (event) => {
    var field = event.target.name;
    var value = event.target.value;
    var changes = {}; //object to hold changes
    changes[field] = value; //change this field
    this.setState(changes); //update state
    }

    handleSubmit = (event) => {
      console.log('name', this.state.name);
      console.log('email', this.state.email);
      event.preventDefault();
    }


  render() {
    return (
      <section>
        <Row>
          <Col s={12} style={{paddingBottom: 200}}>
            <div className="banner"></div>
          </Col>
        </Row>
        <div className="container">
          <Row>
            <Col s={12} className="center-align">
              This bit can cover the main tech fields we cover, like Project Manager, Software Developer, Data Scientist, etc.
            </Col>
          </Row>
          <Row>
            <Col s={12} className="center-align">
              <h2>Top Projects</h2>
            </Col>
          </Row>
          <Row>
            <Col s={12} m={4}>
              <Link to="project/123" style={{color: 'black'}}>
                <div className="card hoverable">
                  <div className="card-image">
                    <img src="https://static.pexels.com/photos/90807/pexels-photo-90807.jpeg" alt="AnswerDash Software Engineer Banner"/>
                    <span className="card-title truncate">Software Engineer</span>
                  </div>
                  <div className="card-content">
                    <p className="truncate">
                      Company: AnswerDash <br/>
                      Project: Design an automated answer bot
                    </p>
                  </div>
                  <div className="card-action">
                    Open for 5 more days
                  </div>
                </div>
              </Link>
            </Col>
            <Col s={12} m={4}>
              <div className="card hoverable">
                <div className="card-image">
                  <img src="https://static.pexels.com/photos/241544/pexels-photo-241544.jpeg" alt="Data Analyst Banner"/>
                  <span className="card-title">Data Analyst</span>
                </div>
                <div className="card-content">
                  <p className="truncate">
                    Company: Amazon <br/>
                    Project: Design a structural database with image hosting and tag based sort.
                  </p>
                </div>
                <div className="card-action">
                  Open for 10 more days
                </div>
              </div>
            </Col>
            <Col s={12} m={4}>
              <div className="card hoverable">
                <div className="card-image">
                  <img src="https://static.pexels.com/photos/57825/pexels-photo-57825.jpeg" alt="Project Manager Banner"/>
                  <span className="card-title">Project Manager</span>
                </div>
                <div className="card-content">
                  <p className="truncate">
                    Company: Yahoo <br/>
                    Project: Create a schedule for a team building a web app with a deadline in 3 weeks.
                  </p>
                </div>
                <div className="card-action">
                  Open for 2 more days
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

    );
  }
}

export default Home;

/* <Row>
  <Col s={12}>
    <form role="form">
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <TextField style={{color: '#039BE5'}} floatingLabelText="Email" fullWidth={true} type="email" name="email" onChange={(e) => {this.handleChange(e)}} />
      </MuiThemeProvider>
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <TextField style={{color: '#039BE5'}} floatingLabelText="Name" fullWidth={true} type="text" name="name" onChange={(e) => {this.handleChange(e)}} />
      </MuiThemeProvider>
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <RaisedButton onTouchTap={this.handleSubmit}>Submit</RaisedButton>
      </MuiThemeProvider>
    </form>
  </Col>
</Row> */
