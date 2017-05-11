/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import { TextField, RaisedButton, Dialog, FlatButton, CircularProgress, Snackbar } from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import firebase from 'firebase';
import _ from 'lodash';


/* Page handling project submissions */

class ProjectSubmission extends Component {
  state = {
    project: {},
    isAuth: this.props.isAuth,
    userID: this.props.userID,
    open: false,
    snackbarOpen: false,
    disableSubmit: false,
  }

  componentWillReceiveProps = (newProps) => {
    // This listens for when the new props change
    // ie: when firebase's promises send the new data
    if(this.state.isAuth !== newProps.isAuth) {
      this.setState({
        isAuth: newProps.isAuth,
        userID: newProps.userID,
      });
    }
  }

  componentWillMount = () => {
    window.scrollTo(0, 0);
    firebase.database().ref('/projects/' + this.props.match.params.projectID).once('value').then((snapshot) => {
        this.setState({project: snapshot.val()});
    });
  }

  handleChange(event) {
    var field = event.target.name;
    var value = event.target.value;
    var changes = {}; //object to hold changes
    changes[field] = value; //change this field
    this.setState(changes); //update state
    if(this.state.repoErrorText) this.setState({repoErrorText: ''})
  }

  handleOpen = () => {
    this.setState({open: true})
  };

  handleClose = () => {
    this.setState({open: false})
  };

  handleSnackbarClose = () => {
    this.setState({snackbarOpen: false})
    this.props.history.push('/dashboard');
  }

  handleSnackbarOpen = () => {
    this.setState({snackbarOpen: true})
  }

  handleSubmission = () => {
    let urlRe = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;
    if(!this.state.submission_repo || urlRe.exec(this.state.submission_repo) === null) {
      this.setState({repoErrorText: 'Please enter a valid link'})
    } else {
      firebase.database().ref('users/' + this.state.userID + "/completedProjects/" + this.props.match.params.projectID).once('value', (snapshot) => {
        var comProjects = snapshot.val();
        // Should be the case most of the time, null means they haven't completed it before, so add in the info.
        if(comProjects === null){
          comProjects = {};
          comProjects['repolink'] = this.state.submission_repo;
          comProjects['demo'] = this.state.submission_demo;
          comProjects['comments'] = this.state.submission_text;
          firebase.database().ref('users/' + this.state.userID + "/completedProjects/").update({
            [this.props.match.params.projectID]: comProjects
          }).then(() => {
            //Remove project from active projects, since it is now completed
            firebase.database().ref('users/' + this.state.userID + "/activeProjects").once('value', (snapshot) => {
              let temp = _.remove(snapshot.val(), this.props.match.params.projectID);
              firebase.database().ref('users/' + this.state.userID).update({
                activeProjects: temp
              }).then(() => {
                // After project is uploaded, sends user to the full specification of the page
                this.setState({snackbarOpen: true, open: false, disableSubmit: true});
              }).catch(() => {
                console.log('Unable to remove from active projects');
              });
            });
          });
        } else {
          // This case means the project already exists in completed (perhaps attempting to submit again). Throw error.
          alert('Submission already found in database');
        }
      });
    }
  }


  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={() => {this.handleClose()}}
      />,
      <FlatButton
        label="Confirm Submission"
        primary={true}
        onTouchTap={() => {this.handleSubmission()}}
      />,
    ];

    return (
      <div className="container">
        {Object.keys(this.state.project).length > 0 ?
          <div>
            <Row>
              <Col s={12}>
                <h2 style={{fontSize: '2rem'}}>Submission for {this.state.project.name}</h2>
                <p style={{fontSize: '1.3rem'}}>Finished with your project? Now it's time to submit it!</p>
              </Col>
            </Row>
            <Row>
              <Col s={12} m={7} l={8}>
                <div style={{marginBottom: -10, fontSize: '1.1rem'}}>What is the link to your code repository?*</div>
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                  <TextField fullWidth={true} name="submission_repo" errorText={this.state.repoErrorText} floatingLabelText="Link to Project (Github/Bitbucket)" onChange={(e) => {this.handleChange(e)}}/>
                </MuiThemeProvider>
              </Col>
              <Col s={12} m={7} l={8}>
                <div style={{marginTop: 20, marginBottom: -10, fontSize: '1.1rem'}}>Do you have an online demo or prototype?</div>
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                  <TextField fullWidth={true} name="submission_demo" floatingLabelText="Link to prototype" onChange={(e) => {this.handleChange(e)}}/>
                </MuiThemeProvider>
              </Col>
              <Col s={12} m={7} l={8}>
                <div style={{marginTop: 20, marginBottom: -10, fontSize: '1.1rem'}}>What were your thoughts about this project? Was it challenging? Was there something that could have been better?</div>
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                  <TextField fullWidth={true} name="submission_text" multiLine={true} rowsMax={5} floatingLabelText="Type response here" onChange={(e) => {this.handleChange(e)}}/>
                </MuiThemeProvider>
                <p>* Response is required</p>
              </Col>
            </Row>
            <Row>
              <Col s={12} m={7} l={8} className="center-align">
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                  <RaisedButton fullWidth={true} disabled={this.state.disableSubmit} onTouchTap={this.handleOpen} label="Submit Project"/>
                </MuiThemeProvider>
              </Col>
            </Row>
          </div>
          :
          <div className="center-align" style={{marginTop: 20, marginBottom: 20}}>
            <MuiThemeProvider muiTheme={getMuiTheme()}>
              <CircularProgress/>
            </MuiThemeProvider>
          </div>
        }
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <Dialog
            title={this.state.project.name}
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={() => {this.handleClose()}}
          >
          Make sure all your information is correct before submitting! If so, go ahead and click Confirm Submission, and give yourself a high five. You deserve it!
          </Dialog>
        </MuiThemeProvider>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <Snackbar
          open={this.state.snackbarOpen}
          message={'Project - ' + this.state.project.name + ' successfully completed!'}
          autoHideDuration={3000}
          onRequestClose={this.handleSnackbarClose}
          />
        </MuiThemeProvider>
      </div>
    );
  }
}

export default ProjectSubmission;
