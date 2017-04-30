/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import {Row, Col} from 'react-materialize';
import { withRouter } from 'react-router-dom';
import { RaisedButton, Dialog, FlatButton, TextField } from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import firebase from 'firebase';
import SignUpForm from './signupForm';
import _ from 'lodash';
import Loading from './loading.js'

/* Page displaying the specific details of each project */

class Project extends Component {
  state = {
    open: false,
    project: {},
    projID: this.props.match.params.projectID,
    isAuth: this.props.isAuth,
    userID: this.props.userID,
    showLoading: false,
  }

//Temp: -Kh4diidw7jpXDbKz-go
/*Add check to see if user is logged in, and if project ID is under user, display full spec, and submit project.*/

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
      let project = snapshot.val();

      let newTags = _.map(project.tags, (elem, index) => {
        return <div key={'tag-'+index} className="chip">{elem}</div>
      })

      //Additional Resources
      let addResources = _.map(project.additional_resources, (elem,index) => {
        return <li key={'addResource-'+index}>{elem}</li>
      });

      project.additional_resources = addResources; //Set array to React HTML
      project.tags = newTags;

      firebase.database().ref('/companies/').once('value').then((snapshot) => {
        let supportResults = _.map(project.supporting_companies, (elem, index) => {
          return <span key={'supportingCompany-'+index} style={{marginRight: 10}}>{snapshot.val()[elem]['name']}</span>;
        });
        project.posting_company = snapshot.val()[project.posting_company]['name'];
        project.supporting_companies = supportResults;
        this.setState({project: project});
      });

      firebase.database().ref('/professions/').once('value').then((snapshot) => {
        project.profession_type = snapshot.val()[project.profession_type];
        this.setState({project: project});
      });
    });
  }

  addProjectToUser = () => {
    this.setState({
      showLoading : true
    });
    firebase.database().ref('users/' + this.state.userID + "/activeProjects").once('value', (snapshot) => {
      var actProjects = snapshot.val();
      // If this is the first project that the user is adding to their list
      if(actProjects == null){
        actProjects = [];
        actProjects[0] = this.state.projID;
      } else {
        // Checks if the project ID is already in the user's list of active projects
        if(actProjects.indexOf(this.state.projID) < 0){
          actProjects.push(this.state.projID);
        }
      }
      // Updates firebase with new project
      firebase.database().ref('users/' + this.state.userID).update({
        activeProjects: actProjects
      }).then(() => {
        // After project is uploaded, sends user to the full specification of the page
        this.props.history.push('/projectfull/' + this.state.projID);
      });

    });
    
  }



  handleOpen = () => {
    this.setState({open: true})
  };

  handleClose = () => {
    this.setState({open: false})
  };


  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={() => {this.handleClose()}}
      />,
      <FlatButton
        label="Begin Project"
        primary={true}
        onTouchTap={() => {this.addProjectToUser()}}
      />,
    ];
    const nonlogactions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={() => {this.handleClose()}}
      />,
    ];
    return (
      <section id="projectPage">
        {this.state.showLoading ? <Loading /> : ""}
        <div className="container">
          <Row>
            <Col s={12} m={12} l={8}>
              <h2 className="projectTitle">{this.state.project.name}</h2>
              <h4 className="oneLiner">
                {this.state.project.one_liner}
              </h4>
              <Row>
                <Col s={4}>
                  <p>{this.state.project.profession_type}</p>
                </Col>
                <Col s={4}>
                  <p>Posted: {this.state.project.posting_date}</p>
                </Col>
                <Col s={4}>
                  <p>Submission Due: {this.state.project.due_date}</p>
                </Col>
              </Row>
              <p>{this.state.project.short_description}</p>
              <br/>
              <div>
                <ul>
                  Additional Resources:
                  {this.state.project.additional_resources}
                </ul>
              </div>
              <div>
                Tags:
                {this.state.project.tags}
              </div>
            </Col>
            <Col s={12} m={12} l={4}>
              <div className="card">
                <div className="card-image">
                  <img src={this.state.project.cover_image_link} alt={this.state.project.name + ' Banner'} className="responsive-img"/>
                </div>
                <div className="card-content">
                  <div>Posting Company: <b>{this.state.project.posting_company}</b></div>
                  <div style={{paddingBottom: "15px"}}>Supporting Companies: <b>{this.state.project.supporting_companies}</b></div>
                  <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <RaisedButton secondary={true} fullWidth={true} onTouchTap={() => {this.handleOpen('fullOpen')}} label="Begin Project" />
                  </MuiThemeProvider>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <Dialog
            title={this.state.isAuth ? "Begin " + this.state.project.name: "Sign up to begin " + this.state.project.name}
            actions={this.state.isAuth ? actions : nonlogactions}
            modal={false}
            open={this.state.open}
            onRequestClose={() => {this.handleClose()}}
          >
            {this.state.isAuth ?
              'Would you like to begin this project?'
            :
              <div>
                It seems like you haven't logged in yet. Login now <br/>
                <SignUpForm/>
              </div>
            }
          </Dialog>
        </MuiThemeProvider>
      </section>
    );
  }
}


export default withRouter(Project);
