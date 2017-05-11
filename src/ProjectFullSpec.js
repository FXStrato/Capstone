/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import { Redirect } from 'react-router-dom';
import {RaisedButton} from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import firebase from 'firebase';
import _ from 'lodash';


/*This page will display the full spec of the passed in project */

//TODO: Don't forget to add loading icon

class ProjectFullSpec extends Component {
  state = {
    project: {},
    projID: this.props.match.params.projectID,
    isAuth: this.props.isAuth,
    userID: this.props.userID,
    isLoading: true,
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
    //this.props.history.push('/project/'+this.props.match.params.projectID);
    firebase.database().ref('/projects/' + this.props.match.params.projectID).once('value').then((snapshot) => {
      let project = snapshot.val();
      if(project) {
        let newTags = _.map(project.tags, (elem, index) => {
          return <div key={'tag-'+index} className="chip">{elem}</div>
        })

        //Additional Resources
        let addResources = _.map(project.additional_resources, (elem,index) => {
          return <li key={'addResource-'+index}>{elem}</li>
        });

        //TODO: Consider making sub requirements url links purely, so we can just have them link to specific things, and have a title for each link.
        let subRequirements = _.map(project.submission_requirements, (elem,index) => {
          return <li key={'submission_requirement-'+index}>{elem}</li>
        })

        project.additional_resources = addResources; //Set array to React HTML
        project.submission_requirements = subRequirements;
        project.tags = newTags;

        firebase.database().ref('/companies/').once('value').then((snapshot) => {
          let supportResults = _.map(project.supporting_companies, (elem, index) => {
            return <span key={'supportingCompany-'+index} style={{marginRight: 10}}>{snapshot.val()[elem]['name']}</span>;
          });
          project.posting_company = snapshot.val()[project.posting_company]['name'];
          project.supporting_companies = supportResults;
          this.setState({project: project});
        });
      }
    });
  }

  render() {

    //Render the submission requirements here. Also, include some of the previous project stuff. We also need to add routing to Project.js, if they have it in active projects, just go to fullspec.

    return (
      <div className="container">
        {Object.keys(this.state.project).length > 0 ?
          <div>
            <Row>
              <Col s={12}>
                <h1 style={{fontSize: '3.0rem'}}>Project Specifications</h1>
                <h2 style={{fontSize: '2.0rem'}}>{this.state.project.name}</h2>
                <div style={{fontSize: '1.2rem'}}>Company: {this.state.project.posting_company} | Due Date: {this.state.project.due_date}</div>
                <p>{this.state.project.short_description}</p>
              </Col>
              <Col s={12}>
                <h2 style={{fontSize: '1.5rem'}}>Submission Requirements</h2>
                <ul className="browser-default">
                  {this.state.project.submission_requirements}
                </ul>
              </Col>
              <Col s={12}>
                <h2 style={{fontSize: '1.5rem'}}>Additional Resources</h2>
                <ul className="browser-default">
                  {this.state.project.additional_resources}
                </ul>
              </Col>
            </Row>
            <Row>
              <Col s={12}>
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                  <RaisedButton fullWidth={true} onTouchTap={() => {this.props.history.push('/submit/' + this.state.projID);}} label="Submit Project" />
                </MuiThemeProvider>
              </Col>
            </Row>
          </div>
          :
          <div>Project does not exist, or you are not authorized to view this project's full spec</div>
        }
      </div>
    );
  }
}

export default ProjectFullSpec;
