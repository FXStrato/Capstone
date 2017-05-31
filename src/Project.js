/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import {Row, Col} from 'react-materialize';
import { withRouter, Link } from 'react-router-dom';
import { TextField, RaisedButton, Checkbox, Dialog, FlatButton, Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import firebase from 'firebase';
import SignUpForm from './signupForm';
import SignInForm from './signinForm';
import _ from 'lodash';
import Loading from './loading.js';
import FA from 'react-fontawesome';

/* Page displaying the specific details of each project */

class Project extends Component {
  state = {
    open: false,
    project: {},
    projID: this.props.match.params.projectID,
    isAuth: this.props.isAuth,
    userID: this.props.userID,
    showLoading: false,
    view: 'a',
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
      firebase.database().ref('users/' + newProps.userID).once('value').then((snapshot) => {
        if(_.indexOf(snapshot.val().activeProjects, this.state.projID) > -1) this.setState({isActiveProject: true});
        if(snapshot.val().completedProjects[this.state.projID]) {
          this.setState({isCompletedProject: true, open: false});
        }
      })
    }
  }


  componentDidMount = () => {
    window.scrollTo(0, 0)
    if(this.props.userID) {
      firebase.database().ref('users/' + this.props.userID).once('value').then((snapshot) => {
        if(_.indexOf(snapshot.val().activeProjects, this.state.projID) > -1) this.setState({isActiveProject: true});
        if(snapshot.val().completedProjects[this.state.projID]) {
          this.setState({isCompletedProject: true});
        }
      })
    }
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

  addProjectToUser = () => {
    this.setState({
      showLoading : true
    });
    firebase.database().ref('users/' + this.state.userID + "/activeProjects").once('value', (snapshot) => {
      var actProjects = snapshot.val();
      // If this is the first project that the user is adding to their list
      if(actProjects === null){
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
        //this.props.history.push('/projectfull/' + this.state.projID)
        this.setState({showLoading: false, open: false});
        location.reload();
      });
    });
  }

  handleOpen = () => {
    this.setState({open: true})
  };

  handleClose = () => {
    this.setState({open: false})
  };

  handleReturn = () => {
    this.props.history.goBack();
  }

  //helper function
  capFirst = (string) => {
    if(string) return string.charAt(0).toUpperCase() + string.slice(1);
    else return '';
  }

  getProjectHeader = (imgLink,title,profession,diff,dueDate) => {
    let imgCSS = "url(" + imgLink + ") center center / cover no-repeat";
    return (
      <div className="" style={{backgroundColor: "#2F9CAA",background:imgCSS, backgroundSize: "cover"}}>
        {/*<div style={{background:"rgba(0, 0, 0, 0.5)"}}>
          <div className="container" style={{paddingTop:"10px"}}>
            <Link to="/browse" style={{color:"white"}}> <FA name="angle-double-left"></FA> Back To Projects</Link>
          </div>
        </div>*/}

        <div className="projectHeaderSection">
          <div className="container">
            <p className="howmightyouTagline">How might you...</p>
            <h1>{title}</h1>
            <div className="chip">{profession}</div>
            <div className="chip">Difficulty: {this.capFirst(diff)}</div>
            <div className="chip">Project Ends: {dueDate}</div>
          </div>
        </div>

      </div>
    );
  }

  render() {
    console.log(this.state.project);
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

    let showButton;
    if(this.state.isActiveProject) {
      showButton = <MuiThemeProvider muiTheme={getMuiTheme()}>
        <RaisedButton primary={true} fullWidth={true} onTouchTap={() => this.props.history.push('/submit/' + this.state.projID)} label="Submit Project" />
      </MuiThemeProvider>;
    } else if(this.state.isCompletedProject) {
      showButton = <MuiThemeProvider muiTheme={getMuiTheme()}>
        <RaisedButton primary={true} fullWidth={true} disabled={true} label="Submitted" />
      </MuiThemeProvider>
    } else {
      showButton = <MuiThemeProvider muiTheme={getMuiTheme()}>
        <RaisedButton secondary={true} fullWidth={true} onTouchTap={() => {this.handleOpen('fullOpen')}} label="Begin Project" />
      </MuiThemeProvider>
    }

    let result;
    switch (this.state.view) {



      // Summary Page Content
      case 'a':
      let tags = _.map(this.state.project.tags, (elem2, index2) => {
        return (
          <div key={'project_'+index2} className="chip">{elem2}</div>
        )
      });

      let companies = _.map(this.state.project.supporting_companies, (elem2, index2) => {
        console.log(elem2);
        return (
          <div key={index2} style={{textAlign:"center"}}>
              <img className="logoImage" src={process.env.PUBLIC_URL + '/img/' + elem2.props.children.toLowerCase() + '.png'}/>
          </div>
        )
      });

      result = <div className="projectContent">
        <Row>
          <Col s={12} m={8}>
            <h3>Project Description</h3>
            <p style={{padding: '10px'}}>{this.state.project.short_description}</p>
            <p>Tags</p>
            {tags}
          </Col>
          <Col s={12} m={4} style={{textAlign:"center"}}>
            <h4>Interested Companies</h4>
            {companies}
          </Col>
        </Row>

      </div>
      break;

      // Requirements Page Content
      case 'b':
      let reqs = _.map(this.state.project.submission_requirements, (elem, index) => {
        return (
          <li>{elem}</li>
        )
      });
      result = <div className="projectContent">
        <h3>Project Requirements</h3>
        <p>The following are required to be in your submission in order to be evaluated by employers.</p>
        <ul>{reqs}</ul>
      </div>
      break;

      // Scope Page Content
      case 'c':
      let targetProject = this.state.project;
      let personas = _.map(targetProject.scope.personas, (elem, index) => {
        return (
          <Col s={12} m={6}>
            <h3>{elem.name}</h3>
            <h4>{elem.title}</h4>
            <ul>
              <li>Age: {elem.age}</li>
              <li>Employment: {elem.employment}</li>
              <li>Income: {elem.income}</li>
              <li>Location: {elem.location}</li>
            </ul>
            <p>{elem.biography}</p>
          </Col>
        )
      });

      let usecases = _.map(targetProject.scope.use_cases, (elem, index) => {
        return (
          <li key={index}>{elem}</li>
        )
      });

      let platforms = _.map(targetProject.scope.platform, (elem, index) => {
        return (
          <li key={index}>{elem}</li>
        )
      });

      result = <div className="projectContent">
        <h3>Optional Project Scope</h3>
        <p>The following is an optional project scope that you can use to narrow your project and get ideas for what to consider for this project. It is not required that reference it nor will it affect employer evaluation if you use it.</p>
        {this.state.isActiveProject ?
          
          <div>
            <Row>
              <Col s={12} m={8}>
                <h3>User Personas</h3>
                <p>Here are example user personas of people who would use this product.</p>
                <Row>
                  {personas}
                </Row>
              </Col>
              <Col s={12} m={4}>
                <h3>Use Cases</h3>
                  <ul>
                    {usecases}
                  </ul>
                  <h3>Platform Considerations</h3>
                  <p>Here are platform that you could consdier designing this experience for:</p>
                  <ul>
                    {platforms}
                  </ul>
              </Col>
            </Row>
          </div>
        :
          <div>
            
            <div className="lockedContent">
              <h2> <FA name="lock"></FA> </h2>
              <h3>You must begin the project in order to see the scope</h3>
            </div>
          </div>
        }
      </div>
      break;

      // Helpful Resources Page Content
      case 'd':
      let resources = _.map(this.state.project.additional_resources, (elem, index) => {
        return (
          <div key={index}>{elem}</div>
        )
      });

      result = <div className="projectContent">
        <h3>Helpful Resources</h3>
        <p>The following is an optional project scope that you can use to narrow your project and get ideas for what to consider for this project. It is not required that reference it nor will it affect employer evaluation if you use it.</p>
        {this.state.isActiveProject ?
          <ul>
            {resources}
          </ul>
        :
          <div className="lockedContent">
            <h2> <FA name="lock"></FA> </h2>
            <h3>You must begin the project in order to see the helpful resources</h3>
          </div>
        }
      </div>
      break;

      // Inspiration Page Content
      case 'e':
      result = <div className="projectContent">
        <h3>Inspiration</h3>
        <p>The following is an optional project scope that you can use to narrow your project and get ideas for what to consider for this project. It is not required that reference it nor will it affect employer evaluation if you use it.</p>
        {this.state.isActiveProject ?
          <div style={{padding: '10px'}}>
            <p>Inspirational content coming soon!</p>
          </div>
        :      
          <div className="lockedContent">
            <h2> <FA name="lock"></FA> </h2>
            <h3>You must begin the project in order to see the project's inspiration</h3>
          </div>
        }
      </div>
      break;


      default:
      result = <div className="projectContent">
        Default switch case
      </div>
    }

    return (
      <section id="projectPage">
        {this.state.showLoading ? <Loading /> : ""}

        {this.getProjectHeader(this.state.project.cover_image_link,this.state.project.name,this.state.project.profession_type,this.state.project.difficulty,this.state.project.due_date)}

        <div className="container">
          <Row className="zeroBotMargin">

              <Col s={12} m={4} l={2}>
                <div className="projectPartButtons">
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                  <FlatButton style={{textAlign:"right"}} fullWidth={true} label="Summary" onTouchTap={() => this.setState({view: 'a'})} />
                </MuiThemeProvider>
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                  <FlatButton style={{textAlign:"right"}} fullWidth={true} label="Requirements" onTouchTap={() => this.setState({view: 'b'})} />
                </MuiThemeProvider>
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                  <FlatButton style={{textAlign:"right"}} fullWidth={true} label="Scope" onTouchTap={() => this.setState({view: 'c'})} />
                </MuiThemeProvider>
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                  <FlatButton style={{textAlign:"right"}} fullWidth={true} label="Resources" onTouchTap={() => this.setState({view: 'd'})} />
                </MuiThemeProvider>
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                  <FlatButton fullWidth={true} style={{marginBottom: 20, textAlign:"right"}} label="Inspiration" onTouchTap={() => this.setState({view: 'e'})} />
                </MuiThemeProvider>

                <div className="hide-on-med-and-down">{showButton}</div>
                </div>
              </Col>

            <Col s={12} m={8} l={10}>
                {result}
            </Col>
            <Col s={12} className="hide-on-large-only">
              {showButton}
              <br/>
              <br/>
            </Col>
          </Row>
        </div>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <Dialog
            title=""
            actions={this.state.isAuth ? actions : nonlogactions}
            modal={false}
            open={this.state.open}
            onRequestClose={() => {this.handleClose()}}
          >
            {this.state.isAuth ?
              <div>
                <h3>Begin {this.state.project.name}</h3>
                <p>Would you like to begin this project?</p>
              </div>
            :
              <div>
                <h3>Sign up to begin {this.state.project.name}</h3>
                <p>Create an account to start this project!</p>
                <SignUpForm/>
                <p>Already have an account? Log in:</p>
                <SignInForm/>
              </div>
            }
          </Dialog>
        </MuiThemeProvider>
      </section>
    );
  }
}


export default withRouter(Project);

/*
{Object.keys(this.state.project).length > 0 ?
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
          {showButton}
        </div>
      </div>
    </Col>
  </Row>
  :
  <div>That project doesn't exist. <a href="" onTouchTap={this.handleReturn}>Click here to return to your previous location.</a></div>
}
*/
