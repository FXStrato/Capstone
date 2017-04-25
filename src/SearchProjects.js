/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import { Link } from 'react-router-dom';
import { TextField, RaisedButton } from 'material-ui';
import firebase from 'firebase';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import _ from 'lodash';

/* Search Projects using substring matching through project tags*/

class SearchProjects extends Component {
  state = {
    search: '',
    searchTerm: this.props.match.params.searchTerm,
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

  handleChange(event) {
      var field = event.target.name;
      var value = event.target.value;
      var changes = {}; //object to hold changes
      changes[field] = value; //change this field
      this.setState(changes); //update state
      this.setState({errorText: ''});
  }

  passSearch = (event) => {
    event.preventDefault();
    if(this.state.search !== this.state.searchTerm) this.props.history.push('/projects/' + this.state.search);
    this.setState({searchTerm: this.state.search});
  }

  //Function will get the necessary data from allProjects and generate a display for it
  renderProjects = () => {
    if(this.state.allProjects && this.state.allCompanies) {
      let projectList = [];
      if(this.state.searchTerm) {
        //Means we are searching. Pull all projects with that set of characters in tags, case insensitive, and then pass that in to result to generate.
        for(let project in this.state.allProjects) {
          let temp = this.state.allProjects[project];
          for(let i = 0; i < temp.tags.length; i++) {
            if(temp.tags[i].toLowerCase().includes(this.state.searchTerm.toLowerCase())) {
              temp.projectID = project;
              projectList.push(temp);
            }
          }
        }
      }
      //Each project should display the name, one_liner, posting_company, estimated_duration, and tags
      let result = _.map(projectList, (elem, index) => {
        let company = this.state.allCompanies[elem.posting_company].name;
        let tags = _.map(elem.tags, (elem2, index2) => {
          return (
            <div key={'project_'+index+'_'+index2} className="chip">{elem2.toLowerCase().includes(this.state.searchTerm.toLowerCase()) ? <span style={{backgroundColor: 'yellow'}}>{elem2}</span> : elem2}</div>
          )
        });
        return (
          <Col key={'project_'+index} s={12}>
            <Link to={'/project/' + elem.projectID}><p>{elem.name} : {elem.one_liner}</p></Link>
              <ul>
                <li>Posting Company: {company}</li>
                <li>Estimated Duration: {elem.estimated_duration}</li>
                <li>Tags: {tags}</li>
              </ul>
          </Col>
        )
      });
      if(result.length > 0) return result;
      else if(this.state.searchTerm) return <div>"{this.state.searchTerm}" did not bring any results</div>;
      else return <div></div>;
      // this.setState({renderedProjects: result})
    } else {
        return <div>Projects not loaded</div>;
        // this.setState({renderedProjects: <div>Projects have not loaded</div>})
    }
  }



  render() {
    return (
      <div className="container">
        <Row>
          <Col s={12}>
            <p>This is the Search Projects Page</p>
            <form onSubmit={(e) => {this.passSearch(e)}}>
              <MuiThemeProvider muiTheme={getMuiTheme()}>
                <TextField floatingLabelText="Search by Keyword or Tag" name="search" onChange={(e) => {this.handleChange(e)}} />
              </MuiThemeProvider>
              <MuiThemeProvider muiTheme={getMuiTheme()}>
                <RaisedButton type="submit" label="Search Projects" />
              </MuiThemeProvider>
            </form>
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
