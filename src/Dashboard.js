/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import firebase from 'firebase';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import moment from 'moment';
import { TextField, RaisedButton, Checkbox, Dialog, FlatButton, Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Interests from './Interests';



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
    window.scrollTo(0,0);
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
           <Col key={'activeProjects-'+index} s={12} m={4}>
            <p>{timeLeft} | <span style={{cursor: 'pointer'}} onTouchTap={() => this.handleOpen(projectID, targetProject.name)}>Remove</span></p>
            <Link target="_blank" key={'project-'+index} to={'/project/' + projectID}>
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <Card className="projectCard">
                      <CardMedia style={{backgroundColor:"#2F9CAA"}}>
                        {this.getBackgroundImg(targetProject.cover_image_link)}
                      </CardMedia>
                    <CardText className="">
                      <p>How might you...</p>
                      <h3>{targetProject.name}</h3>
                      <p>{targetProject.profession_type + " | " + targetProject.difficulty}</p>
                      <p>{targetProject.one_liner}</p>
                    </CardText>
                  </Card>
                </MuiThemeProvider>
            </Link>
          </Col>
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

  getBackgroundImg = (imgLink) => {
    let imgCSS = "url(" + imgLink + ") center center / cover no-repeat";
    return (
      <div className="projectPhoto" style={{backgroundColor: "#2F9CAA",background:imgCSS, backgroundSize: "cover"}}></div>
    );
  }

  renderCompletedProjects = () => {
    if(this.state.userID && this.state.allProjects) {
      let result = _.map(this.state.completedProjects, (elem, index) => {
        let targetProject = this.state.allProjects[index];
        return (
          <Col key={'completedProjects-'+index} s={12} m={4}>
            <p style={{color: '#4CAF50'}}>Status: Project is being reviewed by employers</p>
            <Link target="_blank" to={'/project/' + index}>
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <Card className="projectCard">
                      <CardMedia style={{backgroundColor:"#2F9CAA"}}>
                        {this.getBackgroundImg(targetProject.cover_image_link)}
                      </CardMedia>
                    <CardText className="">
                      <p>How might you...</p>
                      <h3>{targetProject.name}</h3>
                      <p>{targetProject.profession_type + " | " + targetProject.difficulty}</p>
                      <p>{targetProject.one_liner}</p>
                    </CardText>
                  </Card>
                </MuiThemeProvider>
            </Link>
          </Col>
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
      <div className="container dashboardSection">
        <Row>
          <Col s={12}>
            <h2 style={{fontSize: '1.5rem'}}>Active Projects</h2>
            <Row>
              {this.renderActiveProjects()}
            </Row>
          </Col>
        </Row>
        <Row>
          <Col s={12}>
            <h2 style={{fontSize: '1.5rem'}}>Completed Projects</h2>
            <Row>
              {this.renderCompletedProjects()}
            </Row>
          </Col>
        </Row>
        <h2 style={{fontSize: '1.5rem'}}>Browse new projects</h2>
        <Interests></Interests>
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
