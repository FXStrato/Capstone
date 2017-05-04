/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import firebase from 'firebase';
import { Link } from 'react-router-dom';
import _ from 'lodash';


/* Home will be the landing page for the application. */

class Dashboard extends React.PureComponent {
  state = {
    userID: this.props.userID,
    isAuth: this.props.isAuth,
    activeProjects: null,
  };

  // This listens for when the new props change
  // ie: when firebase's promises send the new data
  componentWillReceiveProps = (newProps) => {
    this.setState({
      isAuth: newProps.isAuth,
      userID: newProps.userID,
    });
    this.getActiveProjects();
  }

  componentDidMount = () => {
    //Pull all projects from firebase, and store in state.
    firebase.database().ref('/projects/').once('value').then((snapshot) => {
      this.setState({allProjects: snapshot.val()})
    });
    firebase.database().ref('/companies/').once('value').then((snapshot) => {
      this.setState({allCompanies: snapshot.val()})
    });
    if(this.state.isAuth){
      this.getActiveProjects();
    }
  }

  // Gets the active projects of the user from firebase and saves them locally
  getActiveProjects = () => {
    console.log("GOING INTO ACTIVE PROJECTS");
    firebase.database().ref('users/' + this.props.userID + "/activeProjects").once('value', (snapshot) => {
      this.setState({
        activeProjects: snapshot.val()
      });
      console.log("...checking active projects");
    });
  }

  // Renders all active projects
  renderActiveProjects = () => {
    console.log(this.state);
    // If the user is not authenticated
    if(!this.state.isAuth){
      return ("");
    } else if(this.state.isAuth) {
      // Build each project
      console.log("Active Projects",this.state.activeProjects);
      let result = _.map(this.state.activeProjects, (projectID, index) => {
        var targetProject = this.state.allProjects[this.state.activeProjects[index]];
        return (
          <Row key={'activeProject-'+index}><Link to={'/projectfull/' + projectID}>{targetProject.name}</Link></Row>
        )
      });
      
      if(result.length > 0){
        return result;
      } else {
        return (
          <p>You haven't started any projects</p>
        )
      }
      
    }
    
  }

  render() {
    return (
      <div className="container">
        <h3>Active Projects</h3>
        {this.renderActiveProjects()}
        <h3>Browse new projects</h3>
        <Row className="center-align">
          <Col s={12} m={12} l={4}><Link to={{pathname: '/projects/', state: {professions: ['UX Designer','Visual Communication Designer']}}}>Design</Link></Col>
          <Col s={12} m={12} l={4}><Link to={{pathname: '/projects/', state:{professions: ['Software Developer']}}}>Software Development</Link></Col>
          <Col s={12} m={12} l={4}><Link to={{pathname: '/projects/', state:{professions: ['Project Manager ']}}}>Management</Link></Col>
        </Row>
        <Row className="center-align">
          <Col s={12} m={12} l={6}><Link to={{pathname: '/projects/', state:{professions: ['Marketing, Analyst']}}}>Marketing</Link></Col>
          <Col s={12} m={12} l={6}><Link to={{pathname: '/projects/', state:{professions: ['Security Analyst', 'System Administrator']}}}>Security</Link></Col>
        </Row>       
      </div>
    );
  }
}

export default Dashboard;
