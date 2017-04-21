/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import firebase from 'firebase';
import _ from 'lodash';

/* Search Projects using fuzzy search through project tags*/

class SearchProjects extends Component {
  state = {

  }

  componentDidMount = () => {
    //Pull all projects from firebase, and store in state.
    firebase.database().ref('/projects/').once('value').then((snapshot) => {
      this.setState({allProjects: snapshot.val()})
    });
    firebase.database().ref('/companies/').once('value').then((snapshot) => {
      this.setState({allCompanies: snapshot.val()})
    });
  }

  //Function will get the necessary data from allProjects and generate a display for it
  renderProjects = () => {
    if(this.state.allProjects && this.state.allCompanies) {
      //Each project should display the name, one_liner, posting_company, estimated_duration, and tags
      let result = _.map(this.state.allProjects, (elem, index) => {
        let company = this.state.allCompanies[elem.posting_company].name;
        let tags = _.map(elem.tags, (elem2, index2) => {
          return (
            <div key={'project_'+index+'_'+index2} className="chip">{elem2}</div>
          )
        })
        return (
          <Col key={'project_'+index} s={12}>
            <p>{elem.name} : {elem.one_liner}</p>
            <ul>
              <li>Posting Company: {company}</li>
              <li>Estimated Duration: {elem.estimated_duration}</li>
              <li>Tags: {tags}</li>
            </ul>
          </Col>
        )
      });
      return result;
    } else {
      return <div>Projects have not loaded</div>
    }
  }



  render() {
    return (
      <div className="container">
        <Row>
          <Col s={12}>
            <p>This is the Search Projects Page</p>
          </Col>
        </Row>
        <Row>
          {this.renderProjects()}
        </Row>
      </div>
    );
  }
}

export default SearchProjects;
