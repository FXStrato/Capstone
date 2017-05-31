/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import { Link } from 'react-router-dom';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import { TextField, RaisedButton, Dialog, FlatButton, CircularProgress, Checkbox, SelectField, MenuItem } from 'material-ui';
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
    surveyOpen: false,
    ack: false,
    giveCompanies: [],
    value: null,
    showSuccess: false
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

  componentDidMount = () => {
    window.scrollTo(0, 0);
    firebase.database().ref('/projects/' + this.props.match.params.projectID).once('value').then((snapshot) => {
        this.setState({project: snapshot.val()});
    });
    firebase.database().ref('/companies/').once('value').then((snapshot) => {
      this.setState({allCompanies: snapshot.val()})
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

  handleValueChange = (event, index, value) =>  {
    this.setState({value});
  }

  handleOpen = () => {
    this.setState({open: true})
  };

  handleSurveyOpen = () => {
    let urlRe = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;
    if(!this.state.submission_repo || urlRe.exec(this.state.submission_repo) === null) {
      this.setState({repoErrorText: 'Please enter a valid link'})
    } else {
      this.setState({surveyOpen: true})
    }
  };

  handleSurveyClose = () => {
    this.setState({surveyOpen: false})
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

  onCheck = (e, isChecked) => {
    if(isChecked) {
      if(_.indexOf(this.state.giveCompanies, e.target.name) === -1) {
        let temp = this.state.giveCompanies;
        temp.push(e.target.name);
        this.setState({giveCompanies: temp})
      }
    } else {
      let temp = this.state.giveCompanies;
      temp = _.remove(temp, (n) => {
        return n === e.target.name
      })
      this.setState({giveCompanies: temp})
    }
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
          comProjects['otherCompanies'] = this.state.giveCompanies;
          comProjects['expected_work'] = this.state.value;
          comProjects['hours_spent'] = this.state.time_spent;
          firebase.database().ref('users/' + this.state.userID + "/completedProjects/").update({
            [this.props.match.params.projectID]: comProjects
          }).then(() => {
            //Remove project from active projects, since it is now completed
            firebase.database().ref('users/' + this.state.userID + "/activeProjects").once('value', (snapshot) => {
              let temp = _.remove(snapshot.val(), this.props.match.params.projectID);
              firebase.database().ref('users/' + this.state.userID).update({
                activeProjects: temp
              }).then(() => {
                // After project is uploaded, show successful project page
                this.setState({open: false, showSuccess: true});
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
        label="Close Window"
        primary={true}
        onTouchTap={() => {this.handleClose()}}
      />,
    ];

    let companies = _.map(this.state.allCompanies, (elem, index) => {
      return (
        <MuiThemeProvider muiTheme={getMuiTheme()} key={'company-'+elem.name}>
          <Checkbox
            label={elem.name}
            name={elem.name}
            onCheck={this.onCheck}
          />
        </MuiThemeProvider>
      )
    })

    return (
      <div className="container">
        {Object.keys(this.state.project).length === 0 &&
          <div className="center-align" style={{marginTop: 20, marginBottom: 20}}>
            <MuiThemeProvider muiTheme={getMuiTheme()}>
              <CircularProgress/>
            </MuiThemeProvider>
          </div>
        }
        {!this.state.showSuccess ?
            <div>
              <Row className="center-align">
                <Col s={12}>
                  <h2 style={{fontSize: '2rem'}}>Submission for {this.state.project.name}</h2>
                  <p style={{fontSize: '1.3rem'}}>Finished with your project? Now it's time to submit it!</p>
                </Col>
              </Row>
              <Row>
                <Col s={12} m={6} l={8} offset={'m3, l2'} style={{marginBottom: 20}}>
                  <div style={{fontSize: '1.1rem', marginBottom: 10}}>What other companies would you like to be able to view your project?</div>
                  {companies}
                </Col>
                <Col s={12} m={6} l={8} offset={'m3, l2'}>
                  <div style={{marginBottom: -20, fontSize: '1.1rem'}}>What is the link to your code repository?</div>
                  <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <TextField fullWidth={true} name="submission_repo" errorText={this.state.repoErrorText} floatingLabelText="Link to Project (Github/Bitbucket)" onChange={(e) => {this.handleChange(e)}}/>
                  </MuiThemeProvider>
                </Col>

              </Row>
              <Row>
                <Col s={12} m={7} l={8} offset={'m3, l2'} className="center-align">
                  <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <Checkbox
                      label="I acknowledge that Frontier is not liable to legal action if user's intellectual property is improperly handled by the 3rd party employer."
                      onCheck={(e, isChecked) => this.setState({ack: isChecked})}
                    />
                  </MuiThemeProvider> <br/>
                  <small>Read more about intellectual property <span style={{color: '#039be5', cursor: 'pointer'}}  onTouchTap={this.handleOpen}>here</span></small>
                </Col>
              </Row>
              <Row>
                <Col s={12} m={7} l={8} offset={'m3, l2'}>
                  <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <RaisedButton fullWidth={true} disabled={!this.state.ack || !this.state.submission_repo ? true: false} onTouchTap={this.handleSurveyOpen} label="Continue"/>
                  </MuiThemeProvider>
                </Col>
              </Row>
          <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
            <Dialog
              title="Intellectual Property Rights"
              modal={false}
              actions={actions}
              open={this.state.open}
              onRequestClose={() => {this.handleClose()}}
              autoScrollBodyContent={true}
            >
              All submissions through Frontier will be subject to review before being submitted to companies. By submitting, you agree that Frontier will not suffer legal repercussions for 3rd party relinquishment of data. So long as a project remains, submissions for that project will be stored until the project is removed. 
            </Dialog>
          </MuiThemeProvider>
          <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
            <Dialog
              title="Almost there!"
              modal={false}
              open={this.state.surveyOpen}
              onRequestClose={this.handleSurveyClose}
            >
            <div className="center-align">
              <h2 style={{fontSize: '1.6rem'}}>Just one last step!</h2>
              <p>Before you submit your project, please fill out this 2 question survey. The information you provide is meant to improve your experience using Frontier.</p>
              <p style={{color: '#E53935'}}>This information will not be sent to the employer</p>
              <p>Please answer as truthfully as you can. Thank you!</p>
            </div>
            <Row>
              <Col s={12} className="center-align">
                <div>How long would you say it took you to complete the project?</div>
              </Col>
              <Col s={6} offset={'s3'}>
                <TextField name="time_spent" fullWidth={true} floatingLabelText="Number of hours spent" onChange={(e) => {this.handleChange(e)}}/>
              </Col>
              <Col s={12} className="center-align" style={{marginTop: 20}}>
                <div>Did the project require more or less work than you expected?</div>
              </Col>
              <Col s={6} offset={'s3'}>
                <SelectField
                  floatingLabelText="Actual work"
                  value={this.state.value}
                  onChange={this.handleValueChange}
                  fullWidth={true}
                >
                  <MenuItem value={0} primaryText="" />
                  <MenuItem value={"Much Less"} primaryText="Much Less" />
                  <MenuItem value={"Less"} primaryText="Less" />
                  <MenuItem value={"Just Right"} primaryText="Just Right" />
                  <MenuItem value={"More"} primaryText="More" />
                  <MenuItem value={"Much More"} primaryText="Much More" />
                </SelectField>
              </Col>
            </Row>
            <Row>
              <Col s={6} offset={'s3'}>
                <RaisedButton fullWidth={true} secondary={true} labelStyle={{color: '#fff'}} disabled={!this.state.value || !this.state.time_spent ? true: false} label="Finish" onTouchTap={this.handleSubmission}/>
              </Col>
              <Col s={12} className="center-align" style={{marginTop: 10}}>
                <div style={{fontSize: '0.9rem'}}>Once you hit finish your project will be officially submitted!</div>
              </Col>
            </Row>
            </Dialog>
          </MuiThemeProvider>
        </div>
        :
        <div>
          <Row>
            <Col s={12} className="center-align">
              <h2 style={{fontSize: '1.8rem'}}>You're all done!</h2>
              <div className="selectInterestsSection" style={{marginBottom: 0}}>
                <div className="interestTile">
                  <img src={process.env.PUBLIC_URL + '/img/DesignGuy.png'} alt="Design Guy"/><br/>
                </div>
              </div>
              <p>We'll keep you updated on your submission through the dashboard</p>
              <Link to="/dashboard"><MuiThemeProvider muiTheme={getMuiTheme()}><RaisedButton label="Back to Dashboard"/></MuiThemeProvider></Link>
            </Col>
          </Row>
        </div>
        }

      </div>
    );
  }
}

export default ProjectSubmission;
