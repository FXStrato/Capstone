/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import { Link } from 'react-router-dom';
import { TextField, RaisedButton, Checkbox, Dialog, FlatButton, Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui';
import firebase from 'firebase';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import _ from 'lodash';

/* Search Projects using substring matching through project tags*/

class SearchProjects extends Component {
  state = {
    search: '',
    searchTerm: this.props.param || '',
    open: false,
    selectDifficulty: '',
    selectProfession: '',
    selectCompany: '',
    dialogChoice: '',
    onboardDifficulties: this.props.onboardDifficulties,
    onboardProfessions: this.props.onboardProfessions,
    onboardCompanies: this.props.onboardCompanies,
    allDifficulties: this.props.allDifficulties,
    allProfessions: this.props.allProfessions,
    allCompanies: this.props.allCompanies,
    allProjects: this.props.allProjects,
    filters: {},
    filterButton: 'Hide Filters'
  }

  componentDidMount = () => {
    window.scrollTo(0,0);
    if(this.state.onboardDifficulties.length > 0) {
      let temp = this.state.onboardDifficulties[0] || '';
      for(let i = 1; i < this.state.onboardDifficulties.length; i++) {
        temp += ', ' + this.state.onboardDifficulties[i];
      }
      let filterTemp = this.state.filters;
      filterTemp['difficulty'] = this.state.onboardDifficulties;
      this.setState({selectDifficulty: temp, filters: filterTemp})
    }
    if(this.state.onboardProfessions.length > 0) {
      let temp = this.state.onboardProfessions[0] || '';
      for(let i = 1; i < this.state.onboardProfessions.length; i++) {
        temp += ', ' + this.state.onboardProfessions[i];
      }
      let filterTemp = this.state.filters;
      filterTemp['profession_type'] = this.state.onboardProfessions;
      this.setState({selectProfession: temp, filters: filterTemp})
    }
    if(this.state.onboardCompanies.length > 0) {
      let temp = this.state.allCompanies[this.state.onboardCompanies[0]].name || '';
      for(let i = 1; i < this.state.onboardCompanies.length; i++) {
        temp += ', ' + this.state.allCompanies[this.state.onboardCompanies[i]].name;
      }
      let filterTemp = this.state.filters;
      filterTemp['posting_company'] = this.state.onboardCompanies;
      this.setState({selectCompany: temp, filters: filterTemp})
    }
    if(!this.state.allProjects || !this.state.allCompanies) {
      firebase.database().ref('/projects/').once('value').then((snapshot) => {
        this.setState({allProjects: snapshot.val()})
        let difficulties = [];
        let professions = [];
        //Obtain all the necessary data from each project, getting the unique ones
        for(let project in snapshot.val()) {
          if(_.indexOf(difficulties, snapshot.val()[project].difficulty) === -1) {
            difficulties.push(snapshot.val()[project].difficulty);
          }
          if(_.indexOf(professions, snapshot.val()[project].profession_type) === -1) {
            professions.push(snapshot.val()[project].profession_type);
          }
        }
        this.setState({difficulties: difficulties, professions: professions});
      });
      firebase.database().ref('/companies/').once('value').then((snapshot) => {
        this.setState({allCompanies: snapshot.val()})
      });
    }
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

  //Difficulties should be sorted using a parameter in firebase, easier to manage that way.
  handleDifficulties = (difficulty) => {
    let result;
    if(_.indexOf(this.state.onboardDifficulties, difficulty) === -1) {
      //Means that it doesn't currently exist, add it in
      result = this.state.onboardDifficulties.concat(difficulty);
      this.setState({onboardDifficulties: result})
    } else {
      result = _.remove(this.state.onboardDifficulties, (n) => {
        return n !== difficulty;
      })
      this.setState({onboardDifficulties: result});
    }
    let filterTemp = this.state.filters;
    if(result.length === 0) {
      delete filterTemp['difficulty'];
    } else {
      filterTemp['difficulty'] = result;
    }
    let temp = result[0] || '';
    for(let i = 1; i < result.length; i++) {
      temp += ', ' + result[i];
    }
    this.setState({selectDifficulty: temp, filters: filterTemp});
  }

  handleProfessions = (profession) => {
    let result;
    if(_.indexOf(this.state.onboardProfessions, profession) === -1) {
      //Means that it doesn't currently exist, add it in
      result = this.state.onboardProfessions.concat(profession);
      this.setState({onboardProfessions: result})
    } else {
      result = _.remove(this.state.onboardProfessions, (n) => {
        return n !== profession;
      })
      this.setState({onboardProfessions: result});
    }
    let filterTemp = this.state.filters;
    if(result.length === 0) {
      delete filterTemp['profession_type'];
    } else {
      filterTemp['profession_type'] = result;
    }
    let temp = result[0] || '';
    for(let i = 1; i < result.length; i++) {
      temp += ', ' + result[i];
    }
    this.setState({selectProfession: temp, filters: filterTemp})
  }

  handleCompanies = (company) => {
    let result;
    if(_.indexOf(this.state.onboardCompanies, company) === -1) {
      //Means that it doesn't currently exist, add it in
      result = this.state.onboardCompanies.concat(company);
      this.setState({onboardCompanies: result})
    } else {
      result = _.remove(this.state.onboardCompanies, (n) => {
        return n !== company;
      })
      this.setState({onboardCompanies: result});
    }
    let filterTemp = this.state.filters;
    if(result.length === 0) {
      delete filterTemp['posting_company'];
    } else {
      filterTemp['posting_company'] = result;
    }
    let temp;
    if(result.length > 0) {
      if(result[0].charAt(0) === '-') temp = this.state.allCompanies[result[0]].name
      else temp = result[0];
      for(let i = 1; i < result.length; i++) {
        if(result[i].charAt(0) === '-') temp += ', ' + this.state.allCompanies[result[i]].name;
        else temp += ', ' + result[i];
      }
    } else {
      temp = '';
    }

    this.setState({selectCompany: temp, filters: filterTemp})
  }
  //helper function
  capFirst = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
        console.log(elem);
        let company = this.state.allCompanies[elem.posting_company].name;
        let tags = _.map(elem.tags, (elem2, index2) => {
          return (
            <div key={'project_'+index+'_'+index2} className="chip">{elem2}</div>
          )
        });
        return (
          <Link target="_blank" key={'project-'+index} to={'/project/' + elem.projectID}>
            <Col s={12} m={6} style={{marginBottom: 20}}>
              <MuiThemeProvider muiTheme={getMuiTheme()}>
                  <Card className="projectCard">
                    <CardMedia style={{backgroundColor:"#2F9CAA"}}>
                      {this.getBackgroundImg(elem.cover_image_link)}
                    </CardMedia>
                   <CardText className="">
                     <p>How might you...</p>
                     <h3>{elem.name}</h3>
                     <p>{elem.profession_type + " | " + this.capFirst(elem.difficulty)}</p>
                     <p>{elem.one_liner}</p>
                     <br/>
                     <div className="" style={{paddingRight: 10}}>{tags}</div>
                   </CardText>
                 </Card>
              </MuiThemeProvider>
            </Col>
          </Link>
        )
      });
      if(result.length > 0) return result;
      else if(this.state.searchTerm) return <div>"{this.state.searchTerm}" did not match any results</div>;
      else return <div>There were no projects matching the filters given</div>;
      // this.setState({renderedProjects: result})
    } else {
        return <div></div>;
        // this.setState({renderedProjects: <div>Projects have not loaded</div>})
    }
  }

  getBackgroundImg = (imgLink) => {
    let imgCSS = "url(" + imgLink + ") center center / cover no-repeat";
    return (
      <div className="projectPhoto" style={{backgroundColor: "#2F9CAA",background:imgCSS, backgroundSize: "cover"}}></div>
    );
  }

  //option parameter should be either 'difficulty', 'company', or 'profession'
  handleOpen = (option, event) => {
    event.preventDefault();
    this.setState({open: true, dialogChoice: option});
  }

  handleClose = () => {
    this.setState({open: false})
  }

  viewAll = () => {
    this.setState({filters: {}, selectCompany: '', selectProfession: '', selectDifficulty: '', searchTerm:'', onboardDifficulties: [], onboardProfessions: [], onboardCompanies: []});
  }

  selectAll = filter => {
    let temp = this.state.filters;
    if(filter === 'difficulty') {
      temp['difficulty'] = this.state.allDifficulties;
      this.setState({filters: temp, onboardDifficulties: this.state.allDifficulties, selectDifficulty: 'All'});
    } else if (filter === 'company') {
      temp['posting_company'] = this.state.allCompanies;
      this.setState({filters: temp, onboardCompanies: this.state.allCompanies, selectCompany: 'All'});
    } else if (filter === 'profession') {
      temp['profession_type'] = this.state.allProfessions;
      this.setState({filters: temp, onboardProfessions: this.state.allProfessions, selectProfession: 'All'});
    }
  }

  removeAll = filter => {
    let temp = this.state.filters;
    if(filter === 'difficulty') {
      delete temp['difficulty'];
      this.setState({filters: temp, selectDifficulty: '', onboardDifficulties: []});
    } else if (filter === 'company') {
      delete temp['posting_company'];
      this.setState({filters: temp, selectCompany: '', onboardCompanies: []});
    } else if (filter === 'profession') {
      delete temp['profession_type'];
      this.setState({filters: temp, selectProfession: '', onboardProfessions: []});
    }
  }

  render() {
    let temp = this.state.allProfessions || this.state.professions;
    let onboardProfessions = _.map(temp, (elem,index) => {
      let bg;
      if(_.indexOf(this.state.onboardProfessions, elem) !== -1) bg = {display: 'block', marginTop: 10, border: '#FF7043 solid 2px', backgroundColor: '#fff'};
      else bg = {display: 'block', marginTop: 10, backgroundColor: '#fff', color: '#000'};
      return (
        <MuiThemeProvider key={'onboardProfessions-'+index} muiTheme={getMuiTheme()}>
          <FlatButton onTouchTap={() => this.handleProfessions(elem)} label={elem} fullWidth={true} style={bg}/>
        </MuiThemeProvider>
      )
    })

    let onboardCompanies = _.map(this.state.allCompanies, (elem, index) => {
      let bg;
      if(_.indexOf(this.state.onboardCompanies, index) !== -1) bg = {height: 80, marginTop: 15, border: '#FF7043 solid 2px', backgroundColor: '#fff'}
      else bg = {height: 80, marginTop: 15, backgroundColor: '#fff'}
      return (
        <Col key={'onboardCompanies-'+elem.name} className="center-align" s={12} m={3}>
          <FlatButton fullWidth={true} onTouchTap={() => this.handleCompanies(index)} style={bg} label={<img src={process.env.PUBLIC_URL + '/img/' + elem.name.toLowerCase() + '.png'} style={{maxHeight: 50, maxWidth: '85%', paddingTop: 10}} alt={elem.name + ' Banner'}/>}/>
        </Col>
      )
    })

    let onboardDifficulties = _.map(['beginner', 'moderate', 'advanced', 'expert'], (elem, index) => {
      let bg;
      if(_.indexOf(this.state.onboardDifficulties, elem) !== -1) bg = {display: 'block', marginTop: 10, border: '#FF7043 solid 2px', backgroundColor: '#fff'};
      else bg = {display: 'block', marginTop: 10, backgroundColor: '#fff', color: '#000'};
      return (
        <MuiThemeProvider key={'onboardDifficulties-'+index} muiTheme={getMuiTheme()}>
          <FlatButton onTouchTap={() => this.handleDifficulties(elem)} label={elem} fullWidth={true} style={bg}/>
        </MuiThemeProvider>
      )
    })

    return (
      <div className="browseProjectsSection">
        <div className="darkBlueBg">
          <div className="container">
            <Row>
              <Col s={12} l={8} className="left-align">
                <p style={{color:"white"}} className="topTagline">Explore brilliant project ideas</p>
              </Col>
              <Col s={12} l={4}>
                <form onSubmit={(e) => {this.passSearch(e)}}>
                  <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <TextField fullWidth={true} floatingLabelText="Tag/Name Search" name="search" onChange={(e) => {this.handleChange(e)}} style={{margin:"0px"}} />
                  </MuiThemeProvider>
                </form>
              </Col>
            </Row>
            <Row className="filterOptions">
              <Col s={12} m={12} l={4}>
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                  <TextField style={{cursor: 'pointer'}} onTouchTap={(e) => this.handleOpen('Difficulty', e)} className="truncate" value={this.state.selectDifficulty} floatingLabelText="Difficulty"/>
                </MuiThemeProvider>
              </Col>
              <Col s={12} m={12} l={4}>
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                  <TextField style={{cursor: 'pointer'}} onTouchTap={(e) => this.handleOpen('Profession', e)} className="truncate" value={this.state.selectProfession} floatingLabelText="Professions"/>
                </MuiThemeProvider>
              </Col>
              <Col s={12} m={12} l={4}>
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                  <TextField style={{cursor: 'pointer'}} onTouchTap={(e) => this.handleOpen('Company', e)} className="truncate" value={this.state.selectCompany} floatingLabelText="Companies"/>
                </MuiThemeProvider>
              </Col>
            </Row>
          </div>
        </div>
        
        <div style={{backgroundColor:"#ECECEC", paddingTop:20}}>

          <div className="container">
            <Row>
              {this.renderProjects()}
            </Row>
            <MuiThemeProvider muiTheme={getMuiTheme()}>
              <Dialog
                title={this.state.dialogChoice}
                modal={false}
                open={this.state.open}
                onRequestClose={this.handleClose}
                autoScrollBodyContent={true}
              >
                {this.state.dialogChoice === 'Difficulty' &&
                  <div>
                    <FlatButton label="Select All" onTouchTap={() => this.selectAll('difficulty')}/>
                    <FlatButton label="Clear All" onTouchTap={() => this.removeAll('difficulty')}/>
                    {onboardDifficulties}
                  </div>
                }
                {this.state.dialogChoice === 'Profession' &&
                <div>
                  <FlatButton label="Select All" onTouchTap={() => this.selectAll('profession')}/>
                  <FlatButton label="Clear All" onTouchTap={() => this.removeAll('profession')}/>
                  {onboardProfessions}
                </div>
                }
                {this.state.dialogChoice === 'Company' &&
                <div>
                  <FlatButton label="Select All" onTouchTap={() => this.selectAll('company')}/>
                  <FlatButton label="Clear All" onTouchTap={() => this.removeAll('company')}/>
                  {onboardCompanies}
                </div>
                }
              </Dialog>
            </MuiThemeProvider>
          </div>
        </div>
      </div>
    );
  }
}

export default SearchProjects;

/*
<Col className="center-align hide-on-med-and-up" style={{marginBottom: 20}} s={12} m={3} l={2}>
  <MuiThemeProvider muiTheme={getMuiTheme()}>
    <RaisedButton backgroundColor="#B0BEC5" label={this.state.filterButton} onTouchTap={this.handleShowFilters}/>
  </MuiThemeProvider>
</Col>
<Col id="filters" s={12} m={3} l={2}>
  <h2 style={{fontSize: '1.5rem', marginTop: 0}}>Filter By</h2>
  <h3 style={{fontSize: '1.2rem'}}>Duration</h3>
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
<Col className="hide-on-med-and-up" s={12} m={3} l={2}>
  <hr style={{marginBottom: 30}}/>
</Col>
  <Col s={12} m={9} l={10}>
    <h2 style={{fontSize: '2rem', marginTop: -6}}>Results</h2>
    {this.renderProjects()}
  </Col>
*/
