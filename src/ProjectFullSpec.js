/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import { Redirect } from 'react-router-dom';
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
    if(!this.props.isAuth) this.props.history.push('/project/'+this.props.match.params.projectID)
    window.scrollTo(0, 0);
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
      }
    });
  }

  render() {
    return (
      <div className="container">
        <Row>
          <Col s={12}>
            This is the Full Spec Project Page
            <p>{this.props.isAuth ? "I'm True" : "I'm False"}</p>
            <p>Testing project submission requirements: {this.state.project.submission_requirements}</p>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ProjectFullSpec;
