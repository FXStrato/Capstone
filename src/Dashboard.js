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
    this.getActiveProjects();
  }

  // Gets the active projects of the user from firebase and saves them locally
  getActiveProjects = () => {
    firebase.database().ref('users/' + this.props.userID + "/activeProjects").once('value', (snapshot) => {
      this.setState({
        activeProjects: snapshot.val()
      });
    });
  }

  // Renders all active projects
  renderActiveProjects = () => {
    console.log(this.state);
    // If the user is not authenticated
    if(this.state.isAuth == false){
      return ("");
    } else if(this.state.isAuth == true) {
      // Build each project
      let result = _.map(this.state.activeProjects, (projectID, index) => {
        var targetProject = this.state.allProjects[this.state.activeProjects[index]];
        return (
          <Row key={'activeProject-'+index}><Link to={'/projectfull/' + projectID}>{targetProject.name}</Link></Row>
        )
      });
      console.log(this.state.activeProjects);
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
      </div>
    );
  }
}

export default Dashboard;
