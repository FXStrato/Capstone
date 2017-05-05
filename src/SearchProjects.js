/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import { Link } from 'react-router-dom';
import { TextField, RaisedButton, Checkbox } from 'material-ui';
import firebase from 'firebase';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import _ from 'lodash';

/* Search Projects using substring matching through project tags*/

class SearchProjects extends Component {
  state = {
    search: '',
    searchTerm: '',
    durations: '',
    professions: '',
    filters: {},
  }

  componentDidMount = () => {
    if(this.props.location.state !== undefined) {
      let temp = {};
      temp['profession_type'] = this.props.location.state.professions;
      this.setState({filters: temp});
    }
    // let search = this.props.location.search; // could be '?foo=bar'
    // let params = new URLSearchParams(search);
    // let filterResults = params.get('_filter');
    // console.log(filterResults);
    //Pull all projects from firebase, and store in state.
    firebase.database().ref('/projects/').once('value').then((snapshot) => {
      this.setState({allProjects: snapshot.val()})
      let durations = [];
      let professions = [];
      //Obtain all the necessary data from each project, getting the unique ones
      for(let project in snapshot.val()) {
        if(_.indexOf(durations, snapshot.val()[project].estimated_duration) === -1) {
          durations.push(snapshot.val()[project].estimated_duration);
        }
        if(_.indexOf(professions, snapshot.val()[project].profession_type) === -1) {
          professions.push(snapshot.val()[project].profession_type);
        }
      }
      this.setState({durations: durations, professions: professions});
    });
    firebase.database().ref('/companies/').once('value').then((snapshot) => {
      this.setState({allCompanies: snapshot.val()})
    });
  }

  //Since multiple check boxes can be selected
  handleFilter = (name, isChecked, type) => {
    let temp = this.state.filters;
    //If isChecked is true, add it to array. Otherwise, remove it.
    if(isChecked) {
      //If filter doesn't already exist in list and ischecked is true, add it to filter list
      if(_.indexOf(temp[type], name) === -1){
        if(!temp[type]) temp[type] = [];
        temp[type].push(name);
      }
    } else {
      //If isChecked is false, remove it from filter list
      if(_.indexOf(temp[type], name) !== -1) {
        temp[type] = _.remove(temp[type], (n) => {
          return n !== name
        });
        if(temp[type].length < 1) delete temp[type];
      }
    }
    this.setState({filters: temp});
  }

  handleChange(event) {
    var field = event.target.name;
    var value = event.target.value;
    if(!event.target.value && this.state.search) {
      //Means we just cleared the search by tag/title
      this.setState({searchTerm: ''});
    }
    var changes = {}; //object to hold changes
    changes[field] = value; //change this field
    this.setState(changes); //update state
    this.setState({errorText: ''});
  }

  passSearch = (event) => {
    event.preventDefault();
    //if(this.state.search !== this.state.searchTerm) this.props.history.push('/projects/' + this.state.search);
    this.setState({searchTerm: this.state.search});
  }

  renderFilteredDurations = () => {
    let result;
    if(this.state.durations) {
      result = _.map(this.state.durations, (elem, index) => {
        return (
          <MuiThemeProvider muiTheme={getMuiTheme()} key={'filterDuration-'+index}>
            <Checkbox onCheck={(e, isChecked) => {this.handleFilter(elem, isChecked, 'estimated_duration')}} name={elem} label={elem} labelStyle={{fontSize: '1rem'}}/>
          </MuiThemeProvider>
        )
      })
      return result;
    }
    return <div>No filters for duration</div>
  }

  renderFilteredProfessions = () => {
    let professions = [];
    let result;
    if(this.state.professions) {
      result = _.map(this.state.professions, (elem, index) => {
        return (
          <MuiThemeProvider muiTheme={getMuiTheme()} key={'filterProfession-'+index}>
            <Checkbox defaultChecked={_.indexOf(this.state.filters['profession_type'], elem) === -1 ? false : true} onCheck={(e, isChecked) => {this.handleFilter(elem, isChecked, 'profession_type')}} name={elem} label={elem} labelStyle={{fontSize: '1rem'}}/>
          </MuiThemeProvider>
        )
      })
      return result;
    }
    return <div>No filters for professions</div>
  }



