/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import firebase from 'firebase';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import moment from 'moment';
import { Dialog, FlatButton } from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';



/* Home will be the landing page for the application. */

class Dashboard extends React.PureComponent {
  state = {
    open: false,
    userID: this.props.userID,
    isAuth: this.props.isAuth,
    activeProjects: null,
    removeProjID: '',
    removeProjName: '',
  };

  // This listens for when the new props change
  // ie: when firebase's promises send the new data
  componentWillReceiveProps = (newProps) => {
    this.setState({
      isAuth: newProps.isAuth,
      userID: newProps.userID,
    });
    this.getUserProjects();
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
      this.getUserProjects();
    }
  }

  handleOpen = (projectID, projectName) => {
    this.setState({open: true, removeProjID: projectID, removeProjName: projectName})
  };

  handleClose = () => {
    this.setState({open: false})
  };

  // Gets the active/completed projects of the user from firebase and saves them locally
  getUserProjects = () => {
    firebase.database().ref('users/' + this.props.userID + "/activeProjects").once('value', (snapshot) => {
      this.setState({
        activeProjects: snapshot.val()
      });
    });
    firebase.database().ref('users/' + this.props.userID + "/completedProjects").once('value', (snapshot) => {
      this.setState({
        completedProjects: snapshot.val()
      });
    });
  }

  //Removes active project from active list
  removeActiveProject = () => {
    let actProjects = this.state.activeProjects;
    _.remove(actProjects, (n) => {
      return n === this.state.removeProjID;
    });
    firebase.database().ref('users/' + this.props.userID).update({
      activeProjects: actProjects
    }).then(() => {
      this.setState({open: false})
      this.getUserProjects();
    }).catch((err) => {
      console.log(err);
    })
  }

  // Renders all active projects
  renderActiveProjects = () => {
    // If the user is not authenticated
    if(!this.state.isAuth){
      return ("");
    } else if(this.state.isAuth) {
      // Build each project
      let result = _.map(this.state.activeProjects, (projectID, index) => {
        var targetProject = this.state.allProjects[this.state.activeProjects[index]];
        let now = moment();
        let dueDate = moment(targetProject.due_date);
        let timeLeft;
        if(dueDate.diff(now, 'days') >= 0) {
          //Means they still have time
          timeLeft = <span style={{color: '#4CAF50'}}>{dueDate.diff(now, 'days')} days left for submission</span>
        } else {
          //Project is over due date.
          timeLeft = <span style={{color: '#C62828'}}>Project has stopped accepting submissions</span>
        }
        return (
          <li key={'activeProject-'+index}><Link to={'/projectfull/' + projectID}>{targetProject.name}</Link> - {timeLeft} | <span style={{cursor: 'pointer'}} onTouchTap={() => this.handleOpen(projectID, targetProject.name)}>Remove</span></li>
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

  renderCompletedProjects = () => {
    if(this.state.userID) {
      let result = _.map(this.state.completedProjects, (elem, index) => {
        return (
          <li key={'completedProject-'+index}><Link to={'/project/' + index}>{this.state.allProjects[index].name}</Link></li>
        )
      });
      if(result.length > 0) return result;
      else return <div>There are no completed projects</div>
    }
    else {
      return <div>User not authenticated</div>
    }
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Remove Project"
        primary={true}
        onTouchTap={this.removeActiveProject}
      />,
    ];
    return (
      <div className="container">
        <Row>
          <Col s={12}>
            <h2 style={{fontSize: '1.5rem'}}>Active Projects</h2>
            <ul>
              {this.renderActiveProjects()}
            </ul>
          </Col>
        </Row>
        <Row>
          <Col s={12}>
            <h2 style={{fontSize: '1.5rem'}}>Completed Projects</h2>
            <ul>
              {this.renderCompletedProjects()}
            </ul>
          </Col>
        </Row>
        <h2 style={{fontSize: '1.5rem'}}>Browse new projects</h2>
        <div className="selectInterestsSection">
        <Row className="center-align">
          <Col s={12} m={12} l={4}>
            <Link to={{pathname: '/projects/', state: {professions: ['UX Designer','Visual Communication Designer']}}}>
              <div className="interestTile">
              <i className="fa fa-paint-brush fa-2x" aria-hidden="true"></i><br/>Design
              </div>
            </Link>
          </Col>
          <Col s={12} m={12} l={4}>
            <Link to={{pathname: '/projects/', state: {professions: ['Software Developer']}}}>
              <div className="interestTile">
                <i className="fa fa-code" aria-hidden="true"></i><br/>Software Development
              </div>
            </Link>
          </Col>
          <Col s={12} m={12} l={4}>
            <Link to={{pathname: '/projects/', state: {professions: ['Project Manager']}}}>
              <div className="interestTile">
                <i className="fa fa-users" aria-hidden="true"></i><br/>Management
              </div>
            </Link>
          </Col>
        </Row>
        <Row className="center-align">
          <Col s={12} m={12} l={6}>
            <Link to={{pathname: '/projects/', state:{professions: ['Marketing, Analyst']}}}>
              <div className="interestTile">
                <i className="fa fa-bullhorn" aria-hidden="true"></i><br/>Marketing
              </div>
            </Link>
          </Col>
          <Col s={12} m={12} l={6}>
            <Link to={{pathname: '/projects/', state:{professions: ['Security Analyst', 'System Administrator']}}}>
              <div className="interestTile">
                <i className="fa fa-shield" aria-hidden="true"></i><br/>Security
              </div>
            </Link>
          </Col>
        </Row>
       <Link to="/projects/"><button className="secondaryButton">See All Projects</button></Link>
      </div>
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Dialog
          title="Confirm Project Deletion"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={() => {this.handleClose()}}
        >
          Are you sure you want to remove "{this.state.removeProjName}" from your active projects?
        </Dialog>
      </MuiThemeProvider>
      </div>
    );
  }
}

export default Dashboard;
