/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import {Row, Col} from 'react-materialize';
import { RaisedButton, Dialog, FlatButton, TextField } from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import firebase from 'firebase';
import _ from 'lodash';

/* Page displaying the specific details of each project */

class Project extends Component {
  state = {
    open: false,
    projTitle: '',
    projDesc: '',
    projLiner: '',
    projTags: '',
    projPostingCompany: '',
    projSupportingComps: '',
    projResources: '',
    projProfessionID: '',
    projPostDate: '',
    projEndDate: '',
    projEstimatedDuration: '',
    projRequirements: '',
    projFull: '',
    projID: this.props.params.projectID,
    projImage: '',
    projProfession: '',
  }

//Temp: -Kh4diidw7jpXDbKz-go

  componentDidMount = () => {
    window.scrollTo(0, 0);
    firebase.database().ref('/projects/' + this.props.params.projectID).once('value').then((snapshot) => {
      let temp = snapshot.val();

      //Additional Resources
      let addResources = _.map(temp.additional_resources, (elem,index) => {
        return <li key={'addResource-'+index}>{elem}</li>
      });

      this.setState({projTitle: temp.name, projDesc: temp.short_description, projEndDate: temp.due_date, projEstimatedDuration: temp.estimated_duration, projLiner: temp.one_liner, projProfessionID: temp.profession_type, projPostDate: temp.posting_date, projImage: temp.cover_image_link, projRequirements: temp.submission_requirements, projResources: addResources});

      firebase.database().ref('/professions/').once('value').then((snapshot) => {
        this.setState({projProfession: snapshot.val()[temp.profession_type]});
      });
      firebase.database().ref('/companies/').once('value').then((snapshot) => {
        let supportResults = _.map(temp.supporting_companies, (elem, index) => {
          return <span key={'supportingCompany-'+index} style={{marginRight: 10}}>{snapshot.val()[elem]['name']}</span>;
        });
        this.setState({projPostingCompany: snapshot.val()[temp.posting_company]['name'], projSupportingComps: supportResults});
      });
    });
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };


  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onTouchTap={this.handleClose}
      />,
    ];
    return (
      <section id="projectPage">
        <div className="container">
          <Row>
            <Col s={8} m={8}>
              <h2 className="projectTitle">{this.state.projTitle || 'Empty project'}</h2>
              <h4 className="oneLiner">
                {this.state.projLiner || 'One liner goes here'}
              </h4>
              <Row>
                <Col s={4}>
                  <p>{this.state.projProfession || 'Profession goes here'}</p>
                </Col>
                <Col s={4}>
                  <p>Posted: {this.state.projPostDate || 'Post Date'}</p>
                </Col>
                <Col s={4}>
                  <p>Submission Due: {this.state.projEndDate || 'End Date'}</p>
                </Col>
              </Row>
              
              
              <p>{this.state.projDesc || 'Project description'}</p>
              <br/>
              
              <div>
                <ul>
                  Additional Resources:
                  {this.state.projResources}
                </ul>
              </div>
              <div>
                Tags:
                <div className="chip">Java</div>
                <div className="chip">Python</div>
                <div className="chip">Django</div>
                <div className="chip">SQL</div>
              </div>
            </Col>
            <Col s={4} m={4}>
              <div className="card">
                <div className="card-image">
                  <img src={this.state.projImage} alt="AnswerDash Software Engineer Banner" className="responsive-img"/>

                </div>
                
                <div className="card-content">
                  <div>Posting Company: <b>{this.state.projPostingCompany || 'Posting company goes here'}</b></div>
                  <div style={{paddingBottom: "15px"}}>Supporting Companies: <b>{this.state.projSupportingComps || 'Supprting companies here'}</b></div>
                  <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <RaisedButton primary={true} fullWidth={true} onTouchTap={this.handleOpen} label="Submit Project" />
                  </MuiThemeProvider>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <Dialog
            title={"Submission for " + this.state.projTitle}
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
          >
            Submit a project link: <MuiThemeProvider muiTheme={getMuiTheme()}><TextField name="projectSubmission" /></MuiThemeProvider>
          </Dialog>
        </MuiThemeProvider>
      </section>
    );
  }
}


export default Project;