  //Function will get the necessary data from allProjects and generate a display for it
  renderProjects = () => {
    if(this.state.allProjects && this.state.allCompanies) {
      let projectList = [];
      for(let project in this.state.allProjects) {
        let canAdd = true;
        let temp = this.state.allProjects[project];
        if(!_.isEmpty(this.state.filters)) {
          for(let type in this.state.filters) {
            //Inside each filter, we can pull projects that satisfy it. But when we move to another filter, we then have to filter the projectsList again.
            if(_.indexOf(this.state.filters[type], temp[type]) === -1) {
              //If ever filter comes back false, then we can't add the project.
              canAdd = false;
            }
          }
        }
        if(this.state.searchTerm) {
          //Prob have some kind of regex here to ensure that we aren't getting something stupid from user, like / or space or some other weird characters
          //Otherwise, search by tag and also project title
          let foundMatch = false;
          for(let i = 0; i < temp.tags.length; i++) {
            if(_.includes(temp.tags[i].toLowerCase(), this.state.searchTerm.toLowerCase())) foundMatch = true;
          }

          if(_.includes(temp.name.toLowerCase(), this.state.searchTerm.toLowerCase())) foundMatch = true;
          if(!foundMatch) canAdd = false;
        }
        if(canAdd) {
          temp.projectID = project;
          projectList.push(temp);
        }
      }
      //Each project should display the name, one_liner, posting_company, estimated_duration, and tags
      let result = _.map(projectList, (elem, index) => {
        let company = this.state.allCompanies[elem.posting_company].name;
        let tags = _.map(elem.tags, (elem2, index2) => {
          return (
            <div key={'project_'+index+'_'+index2} className="chip">{elem2}</div>
          )
        });
        return (
          <div key={'project_'+index}>
            <Link to={'/project/' + elem.projectID}>{elem.name} : {elem.one_liner}</Link>
              <ul>
                <li>Posting Company: {company}</li>
                <li>Estimated Duration: {elem.estimated_duration}</li>
                <li>Profession: {elem.profession_type}</li>
                <li>Tags: {tags}</li>
              </ul>
          </div>
        )
      });
      console.log(this.state.filters);
      if(result.length > 0) return result;
      else if(this.state.searchTerm) return <div>"{this.state.searchTerm}" did not match any results</div>;
      else return <div></div>;
      // this.setState({renderedProjects: result})
    } else {
        return <div></div>;
        // this.setState({renderedProjects: <div>Projects have not loaded</div>})
    }
  }



  render() {
    return (
      <div className="container">
        <Row>
          <Col s={12}>
            <h1 style={{fontSize: '2.5rem'}}>Browse Projects</h1>
            <hr/>
          </Col>
        </Row>
        <Row>
          <Col s={12} m={3} l={2}>
            <h2 style={{fontSize: '1.5rem', marginTop: 0}}>Filter By</h2>
            <h3 style={{fontSize: '1.2rem'}}>Duration</h3>
            {this.renderFilteredDurations()}
            <h3 style={{fontSize: '1.2rem'}}>Profession</h3>
            {this.renderFilteredProfessions()}
            <form onSubmit={(e) => {this.passSearch(e)}}>
              <MuiThemeProvider muiTheme={getMuiTheme()}>
                <TextField fullWidth={true} floatingLabelText="Tag/Name Search" name="search" onChange={(e) => {this.handleChange(e)}} />
              </MuiThemeProvider>
              <MuiThemeProvider muiTheme={getMuiTheme()}>
                <RaisedButton style={{marginBottom: 30}} fullWidth={true} type="submit" label="Search" />
              </MuiThemeProvider>
            </form>
          </Col>
            <hr style={{marginBottom: 30}} className="hide-on-med-and-up"/>
            <Col s={12} m={9} l={10}>
              <h2 style={{fontSize: '2rem', marginTop: -6}}>Results</h2>
              {this.renderProjects()}
            </Col>
        </Row>
      </div>
    );
  }
}

export default SearchProjects;
