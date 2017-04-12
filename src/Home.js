/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import {Link} from 'react-router';
import {Row, Col, Card, CardTitle} from 'react-materialize';
import {TextField, RaisedButton} from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import firebase from 'firebase';
import _ from 'lodash';

/* Home will be the landing page for the application. */

class Home extends Component {
  state = {
    topProjects: [],
    topProjectIDs: []
  }

  componentDidMount = () => {
    this.getProjects();
  }

  getProjects = () => {
    firebase.database().ref('/landingpage/top_projects').once('value').then((snapshot) => {
      this.setState({topProjectIDs: snapshot.val()});
      for(let i = 0; i < snapshot.val().length; i++) {
        firebase.database().ref('projects/' + snapshot.val()[i]).once('value').then((snapshot) => {
          let temp = this.state.topProjects;
          temp.push(snapshot.val());
          this.setState({topProjects: temp});
        });
      }
    });
    let result = _.map(this.state.topProjects, (elem, index) => {
      return (
        <Col s={12} m={4} key={'topProject-' + index}>
          <Link to={'projects/' + this.state.topProjectIDs[index]} style={{color: 'black'}}>
            <div className="card hoverable">
              <div className="card-image">
                <img src={elem.cover_image_link} alt="AnswerDash Software Engineer Banner"/>
                <span className="card-title truncate">Front-End Engineer</span>
              </div>
              <div className="card-content">
                <p className="truncate">
                  Company: Boogle <br/>
                  Project: Build a blogging app
                </p>
              </div>
              <div className="card-action">
                Open for 5 more days
              </div>
            </div>
          </Link>
        </Col>
      )
    });
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
        <div className="banner">
          <div className="container">
            <Row>

              <Col s={12} m={12} l={6}>
                <h2>Create cool projects.</h2>
                <h2>Get cool jobs.</h2>
                <h4>Build your portfolio while simultaneously creating projects employers are interested in. Win win.</h4>
              </Col>
              <Col s={12} m={12} l={6}>
                <div className="video-container">
                  <iframe className="topVideo" src="https://www.youtube.com/embed/Y5pjQQE4W4c" frameBorder="0" allowFullScreen></iframe>
                </div>
              </Col>
            </Row>
          </div>
        </div>

        <div id="listOfTopProjects" className="container">
          <Row>
            <h5 style={{textAlign: "center"}}>Select interested profession</h5>
          </Row>
          <Row style={{marginBottom: "0px"}}>
            {this.state.topProjects}
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
