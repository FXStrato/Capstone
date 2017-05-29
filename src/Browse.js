/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import { Link } from 'react-router-dom';
import { TextField, RaisedButton, Tabs, Tab, Step, Stepper, StepLabel, FlatButton, CircularProgress } from 'material-ui';
import firebase from 'firebase';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import _ from 'lodash';
import ArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import SearchProjects from './SearchProjects';

/*New search projects. Contains onboarding and manual searching of available projects*/

class Browse extends Component {
  state = {
    isAuth: undefined,
    type: this.props.match.params.type,
    value: 'b',
    finished: this.props.onboard,
    stepIndex: 0,
    completedSteps: [0],
    onboardProfessions: [],
    onboardCompanies: [],
    onboardDifficulties: [],
  }

  //Gives us the new authentication information
  componentWillReceiveProps = (newProps) => {
    if(this.state.isAuth !== newProps.isAuth) {
      this.setState({
        isAuth: newProps.isAuth,
        userID: newProps.userID,
      });
    }
    if(this.state.onboard !== newProps.onboard) {
      this.setState({finished: newProps.onboard})
    }
  }

  //Upon mounting component, pick up all available projects
  //TODO: Change the durations to difficulties
  componentDidMount = () => {
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

  //Handles changing tab view
  handleChange = (value, step) => {
    window.scrollTo(0,0);
    //We reached the end. Show last tab for a few seconds, then transition into regular browse page.
    if(value === 'e') {
      if(this.state.isAuth) {
        firebase.database().ref('users/' + this.props.userID + "/onboard").once('value', (snapshot) => {
          if(!snapshot.val()) {
            //Set onboard to true so that they don't need to go through onboarding process again
            firebase.database().ref('users/' + this.props.userID).update({
              onboard: true
            })
          }
        });
      }
      setTimeout(() => {
        this.setState({finished: true});
      }, 1000);
    }
    if(_.indexOf(this.state.completedSteps, step) !== -1) this.handlePrev();
    else this.handleNext();
    this.setState({value: value});
  }

  //Handles changing the steps in the progress stepper to the next value
  handleNext = () => {
    const {stepIndex, completedSteps} = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 4,
      completedSteps: completedSteps.concat(stepIndex + 1)
    });
  };

  handlePrev = () => {
    const {stepIndex} = this.state;
    let temp = this.state.completedSteps;
    temp.pop();
    this.setState({stepIndex: stepIndex - 1, completedSteps: temp});
  }

  handleOnboardProfessions = (profession) => {
    if(_.indexOf(this.state.onboardProfessions, profession) === -1) {
      //Means that it doesn't currently exist, add it in
      this.setState({onboardProfessions: this.state.onboardProfessions.concat(profession)})
    } else {
      let result = _.remove(this.state.onboardProfessions, (n) => {
        return n !== profession;
      })
      this.setState({onboardProfessions: result});
    }
  }

  handleOnboardCompanies = (company) => {
    if(_.indexOf(this.state.onboardCompanies, company) === -1) {
      //Means that it doesn't currently exist, add it in
      this.setState({onboardCompanies: this.state.onboardCompanies.concat(company)})
    } else {
      let result = _.remove(this.state.onboardCompanies, (n) => {
        return n !== company;
      })
      this.setState({onboardCompanies: result});
    }
  }

  //Difficulties should be sorted using a parameter in firebase, easier to manage that way.
  handleOnboardDifficulties = (difficulty) => {
    if(_.indexOf(this.state.onboardDifficulties, difficulty) === -1) {
      //Means that it doesn't currently exist, add it in
      this.setState({onboardDifficulties: this.state.onboardDifficulties.concat(difficulty)})
    } else {
      let result = _.remove(this.state.onboardDifficulties, (n) => {
        return n !== difficulty;
      })
      this.setState({onboardDifficulties: result});
    }
  }

  render = () => {
    let onboardProfessions = _.map(this.state.professions, (elem,index) => {
      let bg;
      if(_.indexOf(this.state.onboardProfessions, elem) !== -1) bg = {display: 'block', marginTop: 10, border: '#FF7043 solid 2px', backgroundColor: '#fff'};
      else bg = {display: 'block', marginTop: 10, backgroundColor: '#fff', color: '#000'};
      return (
        <MuiThemeProvider key={'onboardProfessions-'+index} muiTheme={getMuiTheme()}>
          <FlatButton onTouchTap={() => this.handleOnboardProfessions(elem)} label={elem} fullWidth={true} style={bg}/>
        </MuiThemeProvider>
      )
    })

    let onboardCompanies = _.map(this.state.allCompanies, (elem, index) => {
      let bg;
      if(_.indexOf(this.state.onboardCompanies, index) !== -1) bg = {height: 80, marginTop: 15, border: '#FF7043 solid 2px', backgroundColor: '#fff'}
      else bg = {height: 80, marginTop: 15, backgroundColor: '#fff'}
      return (
        <Col key={'onboardCompanies-'+elem.name} className="center-align" s={12} m={3}>
          <FlatButton fullWidth={true} onTouchTap={() => this.handleOnboardCompanies(index)} style={bg} label={<img src={process.env.PUBLIC_URL + '/img/' + elem.name.toLowerCase() + '.png'} style={{maxHeight: 50, maxWidth: '85%', paddingTop: 10}} alt={elem.name + ' Banner'}/>}/>
        </Col>
      )
    })

    let onboardDifficulties = _.map(['beginner', 'moderate', 'advanced', 'expert'], (elem, index) => {
      let bg;
      if(_.indexOf(this.state.onboardDifficulties, elem) !== -1) bg = {display: 'block', marginTop: 10, border: '#FF7043 solid 2px', backgroundColor: '#fff'};
      else bg = {display: 'block', marginTop: 10, backgroundColor: '#fff', color: '#000'};
      return (
        <MuiThemeProvider key={'onboardDifficulties-'+index} muiTheme={getMuiTheme()}>
          <FlatButton onTouchTap={() => this.handleOnboardDifficulties(elem)} label={elem} fullWidth={true} style={bg}/>
        </MuiThemeProvider>
      )
    })

    let full = this.state.finished;
    if(full === undefined) {
      full = <div></div>
    } else if(!full) {
      full = (
        <Row>
          <Col s={12}>
            <MuiThemeProvider muiTheme={getMuiTheme()}>
              <Stepper activeStep={this.state.stepIndex} style={{width: '85%', marginLeft: '7%'}}>
                <Step completed={true}><StepLabel/></Step>
                <Step completed={_.indexOf(this.state.completedSteps, 1) !== -1}><StepLabel/></Step>
                <Step completed={_.indexOf(this.state.completedSteps, 2) !== -1}><StepLabel/></Step>
                <Step completed={_.indexOf(this.state.completedSteps, 3)!== -1}><StepLabel/></Step>
                <Step><StepLabel/></Step>
              </Stepper>
            </MuiThemeProvider>
          </Col>
          <Col s={12}>
            <MuiThemeProvider muiTheme={getMuiTheme()}>
              <Tabs
                value={this.state.value}
                onChange={this.handleChange}
                inkBarStyle={{zIndex: '10', backgroundColor: '#000'}}
              >
                <Tab disabled={true} buttonStyle={{backgroundColor: '#fff', color: '#000'}} label={<div><span className="hide-on-med-and-down">{this.state.type}</span><span className="hide-on-large-only">1</span></div>} value="a">
                </Tab>
                <Tab disabled={true} buttonStyle={{backgroundColor: '#fff', color: '#000'}} label={<div><span className="hide-on-med-and-down">Select Profession</span><span className="hide-on-large-only">2</span></div>} value="b">
                  <Row className="reduced-bot-margin">
                    <Col s={12}>
                      <h2 style={{fontSize: '1.5rem'}}>Let's find you the perfect project for your design portfolio</h2>
                    </Col>
                  </Row>
                  <Row>
                    <Col s={12} m={6}>
                      <p style={{marginTop: -10}}>What professions are you interested in?</p>
                      {onboardProfessions}
                      <FlatButton label={<span style={{marginLeft: 27}}>Next</span>} onTouchTap={() => this.handleChange('c', 2)} fullWidth={true} labelPosition="before" style={{backgroundColor: '#CFD8DC', marginTop: 10}} icon={<ArrowRight className="right" style={{paddingTop: 12}}/>}/>
                    </Col>
                  </Row>
                </Tab>
                <Tab disabled={true} buttonStyle={{backgroundColor: '#fff', color: '#000'}} label={<div><span className="hide-on-med-and-down">Select Companies</span><span className="hide-on-large-only">3</span></div>} value="c">
                  <Row>
                    <Col s={12} className="center-align">
                      <h2 style={{fontSize: '1.5rem'}}>Great! Now what companies are you interested in?</h2>
                      <p>Select all that apply</p>
                    </Col>
                    {onboardCompanies}
                  </Row>
                  <Row>
                    <Col s={6} offset={'s3'}>
                      <FlatButton label={<span style={{marginLeft: 27}}>Next</span>} onTouchTap={() => this.handleChange('d',3)} fullWidth={true} labelPosition="before" style={{backgroundColor: '#CFD8DC', marginTop: 10}} icon={<ArrowRight className="right" style={{paddingTop: 12}}/>}/>
                      <FlatButton style={{marginTop: 10, backgroundColor: '#E0E0E0'}} label='Back' fullWidth={true} onTouchTap={() => this.handleChange('b', 1)}/>
                    </Col>
                  </Row>
                </Tab>
                <Tab disabled={true} buttonStyle={{backgroundColor: '#fff', color: '#000'}} label={<div><span className="hide-on-med-and-down">Select Difficulty</span><span className="hide-on-large-only">4</span></div>} value="d">
                  <Row>
                    <Col s={12}><h2 style={{fontSize: '1.5rem'}}>How difficult should the projects be?</h2></Col>
                    <Col s={6}>
                      {onboardDifficulties}
                      <FlatButton label={<span style={{marginLeft: 27}}>Next</span>} onTouchTap={() => this.handleChange('e',4)} fullWidth={true} labelPosition="before" style={{backgroundColor: '#CFD8DC', marginTop: 10}} icon={<ArrowRight className="right" style={{paddingTop: 12}}/>}/>
                      <FlatButton style={{marginTop: 10, backgroundColor: '#E0E0E0'}} label='Back' fullWidth={true} onTouchTap={() => this.handleChange('c', 2)}/>
                    </Col>
                  </Row>
                </Tab>
                <Tab disabled={true} buttonStyle={{backgroundColor: '#fff', color: '#000'}} label={<div><span className="hide-on-med-and-down">See Projects</span><span className="hide-on-large-only">5</span></div>} value="e">
                  <Row>
                    <Col className="center-align" offset={'s3'} s={6} style={{marginTop: 40, paddingBottom: 40, backgroundColor: 'rgba(0,0,0,0.7)'}}>
                      <h2 style={{fontSize: '1.5rem', color: '#fff'}}>Searching for the best projects for you...</h2>
                      <CircularProgress size={100} thickness={5}/>
                    </Col>
                  </Row>
                </Tab>
              </Tabs>
            </MuiThemeProvider>
          </Col>
        </Row>
      )
    }
    else full = <SearchProjects param={this.props.match.params.type} onboardCompanies={this.state.onboardCompanies} onboardProfessions={this.state.onboardProfessions} onboardDifficulties={this.state.onboardDifficulties} allDifficulties={this.state.difficulties} allProfessions={this.state.professions} allCompanies={this.state.allCompanies} allProjects={this.state.allProjects}/>
    return (
      <div className="container">
        {full}
      </div>
    )
  }
}

export default Browse;
